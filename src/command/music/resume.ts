import { useTimeline } from "discord-player";
import {
  ButtonInteraction,
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { Timeline } from "../../shared/interface/music";

export const data = new SlashCommandBuilder()
  .setName("resume")
  .setDescription("Resume the current song.");

export async function execute(
  interaction: CommandInteraction | ButtonInteraction
) {
  const { resume } = useTimeline(interaction?.guild?.id!) as Timeline;

  try {
    resume();
  } catch (e) {
    await interaction.reply(`Something went wrong: ${e}`);
  }
}
