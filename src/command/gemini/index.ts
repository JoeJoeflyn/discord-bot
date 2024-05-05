import {
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { getGemini } from "../../api/gemini";
export const data = new SlashCommandBuilder()
  .setName("asks")
  .setDescription("Reply with gemini!")
  .addStringOption((option) =>
    option
      .setName("input")
      .setDescription("Type your word")
      .setRequired(true)
      .setAutocomplete(true)
  );
export async function execute(interaction: CommandInteraction) {
  const word = interaction.options.get("input");

  try {
    await interaction.deferReply();
    interaction.channel?.sendTyping();

    const initialReply = await interaction.fetchReply();
    await initialReply.react("🤔");

    const text = await getGemini(word?.value?.toString() as string);

    let currentMessage = "";
    const chunkSize = 20;
    const delay = 5;

    for (let i = 0; i < text.length; i += chunkSize) {
      currentMessage += text.substring(i, i + chunkSize);

      const embed = new EmbedBuilder()
        .setColor("#0099ff")
        .setTitle(`You asked for ${word?.value}`)
        .setDescription(currentMessage)
        .setTimestamp()
        .setFooter({
          text: "Gemini replied",
          iconURL:
            "https://i.pinimg.com/564x/b0/1a/2c/b01a2c6c066fb56f425030942a9f2c2b.jpg",
        });

      await interaction.editReply({ embeds: [embed] });

      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    if ("reactions" in initialReply) {
      await initialReply.reactions
        .resolve("🤔")
        ?.users.remove(interaction.client.user?.id);
    }
  } catch (error) {
    console.error("Error fetching definition:", error);
    await interaction.reply(
      "Failed to fetch the gemini. Please try again later."
    );
  }
}
