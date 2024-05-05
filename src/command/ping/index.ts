import {
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
export const data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Reply with Latency!");

export async function execute(interaction: CommandInteraction) {
  if (!interaction.client) {
    console.error("Client is not accessible");
    return;
  }

  const latency = Date.now() - interaction.createdTimestamp;
  const apiLatency = Math.round(interaction.client.ws.ping);

  const latencyEmbed = new EmbedBuilder()
    .setColor("#0099ff")
    .setTitle("🏓 Pong!")
    .addFields(
      { name: "Latency", value: `${latency}ms`, inline: true },
      { name: "API Latency", value: `${apiLatency}ms`, inline: true }
    )
    .setTimestamp()
    .setFooter({
      text: "Latency information",
      iconURL:
        "https://i.pinimg.com/564x/b0/1a/2c/b01a2c6c066fb56f425030942a9f2c2b.jpg",
    });

  // Reply to the interaction with the embed
  await interaction.reply({ embeds: [latencyEmbed] });
}
