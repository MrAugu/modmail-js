const Command = require("../base/Command");

class PingCmd extends Command {
  constructor (client) {
    super(client, {
      name: "ping",
      description: "Pong!",
      category: "General",
      usage: "",
      enabled: true,
      guildOnly: false,
      aliases: [],
      permLevel: "User",
      cooldown: 5,
      args: false
    });
  }

  async run (message, args, level, reply) { // eslint-disable-line no-unused-vars
    const m = await reply(":ping_pong: **Pong!**");
    const latency = m.createdTimestamp - message.createdTimestamp;

    m.edit(`*${latency}ms*`);
  }
}

module.exports = PingCmd;
