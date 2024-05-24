import {
  ButtonStyles,
  ButtonTypes,
  pagination,
} from "@devraelfreeze/discordjs-pagination";
import {
  CommandInteraction,
  Embed,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { getDictionary } from "../../api/dictionary";
import { UrbanDictionaryDefinition } from "../../shared/interface/dictionary";
import { truncateString } from "../../shared/utils";

export const data = new SlashCommandBuilder()
  .setName("urban_dictionary")
  .setDescription("Reply with definition of the word")
  .addStringOption((option) =>
    option
      .setName("input")
      .setDescription("Type your word")
      .setRequired(true)
      .setAutocomplete(true)
  );

export async function execute(interaction: CommandInteraction) {
  const word = interaction.options.get("input");

  if (!word || word?.value?.toString().trim().length === 0) {
    await interaction.reply("Please provide a word to define.");
    return;
  }

  try {
    const { list } = await getDictionary(word.value?.toString() as string);

    if (list.length === 0) {
      await interaction.reply("No definition found.");
      return;
    }

    const embeds = list.map((item: UrbanDictionaryDefinition, index: number) =>
      createDefinitionEmbed(item, word.value as string)
    );
    await sendPaginatedEmbeds(interaction, embeds);
  } catch (error) {
    console.error("Error fetching definition:", error);
    await replyOrFollowUp(
      interaction,
      "Failed to fetch the definition. Please try again later."
    );
  }
}

function createDefinitionEmbed(
  definition: UrbanDictionaryDefinition,
  word: string
): EmbedBuilder {
  const embed = new EmbedBuilder()
    .setColor("#0099ff")
    .setTitle(`Definition for "${word}"`)
    .setDescription(truncateString(definition.definition, 4096));

  if (definition.example && definition.example.trim().length > 0) {
    embed.addFields({
      name: "Example",
      value: truncateString(definition.example, 1024),
    });
  }

  if (definition.author && definition.author.trim().length > 0) {
    embed.addFields({
      name: "Author",
      value: definition.author,
    });
  }

  embed.setFooter({
    text: `👍 ${definition.thumbs_up} 👎 ${definition.thumbs_down}`,
  });

  return embed;
}

async function sendPaginatedEmbeds(
  interaction: CommandInteraction,
  embedBuilders: Embed[]
) {
  const embeds = embedBuilders.map((embedBuilder) => embedBuilder);
  const user = interaction.user;
  await pagination({
    embeds: embedBuilders,
    author: user,
    interaction,
    ephemeral: false,
    disableButtons: embeds.length === 1,
    buttons: [
      {
        type: ButtonTypes.previous,
        label: "Previous Page",
        style: ButtonStyles.Primary,
      },
      {
        type: ButtonTypes.next,
        label: "Next Page",
        style: ButtonStyles.Primary,
      },
    ],
  });
}

async function replyOrFollowUp(
  interaction: CommandInteraction,
  message: string
) {
  if (!interaction.replied && !interaction.deferred) {
    await interaction.reply(message);
  } else {
    await interaction.followUp(message);
  }
}
