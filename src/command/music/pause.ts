import { useTimeline } from "discord-player";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  CommandInteraction,
  SlashCommandBuilder,
} from "discord.js";
import { Timeline } from "../../shared/interface";

export const data = new SlashCommandBuilder()
  .setName("pause")
  .setDescription("Pause the player.");

export async function execute(
  interaction: CommandInteraction | ButtonInteraction
) {
  const { pause } = useTimeline(interaction?.guild?.id!) as Timeline;

  try {
    pause();
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

    await (interaction as ButtonInteraction).update({
      components: [row],
    });
  } catch (e) {
    await interaction.reply(`Something went wrong: ${e}`);
  }
}
