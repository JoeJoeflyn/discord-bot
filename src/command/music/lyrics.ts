import { GuildQueue, useQueue } from "discord-player";
import {
  ButtonInteraction,
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { getLyrics } from "../../api/lyrics";
import { truncateString } from "../../shared/utils";

export const data = new SlashCommandBuilder()
  .setName("lyrics")
  .setDescription("Get song lyrics");

export async function execute(
  interaction: CommandInteraction | ButtonInteraction
) {
  const queue = useQueue(interaction?.guild?.id!) as GuildQueue;

  if (!queue) {
    const embed = new EmbedBuilder()
      .setColor("#6aba54")
      .setDescription("No songs are currently played.");

    await interaction.reply({ embeds: [embed] });

    return;
  }

  const { currentTrack } = queue;

  try {
    await interaction.deferReply();

    const text = await getLyrics(currentTrack?.author!, currentTrack?.title!);

    if (!text || text.trim() === "") {
      const embed = new EmbedBuilder()
        .setColor("#6aba54")
        .setDescription("No lyrics found for this song.");
      await interaction.reply({ embeds: [embed] });

      return;
    }

    const embed = new EmbedBuilder()
      .setColor("#0099ff")
      .setTitle(`Lyrics for ${currentTrack?.title} by ${currentTrack?.author}`)
      .setDescription(truncateString(text, 4096))
      .setTimestamp()
      .setFooter({
        text: "Lyrics provided by azlyrics",
        iconURL:
          "https://i.pinimg.com/564x/b0/1a/2c/b01a2c6c066fb56f425030942a9f2c2b.jpg",
      });

    await interaction.editReply({ embeds: [embed] });
  } catch (e) {
    await interaction.reply(`Something went wrong: ${e}`);
  }
}
