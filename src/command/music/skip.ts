import { useHistory, useMetadata, useQueue } from "discord-player";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  CommandInteraction,
  EmbedBuilder,
  InteractionUpdateOptions,
  SlashCommandBuilder,
  TextChannel,
  bold,
  hyperlink,
} from "discord.js";
import { client } from "../../config/player";

export const data = new SlashCommandBuilder()
  .setName("skip")
  .setDescription("Skip current song and start the next one.");

export async function execute(
  interaction: CommandInteraction | ButtonInteraction | InteractionUpdateOptions
) {
  if ("guild" in interaction) {
    try {
      const queue = useQueue(interaction?.guild?.id!);

      const channel = await client.channels.fetch(interaction.channelId!);

      const messages = await (channel as TextChannel)?.messages?.fetch({
        limit: 1,
      });

      const messageToEdit = messages.first();

      const nextTrack = useHistory(interaction?.guild?.id!);

      const track = nextTrack?.nextTrack!;

      if (!queue?.isPlaying()) {
        await interaction.deferReply();

        const embed = new EmbedBuilder()
          .setColor("#df4746")
          .setURL("https://github.com/JoeJoeflyn")
          .setDescription(
            "I'm not playing music ! Add song with </play:1236381760829391051>."
          );

        await interaction.editReply({ embeds: [embed] });
        return;
      }

      queue?.node.skip();

      if (nextTrack?.tracks.data.length !== 0) {
        const embed = new EmbedBuilder()
          .setColor("#6aba54")
          .setAuthor({
            name: "Now playing",
            url: "https://github.com/JoeJoeflyn",
          })
          .setThumbnail(track.thumbnail)
          .setDescription(
            `${bold(
              hyperlink(`${track.author} - ${track.title}`, track.url)
            )} - \`${track.duration.toString()}\``
          )
          .setTimestamp()
          .setFooter({
            text: "Music Bot",
            iconURL:
              "https://i.pinimg.com/564x/b0/1a/2c/b01a2c6c066fb56f425030942a9f2c2b.jpg",
          });
        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId("skip")
            .setEmoji("⏩")
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setCustomId("pause")
            .setEmoji("⏸️")
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setCustomId("stop")
            .setEmoji("⏹️")
            .setStyle(ButtonStyle.Secondary)
        );
        if (!messageToEdit?.embeds[0]?.footer) {
          await interaction.deferReply();
          await interaction.editReply({ embeds: [embed], components: [row] });
        } else {
          if (interaction instanceof ButtonInteraction) {
            interaction.update({ embeds: [embed], components: [row] });
          }
        }
      } else {
        if (interaction instanceof ButtonInteraction) {
          await interaction.update({});
        }
      }
    } catch (e) {
      await interaction.editReply(`Something went wrong: ${e}`);
    }
  }
}
