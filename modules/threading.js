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
    } else if (message.chanenl.type === "text") {
      const recipientThread = await Thread.findOne({ channel: message.channel.id, closed: false });
      if (!recipientThread) return;

      this.channel(client, message, recipientThread, message.content.startsWith("a:"));
    }
  }

  static async dm (client, message, thread) {
    const channel = client.channels.get(thread.channel);
    if (!channel) console.log(`Channel for thread ${thread.id} can not be found.`);

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
  }

  static async channel (client, message, thread, isAnonymous) {
    // In case dm appears to come from a channel thread. (Support)
  }
}

module.exports = Threading;
