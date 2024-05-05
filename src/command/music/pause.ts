import { useTimeline } from "discord-player";
import {
  ButtonInteraction,
  CommandInteraction,
  SlashCommandBuilder,
} from "discord.js";
import { Timeline } from "../../shared/interface/music";

export const data = new SlashCommandBuilder()
  .setName("pause")
  .setDescription("Pause the current song.");

export async function execute(
  interaction: CommandInteraction | ButtonInteraction
) {
  const { pause } = useTimeline(interaction?.guild?.id!) as Timeline;

  try {
    pause();
  } catch (e) {
    await interaction.reply(`Something went wrong: ${e}`);
  }
}
