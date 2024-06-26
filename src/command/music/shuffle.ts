import { useQueue } from "discord-player";
import {
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("shuffle")
  .setDescription("Shuffle the queue.");

export async function execute(interaction: CommandInteraction) {
  const queue = useQueue(interaction?.guild?.id!);

  if (!queue?.isPlaying()) {
    const embed = new EmbedBuilder()
      .setColor("#df4746")
      .setURL("https://github.com/JoeJoeflyn")
      .setDescription(
        "I'm not playing music ! Add song with </play:1236381760829391051>."
      );

    await interaction.reply({ embeds: [embed] });
  }

  try {
    queue?.tracks.shuffle();

    const embed = new EmbedBuilder()
      .setColor("#6aba54")
      .setURL("https://github.com/JoeJoeflyn")
      .setDescription("☑️ Shuffled the queue");

    await interaction.reply({ embeds: [embed] });
  } catch (e) {
    await interaction.reply(`Something went wrong: ${e}`);
  }
}
