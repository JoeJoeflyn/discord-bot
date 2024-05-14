import { useQueue } from "discord-player";
import {
  ButtonInteraction,
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("stop")
  .setDescription("Disconnect the bot from voice channel");

export async function execute(
  interaction: CommandInteraction | ButtonInteraction
) {
  const queue = useQueue(interaction?.guildId!);
  if (!queue?.isPlaying()) {
    const embed = new EmbedBuilder()
      .setColor("#df4746")
      .setDescription(
        "I'm not playing music! Add a song with </play:1236381760829391051>."
      );
    await interaction.reply({ embeds: [embed] });
    return;
  }

  // Attempt to stop the music and clear the queue
  try {
    queue.delete();
    const embed = new EmbedBuilder()
      .setColor("#6aba54")
      .setDescription("⏹ The player has been successfully stopped.");
    await interaction.reply({ embeds: [embed] });
  } catch (e) {
    // Check if the interaction has already been replied to
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(`Something went wrong: ${e}`);
    } else {
      await interaction.reply(`Something went wrong: ${e}`);
    }
  }
}
