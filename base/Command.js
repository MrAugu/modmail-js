class Command {
  constructor (client, {
    name = null,
    description = "No description has been provided.",
    category = "No category has been provided.",
    usage = "No usage has been provided.",
    enabled = true,
    guildOnly = false,
    aliases = new Array(),
    permLevel = "User",
    cooldown = 3,
    args = false,
    DMonly = false
  }) {
    this.client = client;
    this.conf = { enabled, guildOnly, aliases, permLevel, cooldown, args, DMonly };
    this.help = { name, description, category, usage };
  }
}

module.exports = Command;
