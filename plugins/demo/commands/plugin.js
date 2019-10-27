const Command = require("../../../base/Command.js");

class Plugin extends Command {
  constructor (client) {
    super(client, {
      name: "plugin",
      description: "/shrug",
      category: "Plugin",
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
    reply("Hello, im comming from a plugin.");
  }
}

module.exports = Plugin;
