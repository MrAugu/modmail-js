const Command = require("../base/Command");
const Discord = require("discord.js");
const Thread = require("../models/thread.js");

class Delete extends Command {
  constructor (client) {
    super(client, {
      name: "delete",
      description: "Deletes old ticket channel.",
      category: "",
      usage: "Modmail",
      enabled: true,
      guildOnly: true,
      aliases: [],
      permLevel: "Support Operators",
      cooldown: 5,
      args: false,
      DMonly: false
    });
  }

  async run (message, args, level, reply) { // eslint-disable-line no-unused-vars
    var thread = await Thread.findOne({ channel: message.channel.id });

    if (!thread) return reply(this.client.config.emojis.redTick + " No this channel is not a ticket channel.");
    if (thread.closed !== true) return reply(this.client.config.emojis.redTick + "A ticket is still ongoing in this channel, close it first using `" + this.client.prefix + "close`.");

    const makeAnonymous = await this.client.awaitReply(message, "Are you sure you want to delete this ticket channel? (`yes` or `no`)");
    if (makeAnonymous === false || !makeAnonymous.startsWith("y")) return reply (this.client.config.emojis.greenTick + " Aborted.");

    if (!message.channel.deletable) return reply(this.client.config.emojis.redTick + "  I can not delete this channel due to inpropper permissios.");

    await message.channel.delete({ reason: `${message.author.tag}: Deleting ticket chnanel.` });
  }
}

module.exports = Delete;
