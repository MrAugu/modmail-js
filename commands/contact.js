const Command = require("../base/Command");
const Discord = require("discord.js");
const Thread = require("../models/thread.js");

class Contact extends Command {
  constructor (client) {
    super(client, {
      name: "contact",
      description: "Starts a new ticket with an user.",
      category: "",
      usage: "Modmail",
      enabled: true,
      guildOnly: true,
      aliases: [],
      permLevel: "Support Operator",
      cooldown: 5,
      args: false,
      DMonly: false
    });
  }

  async run (message, args, level, reply) { // eslint-disable-line no-unused-vars
    const target = message.mentions.users.first();
    if (!target) return reply(this.client.config.emojis.redTick + " You have to specify a target.");

    const haveThread = await Thread.findOne({ recipient: target.id, closed: false });
    if (haveThread) return reply(this.client.config.emojis.redTick + ` A thread is already ongoing in <#${haveThread.channel}>.`);

    const issueEmbed = new Discord.MessageEmbed()
      .setAuthor(target.tag, message.author.displayAvatarURL())
      .setDescription("Hello, the support team has reached to you. Any message you send in this DM will be forwarded to them.")
      .setColor("ORANGE");

    try {
      await target.send(issueEmbed);
    } catch (e) {
      return reply(this.client.config.emojis.redTick + " Could not establish a DM, their DM is closed.");
    }

    const channel = await this.client.staffGuild.channels.create(target.tag.replace("#", "-"), {
      type: "text",
      topic: `User: ${target.tag} (ID: ${target.id})\n\nThread started by the support team.`,
      nsfw: false,
      parent: this.client.config.parent,
      permissionOverwrites: [{
        id: this.client.staffGuild.id,
        deny: ["VIEW_CHANNEL"],
        type: "role"
      },
      {
        id: this.client.config.supportRole,
        allow: ["VIEW_CHANNEL"],
        type: "role"
      }]
    });

    const infoEmbed = new Discord.MessageEmbed()
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setDescription(`Support team has opened a ticket with **${target.tag}** (ID: ${target.id}).\nAccount was created ${fetchTime(Date.now() - target.createdTimestamp)} ago.`)
      .setColor("ORANGE")
      .setTimestamp();
    await channel.send(infoEmbed);

    var threadID = await Thread.countDocuments();
    threadID += 1;

    await (new Thread({
      id: threadID,
      recipient: target.id,
      channel: channel.id,
      guild: channel.guild.id,
      issue: "?",
      timestamp: Date.now()
    }).save());

    reply(this.client.config.emojis.greenTick + " The ticket has been created in <#" + channel + ">.");
  }
}

module.exports = Contact;

function fetchTime (ms, object = false) {
  var totalSeconds = (ms / 1000);
  var days = Math.floor(totalSeconds / 86400);
  totalSeconds %= 86400;
  var hours = Math.floor(totalSeconds / 3600);
  totalSeconds %= 3600;
  var minutes = Math.floor(totalSeconds / 60);
  var seconds = totalSeconds % 60;
  seconds = Math.floor(seconds);
  if (object === true) return { days, hours, minutes, seconds };

  return `${days} Days, ${hours} Hours, ${minutes} Minutes and ${seconds} Seconds`;
}
