const Command = require("../base/Command");
const Discord = require("discord.js");
const Thread = require("../models/thread.js");

class Start extends Command {
  constructor (client) {
    super(client, {
      name: "start",
      description: "Starts a new ticket via private messages.",
      category: "",
      usage: "Modmail",
      enabled: true,
      guildOnly: false,
      aliases: [],
      permLevel: "User",
      cooldown: 5,
      args: false,
      DMonly: true
    });
  }

  async run (message, args, level, reply) { // eslint-disable-line no-unused-vars
    const haveThread = await Thread.findOne({ recipient: message.author.id, closed: false });
    if (haveThread) return reply("You already have an ongoing thread.");

    const issueEmbed = new Discord.MessageEmbed()
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setDescription("Hello, please describe your issue briefly, the more details, the faster it will be for the staff team to help you. Type `cancel` to cancel.")
      .setColor("ORANGE");
    const issue = await this.client.awaitReply(message, issueEmbed, 900000);
    if (issue === false) return reply(`${this.client.config.emojis.redTick} Your request has timed out. If you wish to submit a request please use \`${this.client.config.prefix}start\`.`);
    if (issue.toLowerCase() === "cancel") return reply(this.client.config.emojis.greenTick + " Aborted.");

    const channel = await this.client.staffGuild.channels.create(message.author.tag.replace("#", "-"), {
      type: "text",
      topic: `User: ${message.author.tag} (ID: ${message.author.id})\n\nIssue: ${issue}`,
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
      .setDescription(`**${message.author.tag}** (ID: ${message.author.id}) has opened a ticket.\nAccount was created ${fetchTime(Date.now() - message.author.createdTimestamp)} ago.`)
      .addField("Issue:", issue)
      .setColor("ORANGE")
      .setTimestamp();
    await channel.send(infoEmbed);

    var threadID = await Thread.countDocuments();
    threadID += 1;
    
    await (new Thread({
      id: threadID,
      recipient: message.author.id,
      channel: channel.id,
      guild: channel.guild.id,
      issue: issue,
      timestamp: Date.now()
    }).save());
  }
}

module.exports = Start;

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
