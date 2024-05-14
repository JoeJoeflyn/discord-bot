import {
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("help")
  .setDescription("Show all useless bot commands")
  .addStringOption((option) => {
    return option
      .setName("command")
      .setDescription("Command name")
      .setRequired(false);
  });

export async function execute(interaction: CommandInteraction) {
  const word = interaction.options.get("command");

  let embed = new EmbedBuilder()
    .setColor("#947cea")
    .setAuthor({
      name: "Useless Bot help menu (9) commands",
    })
    .addFields(
      {
        name: "Bot (1)",
        value: `\`ping\``,
      },
      { name: "Dictionary (1)", value: `\`urban_dictionary\`` },
      { name: "Ai (1)", value: `\`asks\`` },
      {
        name: "Music (6)",
        value:
          `\`play\`, ` +
          `\`pause\`, ` +
          `\`resume\`, ` +
          `\`shuffle\`, ` +
          `\`skip\`, ` +
          `\`stop\``,
      }
    )
    .setTimestamp()
    .setFooter({
      text: "Do /help <command> to view how to use the command",
      iconURL:
        "https://i.pinimg.com/564x/b0/1a/2c/b01a2c6c066fb56f425030942a9f2c2b.jpg",
    });

  if (word?.value === "play") {
    embed = new EmbedBuilder()
      .setColor("#947cea")
      .setTitle("Command </play:1236381760829391051>")
      .addFields(
        {
          name: "Description :",
          value: `\`Play a song\``,
        },
        { name: "Usage :", value: `\`!play <song name or link or file>\`` }
      )
      .setTimestamp()
      .setFooter({
        text: "Do /help <command> to view how to use the command",
        iconURL:
          "https://i.pinimg.com/564x/b0/1a/2c/b01a2c6c066fb56f425030942a9f2c2b.jpg",
      });
  } else if (word?.value === "pause") {
    embed = new EmbedBuilder()
      .setColor("#947cea")
      .setTitle("Command </pause:1236358751150407706>")
      .addFields({
        name: "Description :",
        value: `\`Pause music\``,
      })
      .setTimestamp()
      .setFooter({
        text: "Do /help <command> to view how to use the command",
        iconURL:
          "https://i.pinimg.com/564x/b0/1a/2c/b01a2c6c066fb56f425030942a9f2c2b.jpg",
      });
  } else if (word?.value === "resume") {
    embed = new EmbedBuilder()
      .setColor("#947cea")
      .setTitle("Command </resume:1236358751150407708>")
      .addFields(
        {
          name: "Description :",
          value: `\`Resume the player\``,
        },
        { name: "Aliases :", value: `\`unpause\`` }
      )
      .setTimestamp()
      .setFooter({
        text: "Do /help <command> to view how to use the command",
        iconURL:
          "https://i.pinimg.com/564x/b0/1a/2c/b01a2c6c066fb56f425030942a9f2c2b.jpg",
      });
  } else if (word?.value === "shuffle") {
    embed = new EmbedBuilder()
      .setColor("#947cea")
      .setTitle("Command </shuffle:1236358751150407707>")
      .addFields({
        name: "Description :",
        value: `\`Shuffle the queue\``,
      })
      .setTimestamp()
      .setFooter({
        text: "Do /help <command> to view how to use the command",
        iconURL:
          "https://i.pinimg.com/564x/b0/1a/2c/b01a2c6c066fb56f425030942a9f2c2b.jpg",
      });
  } else if (word?.value === "skip") {
    embed = new EmbedBuilder()
      .setColor("#947cea")
      .setTitle("Command </skip:1236358751150407705>")
      .addFields(
        {
          name: "Description :",
          value: `\`Skip current song and start the next one\``,
        },
        { name: "Aliases :", value: `\`s\`, ` + `\`next\`` }
      )
      .setTimestamp()
      .setFooter({
        text: "Do /help <command> to view how to use the command",
        iconURL:
          "https://i.pinimg.com/564x/b0/1a/2c/b01a2c6c066fb56f425030942a9f2c2b.jpg",
      });
  } else if (word?.value === "stop") {
    embed = new EmbedBuilder()
      .setColor("#947cea")
      .setTitle("Command </stop:1236358751150407704>")
      .addFields({
        name: "Description :",
        value: `\`Disconnect the bot from voice channel\``,
      })
      .setTimestamp()
      .setFooter({
        text: "Do /help <command> to view how to use the command",
        iconURL:
          "https://i.pinimg.com/564x/b0/1a/2c/b01a2c6c066fb56f425030942a9f2c2b.jpg",
      });
  } else if (word?.value === "ping") {
    embed = new EmbedBuilder()
      .setColor("#947cea")
      .setTitle("Command </ping:1236358751150407700>")
      .addFields({
        name: "Description :",
        value: `\`Reply with latency\``,
      })
      .setTimestamp()
      .setFooter({
        text: "Do /help <command> to view how to use the command",
        iconURL:
          "https://i.pinimg.com/564x/b0/1a/2c/b01a2c6c066fb56f425030942a9f2c2b.jpg",
      });
  } else if (word?.value === "urban_dictionary") {
    embed = new EmbedBuilder()
      .setColor("#947cea")
      .setTitle("Command </urban_dictionary:1236358751150407701>")
      .addFields({
        name: "Description :",
        value: `\`Reply with definition of the word\``,
      })
      .setTimestamp()
      .setFooter({
        text: "Do /help <command> to view how to use the command",
        iconURL:
          "https://i.pinimg.com/564x/b0/1a/2c/b01a2c6c066fb56f425030942a9f2c2b.jpg",
      });
  } else if (word?.value === "asks") {
    embed = new EmbedBuilder()
      .setColor("#947cea")
      .setTitle("Command </asks:1236358751150407702>")
      .addFields({
        name: "Description :",
        value: `\`Reply with gemini!\``,
      })
      .setTimestamp()
      .setFooter({
        text: "Do /help <command> to view how to use the command",
        iconURL:
          "https://i.pinimg.com/564x/b0/1a/2c/b01a2c6c066fb56f425030942a9f2c2b.jpg",
      });
  }

  await interaction.reply({ embeds: [embed] });
}
