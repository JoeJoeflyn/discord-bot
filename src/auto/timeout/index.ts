import { EmbedBuilder, Message, NewsChannel, TextChannel } from "discord.js";

const usersMap = new Map();
const LIMIT = 7;
const DIFF = 5000;
const TIME = 5 * 60 * 1000;
export async function handleTimeout(message: Message) {
  if (message.author.bot) return;

  if (usersMap.has(message.author.id)) {
    const userData = usersMap.get(message.author.id);
    const { lastMessage, timer } = userData;
    const difference = message.createdTimestamp - lastMessage.createdTimestamp;
    let msgCount = userData.msgCount;

    if (difference > DIFF) {
      clearTimeout(timer);

      userData.msgCount = 1;
      userData.lastMessage = message;
      userData.timer = setTimeout(() => {
        usersMap.delete(message.author.id);
      }, TIME);
      usersMap.set(message.author.id, userData);
    } else {
      ++msgCount;
      if (parseInt(msgCount) === LIMIT) {
        const embed = new EmbedBuilder()
          .setColor("#df4746")
          .setDescription("Warning: Spamming in this channel is forbidden.");

        await message.reply({ embeds: [embed] });
        await (message.channel as TextChannel | NewsChannel).bulkDelete(LIMIT);

        const timeoutDuration = 10 * 60 * 1000; // 10 minutes in milliseconds
        if (message.member) {
          await message.member.timeout(timeoutDuration, "Spamming messages");
        }
      } else {
        userData.msgCount = msgCount;
        usersMap.set(message.author.id, userData);
      }
    }
  } else {
    let fn = setTimeout(() => {
      usersMap.delete(message.author.id);
    }, TIME);
    usersMap.set(message.author.id, {
      msgCount: 1,
      lastMessage: message,
      timer: fn,
    });
  }
}
