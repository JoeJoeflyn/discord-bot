import { Client, EmbedBuilder, bold, hyperlink } from "discord.js";
import { getTwitch, getTwitchUser } from "../../api/twitch";

export async function handleTwitchNotification(client: Client) {
  const twitch = await getTwitch();

  const streamer = await getTwitchUser();

  const stream = twitch.data[0];

  const channelIds = ["1235170642295263325", "909116735003693151"];

  let isLive = false;

  setInterval(() => {
    if (twitch.data.length > 0) {
      if (stream.type === "live" && !isLive) {
        isLive = true;

        const embed = new EmbedBuilder()
          .setColor("#0099ff")
          .setThumbnail(streamer.profile_image_url)
          .setAuthor({
            name: `${stream.user_name} is live!`,
            url: "https://www.twitch.tv/caseoh_",
          })
          .setImage(
            stream.thumbnail_url
              .replace("{width}", "1280")
              .replace("{height}", "720")
          )
          .setDescription(
            `${bold(
              hyperlink(`${stream.title}`, "https://www.twitch.tv/caseoh_")
            )}`
          )
          .addFields(
            {
              name: "Game",
              value: stream.game_name,
            },
            {
              name: "Viewers",
              value: stream.viewer_count.toString(),
            },
            {
              name: "Tags",
              value: Array.isArray(stream.tags)
                ? stream.tags.join(", ")
                : "No tags",
            }
          )
          .setTimestamp()
          .setFooter({
            text: "Twitch stream information",
            iconURL:
              "https://i.pinimg.com/564x/b0/1a/2c/b01a2c6c066fb56f425030942a9f2c2b.jpg",
          });

        channelIds.forEach((channelId) => {
          const channel = client.channels.cache.get(channelId);
          if (channel?.isTextBased()) {
            channel?.send({ embeds: [embed] });
          }
        });
      } else if (stream.type !== "live") {
        isLive = false;
      }
    }
  }, 60000);
}
