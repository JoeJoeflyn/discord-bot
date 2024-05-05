import { useQueue } from "discord-player";
import {
  Colors,
  ActionRowBuilder,
  AutocompleteInteraction,
  ButtonBuilder,
  ButtonStyle,
  CommandInteraction,
  EmbedBuilder,
  GuildMember,
  SlashCommandBuilder,
  bold,
  hyperlink,
  quote,
} from "discord.js";
import { player } from "./../../config/player";

export const data = new SlashCommandBuilder()
  .setName("play")
  .setDescription("Playing music from youtube")
  .addStringOption((option) =>
    option
      .setName("input")
      .setDescription("Type your word")
      .setRequired(true)
      .setAutocomplete(true)
      .addChoices()
  );

export async function autocompleterun(interaction: AutocompleteInteraction) {
  const input = interaction.options.getFocused();
  if (!input) {
    return;
  }
  const results = await player.search(input as string);

  return interaction.respond(
    results.tracks.slice(0, 10).map((t) => {
      const name = `${t.title} - ${t.author} - ${t.duration}`;
      const truncatedName =
        name.length > 100 ? name.substring(0, 97) + "..." : name;
      return {
        name: truncatedName,
        value: t.url,
      };
    })
  );
}

export async function execute(interaction: CommandInteraction) {
  if (
    !(interaction.member instanceof GuildMember) ||
    !interaction.member.voice.channel
  ) {
    const embed = new EmbedBuilder()
      .setColor("#df4746")
      .setURL("https://github.com/JoeJoeflyn")
      .addFields({
        name: "You have to be connected in a voice channel before you can use this command !",
        value: `${quote(
          hyperlink(
            "How to join a voice channel ?",
            "https://support.discord.com/hc/en-us/articles/360045138571-Beginner-s-Guide-to-Discord#h_9de92bc2-3bca-459f-8efd-e1e2739ca4f4"
          )
        )}`,
      });

    await interaction.reply({ embeds: [embed] });

    return;
  }
  const channel = interaction.member.voice.channel;
  const query = interaction.options.get("input");
  await interaction.deferReply();

  try {
    const queue = useQueue(interaction?.guild?.id!);

    if (queue?.isPlaying()) {
      const { track } = await player.play(channel, query?.value as string, {
        nodeOptions: {
          metadata: interaction,
          leaveOnEnd: false,
        },
      });

      const embed = new EmbedBuilder()
        .setColor("#6aba54")
        .setDescription(
          `Added ${bold(
            hyperlink(`${track.author} - ${track.title}`, track.url)
          )} - \`${track.duration.toString()}\``
        );

      await interaction.editReply({ embeds: [embed] });
    } else {
      const { track } = await player.play(channel, query?.value as string, {
        nodeOptions: {
          metadata: interaction,
          leaveOnEnd: false,
        },
      });

      const embed = new EmbedBuilder()
        .setColor("#6aba54")
        .setAuthor({
          name: "Now playing",
          url: "https://github.com/JoeJoeflyn",
        })
        .setThumbnail(track.thumbnail)
        .setDescription(
          `${bold(
            hyperlink(`${track.author} - ${track.title}`, track.url)
          )} - \`${track.duration.toString()}\``
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
          .setEmoji("▶️")
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId("stop")
          .setEmoji("⏹️")
          .setStyle(ButtonStyle.Secondary)
      );

      await interaction.editReply({ embeds: [embed], components: [row] });
    }
  } catch (e) {
    return interaction.followUp(`Something went wrong: ${e}`);
  }
}
