import { useHistory, useQueue } from "discord-player";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
  bold,
  hyperlink,
} from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("skip")
  .setDescription("Skip current song and start the next one.");

export async function execute(
  interaction: CommandInteraction | ButtonInteraction
) {
  await interaction.deferReply();

  const queue = useQueue(interaction?.guild?.id!);

  queue?.node.skip();

  const nextTrack = useHistory(interaction?.guild?.id!);

  const track = nextTrack?.nextTrack!;

  if (!queue?.isPlaying()) {
    const embed = new EmbedBuilder()
      .setColor("#df4746")
      .setURL("https://github.com/JoeJoeflyn")
      .setDescription(
        "I'm not playing music ! Add song with </play:1235922618230640664>."
      );

    await interaction.editReply({ embeds: [embed] });
    return;
  }

  try {
    if (queue?.tracks.data.length === 0) {
      const embed = new EmbedBuilder()
        .setColor("#df4746")
        .setDescription("There are no songs in the queue to skip.");
      await interaction.editReply({ embeds: [embed] });
    } else {
      const embed = new EmbedBuilder()
        .setColor("#6aba54")
        .setAuthor({
          name: "Now playing",
          url: "https://github.com/JoeJoeflyn",
        })
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
    await interaction.editReply(`Something went wrong: ${e}`);
  }
}
