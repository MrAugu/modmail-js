const Command = require("../base/Command");
const Discord = require("discord.js");
const Thread = require("../models/thread.js");

class Close extends Command {
  constructor (client) {
    super(client, {
      name: "close",
      description: "Closes the ticket.",
      category: "",
      usage: "Modmail",
      enabled: true,
      guildOnly: false,
      aliases: [],
      permLevel: "User",
      cooldown: 5,
      args: false,
      DMonly: false
    });
  }

  async run (message, args, level, reply) { // eslint-disable-line no-unused-vars
    var thread;
    if (message.channel.type === "dm"){
      thread = await Thread.findOne({ recipient: message.author.id, closed: false });
    } else {
      thread = await Thread.findOne({ channel: message.channel.id, closed: false });
    }

    if (!thread) return reply(this.client.config.emojis.redTick + " No ticket ongoing in this channel.");

    var anonymous = false;

    if (message.channel.type !== "dm") {
      const makeAnonymous = await this.client.awaitReply(message, "Do you want to delete the ticket anonymously? if so, closing log that is being shown will not include your username. (`-yes` or `-no`)");
      if (makeAnonymous !== false && makeAnonymous.startsWith("-y")) anonymous = true;
    }

    thread.closed = true;

    await thread.save().catch(e => console.error(e));

    var embed;

    if (anonymous === true) {
      embed = new Discord.MessageEmbed()
        .setAuthor("Ticket Closed")
        .setDescription("Ticket has been closed by the support team.")
        .setColor("RED")
        .setTimestamp();
    } else {
      embed = new Discord.MessageEmbed()
        .setAuthor(`${message.author.tag} | Ticket Closed`, message.author.displayAvatarURL())
        .setDescription(`Ticket has been closed by **${message.author.tag}**.`)
        .setColor("RED")
        .setTimestamp();
    }

    this.client.users.get(thread.recipient).send(embed).catch(e => {});
    this.client.channels.get(thread.channel).send(embed).catch(e => {});

    reply(`Ticket **#${thread.id}** has been closed.`);
  }
}

module.exports = Close;
