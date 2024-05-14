import {
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
  hyperlink,
} from "discord.js";
import { getGithub } from "../../api/github";

export const data = new SlashCommandBuilder()
  .setName("github")
  .setDescription("Reply with github bio!")
  .addStringOption((option) =>
    option.setName("input").setDescription("Your github name").setRequired(true)
  );

export async function execute(interaction: CommandInteraction) {
  const word = interaction.options.get("input");

  const github = await getGithub(word?.value as string);

  if (!github) {
    await interaction.reply({ content: "GitHub account not found." });
  }

  const date = new Date(github?.created_at);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  };

  const formattedDate: string = date.toLocaleString("en-US", options);

  const embed = new EmbedBuilder()
    .setColor("DarkBlue")
    .setTitle(`${github?.login}`)
    .setAuthor({
      name: `${github?.name || github?.login} Github Profile`,
      url: github?.html_url,
    })
    .setThumbnail(github?.avatar_url)
    .addFields({
      name: "Portfolio",
      value: `${
        github?.blog ? hyperlink(github?.login, github?.blog) : github?.login
      }`,
    })
    .setFooter({
      text: `repo created at ${formattedDate}`,
      iconURL:
        "https://i.pinimg.com/564x/b0/1a/2c/b01a2c6c066fb56f425030942a9f2c2b.jpg",
    });

  if (github?.hireable) {
    embed.addFields({
      name: "Hireable",
      value: `${github?.hireable && "hireable"}`,
      inline: true,
    });
  }

  if (github?.location) {
    embed.addFields({
      name: "Location",
      value: `${github?.location}`,
      inline: true,
    });
  }

  await interaction.reply({ embeds: [embed] });
}
