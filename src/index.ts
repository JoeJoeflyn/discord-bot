import { usePlayer, useQueue } from "discord-player";
import {
  ActionRowBuilder,
  ActivityType,
  AutocompleteInteraction,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  TextChannel,
  bold,
  hyperlink,
} from "discord.js";
import http from "http";
import cron from "node-cron";
import { handleTimeout } from "./auto/timeout";
import { handleTwitchNotification } from "./auto/twitch";
import { commands } from "./command";
import { config } from "./config/config";
import { client, player } from "./config/player";
import { deployCommands } from "./deploy/deploy-commands";

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Discord bot is running\n");
});

const PORT = process.env.PORT || 3000;

player.extractors.loadDefault((ext) => ext !== "AppleMusicExtractor");

player.events.on("playerFinish", async (queue) => {
  const tracks = useQueue(queue.metadata.interaction.guild.id);
  const currentTrack = tracks?.tracks.data[0];

  if (currentTrack) {
    const channel = await client.channels.fetch(
      queue.metadata.interaction.channelId!
    );

    const message = await (channel as TextChannel)?.messages?.fetch({
      limit: 1,
    });

    const messageToEdit = message.first();

    const embed = new EmbedBuilder()
      .setColor("#6aba54")
      .setAuthor({
        name: "Now playing",
        url: "https://github.com/JoeJoeflyn",
      })
      .setThumbnail(currentTrack?.thumbnail!)
      .setDescription(
        `${bold(
          hyperlink(
            `${currentTrack?.author} - ${currentTrack?.title}`,
            currentTrack?.url!
          )
        )} - \`${currentTrack?.duration.toString()}\``
      )
      .setTimestamp()
      .setFooter({
        text: "Music Bot",
        iconURL:
          "https://i.pinimg.com/564x/b0/1a/2c/b01a2c6c066fb56f425030942a9f2c2b.jpg",
      });

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("skip")
        .setEmoji("⏩")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("pause")
        .setEmoji("⏸️")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("stop")
        .setEmoji("⏹️")
        .setStyle(ButtonStyle.Secondary)
    );

    if (channel instanceof TextChannel) {
      if (!messageToEdit?.embeds[0]?.footer) {
        queue.metadata.interaction.channel.send({
          embeds: [embed],
          components: [row],
        });
      } else {
        await messageToEdit?.edit({ embeds: [embed], components: [row] });
      }
    }
  }
});

player.events.on("emptyQueue", (queue) => {
  const embed = new EmbedBuilder()
    .setColor("#f1af32")
    .setTitle("Queue Concluded")
    .setDescription(
      "There are no more songs in the queue, you can add more with </play:1236381760829391051>."
    );

  queue.metadata.interaction.channel.send({ embeds: [embed] });
});

player.events.on("emptyQueue", (queue) => {
  setTimeout(() => {
    if (queue?.tracks.data.length === 0 && queue.currentTrack === null) {
      queue?.connection?.disconnect();
      const embed = new EmbedBuilder()
        .setColor("#f1af32")
        .setDescription("I left the voice channel due to inactivity.");

      queue.metadata.interaction.channel.send({ embeds: [embed] });
    }
  }, 60 * 1000 * 5);
});

client.once("ready", async () => {
  console.log("Discord bot is ready! 🤖");

  handleTwitchNotification(client);

  client.user?.setActivity({
    type: ActivityType.Custom,
    name: "custom status",
    state: "Listening to /help ✡ 🎶",
  });

  cron.schedule("0 14 * * *", () => {
    const yourUserID = "540730246064898089";
    const messages = [
      "Good morning! Wish you the best for a new day. 🌅",
      "Rise and shine! A new adventure awaits you. 🚀",
      "Good morning! Did you know? The Eiffel Tower can be 15 cm taller during the summer. 🗼",
      "Start your day with a smile and a positive thought. 😊",
      "Good morning! Remember, every day is a second chance. 🌈",
    ];

    const message = messages[Math.floor(Math.random() * messages.length)];

    client.users.fetch(yourUserID).then((user) => {
      user.send(message);
    });
  });
});

client.on("guildCreate", async (guild) => {
  await deployCommands({ guildId: guild.id });
});

client.on("guildMemberAdd", async (member) => {
  const guild = await member.guild.fetch();

  if (guild.ownerId) {
    const owner = await client.users.fetch(guild.ownerId);
    owner.send(`${member.displayName} has joined the server!`);
  }
});

client.on("messageCreate", async (message) => {
  handleTimeout(message);
});

client.on("interactionCreate", async (interaction) => {
  if (interaction.isButton()) {
    const customId = interaction.customId;
    const musicPlayer = usePlayer(interaction.guildId!);

    switch (customId) {
      case "pause":
        if (musicPlayer?.isPaused()) {
          await commands.resume.execute(interaction);
        } else {
          await commands.pause.execute(interaction);
        }
        break;
      case "stop":
        await commands.stop.execute(interaction);
        break;
      case "skip":
        await commands.skip.execute(interaction);
        break;
      default:
        break;
    }
  }

  if (interaction instanceof AutocompleteInteraction) {
    const commandName = interaction.commandName;

    if (commandName === "play") {
      await commands.play.autocompleterun(interaction);
    }
    return;
  }

  if (!interaction.isCommand()) return;

  const { commandName } = interaction;
  const command = commands[commandName as keyof typeof commands];

  if (!command) {
    interaction.reply(`No command matching ${commandName} was found.`);
    return;
  }

  try {
    if (interaction.deferred || interaction.replied) {
      // Interaction has already been handled
    } else {
      await command.execute(interaction);
    }
  } catch (error) {
    if (!interaction.replied) {
      console.log(error);

      await interaction.reply("An error occurred while executing the command.");
    }
  }
});

client.login(config.DISCORD_TOKEN).catch(console.error);

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);

  setInterval(() => {
    http.get(`http://localhost:${PORT}`);
  }, 600000);
});
