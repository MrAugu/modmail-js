const Command = require("../base/Command");

class Commands extends Command {
  constructor (client) {
    super(client, {
      name: "commands",
      description: "/shrug",
      category: "General",
      usage: "",
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
    reply(`${this.client.commands.map(c => `\`\`\`${c.help.name}\`\`\``).join(" ")}`);
  }
}

module.exports = Commands;
