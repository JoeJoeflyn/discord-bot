import {
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { getFootballStats } from "../../api/football";
import { Game } from "../../shared/interface";

export const data = new SlashCommandBuilder()
  .setName("football")
  .setDescription("Reply with match stats!")
  .addStringOption((option) =>
    option.setName("input").setDescription("Your match").setRequired(true)
  );

export async function execute(interaction: CommandInteraction) {
  await interaction.deferReply();

  const word = interaction.options.get("input");

  const stat = await getFootballStats(word?.value as string);

  const { title, thumbnail, rankings, games } = stat?.sports_results;

  const embed = new EmbedBuilder()
    .setColor("DarkBlue")
    .setTitle(`${title} - ${rankings}`)
    .setAuthor({
      name: `${games[0]?.teams[0]?.name} - ${games[0]?.teams[1]?.name}`,
      url: games[0].video_highlights.link,
    })
    .setThumbnail(thumbnail)
    .addFields(
      {
        name: "Tournament",
        value: `${games[0].tournament}`,
        inline: true,
      },
      {
        name: "Status",
        value: `${games[0].status} ? ${games[0].status} : "Not yet started"`,
        inline: true,
      },
      {
        name: "Stadium",
        value: `${games[0].stadium}`,
        inline: true,
      },
      ...games?.flatMap((game: Game) => {
        return {
          name: `${game.teams[0].name} vs ${game.teams[1].name} - ${
            game.date
          } ${game.time ? `at ${game.time}` : ""}`,
          value: `${game.teams[0].score ?? "N/A"} - ${
            game.teams[1].score ?? "N/A"
          }`,
        };
      })
    )
    .setImage(games[0].video_highlights.thumbnail)
    .setFooter({
      text: `${games[0].date}`,
      iconURL:
        "https://i.pinimg.com/564x/b0/1a/2c/b01a2c6c066fb56f425030942a9f2c2b.jpg",
    });

  await interaction.reply({ embeds: [embed] });
}
