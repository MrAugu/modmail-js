const Thread = require("../models/thread.js");
const Message = require("../models/message.js");
const Snippet = require("../models/snippet.js");
const Discord = require("discord.js");

class Threading {
  static async message (client, message) {
    if (message.author.bot) return;

    if (message.channel.type === "dm") {
      const recipientThread = await Thread.findOne({ recipient: message.author.id, closed: false });
      if (!recipientThread) return;

      this.dm(client, message, recipientThread);
    } else if (message.channel.type === "text") {
      const recipientThread = await Thread.findOne({ channel: message.channel.id, closed: false });
      if (!recipientThread) return;

      this.channel(client, message, recipientThread, message.content.startsWith("a:"));
    }
  }

  static async dm (client, message, thread) {
    const channel = client.channels.get(thread.channel);
    if (!channel) message.channel.send(`Channel for thread ${thread.id} can not be found.`);

    const contentEmbed = new Discord.MessageEmbed()
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setDescription(message.content)
      .setColor("ORANGE")
      .setTimestamp();
    channel.send(contentEmbed).catch(e => {});

    message.attachments.forEach(attachment => {
      const embed = new Discord.MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setColor("ORANGE")
        .setImage(attachment.proxyURL)
        .setTimestamp();
      channel.send(embed);
    });

    const messageID = (await Message.countDocuments({ thread: thread.id })) + 1;

    await (new Message({
      thread: thread.id,
      message: messageID,
      recipient: "Staff",
      channel: message.channel.id,
      content: message.content,
      author: message.author.id,
      attachments: message.attachments.map(a => a.proxyURL),
      timestamp: Date.now()
    }).save());

    await message.react(client.config.emojis.greenTick);
  }

  static async channel (client, message, thread, isAnonymous) {
    const user = client.users.get(thread.recipient);
    const channel = client.channels.get(thread.channel);
    if (!user) message.chamnel.send(`Recipient for thread ${thread.id} can not be found.`);

    let contentEmbed = new Discord.MessageEmbed()
      .setColor("YELLOW")
      .setTimestamp()
      .setFooter("Support Assistant");

    if (isAnonymous) {
      contentEmbed.setDescription(message.content.slice(2));
    } else {
      contentEmbed.setAuthor(message.author.tag, message.author.displayAvatarURL());
      contentEmbed.setDescription(message.content);
    }

    user.send(contentEmbed).catch(e => {});
    channel.send(contentEmbed).catch(e => {});
    message.attachments.forEach(attachment => {
      let embed = new Discord.MessageEmbed()
        .setColor("ORANGE")
        .setImage(attachment.proxyURL)
        .setFooter("Support Assistant");
      if (!isAnonymous) {
        embed.setAuthor(message.author.tag, message.author.displayAvatarURL());
      }
      user.send(embed).catch(e => {});
      channel.send(embed).catch(e => {});
    });

    const messageID = (await Message.countDocuments({ thread: thread.id })) + 1;

    await (new Message({
      thread: thread.id,
      message: messageID,
      recipient: thread.recipient,
      channel: message.channel.id,
      content: message.content,
      author: message.author.id,
      attachments: message.attachments.map(a => a.proxyURL),
      anonymous: isAnonymous,
      timestamp: Date.now()
    }).save());

    await message.delete().catch(e => {});
  }
}

module.exports = Threading;
