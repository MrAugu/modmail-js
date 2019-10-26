const Discord = require("discord.js"); // eslint-disable-line no-unused-vars
const cooldowns = new Discord.Collection();
const Threading = require("../modules/threading.js");

module.exports = class {
  constructor (client) {
    this.client = client;
  }

  async run (message) {
    if (!message.content.startsWith("-")) Threading.message(this.client, message);

    if (message.author.bot) return;

    const reply = (c) => message.channel.send(c);

    if (message.content.indexOf(this.client.config.prefix) !== 0) return;

    const args = message.content.slice(this.client.config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (message.guild && !message.member) await message.guild.fetchMember(message.author);

    const cmd = this.client.commands.get(command) || this.client.commands.get(this.client.aliases.get(command));
    if (!cmd) return;

    const level = await this.client.permlevel(message);

    if (cmd && !message.guild && cmd.conf.guildOnly) return reply(this.client.config.emojis.redTick + "This command is unavailable via private message, please run this command in a server.");

    if (cmd.conf.DMonly === true && message.guild) return reply(this.client.config.emojis.redTick + " This command can only be used in direct messages, please run this command in the private messages.");
    if (cmd.conf.enabled === false) return reply(this.client.config.emojis.redTick + " This command is disabled.");

    if (cmd.conf.args === true && !args.length) {
      return reply(`${this.client.config.emojis.redTick} You haven't provided any arguments. Correct Usage: \`${this.client.config.prefix}${cmd.help.name} ${cmd.help.usage}\``);
    }

    if (!cooldowns.has(cmd.help.name)) {
      cooldowns.set(cmd.help.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(cmd.help.name);
    const cooldownAmount = cmd.conf.cooldown * 1000;

    if (!timestamps.has(message.author.id)) {
      timestamps.set(message.author.id, now);
      setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    } else {
      const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;
        return reply(`${this.client.config.emojis.redTick} Slow it down dude.\n**You have to wait ${timeLeft.toFixed(1)} seconds before using **\`${cmd.help.name}\` **again.**`);
      }

      timestamps.set(message.author.id, now);
      setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    }


    if (level < this.client.levelCache[cmd.conf.permLevel]) return reply(`${this.client.config.emojis.redTick} You do not have the required permission to execute this command, the permission you need is \`${cmd.conf.permLevel}\`.`);

    // try {
      message.channel.startTyping(100);
      await cmd.run(message, args, level, reply);
      message.channel.stopTyping(true);
    // } catch (e) {
    //   reply(`${this.client.config.emojis.redTick} **Oops, seems like these was an error executing command. Please open an issue at https://github.com/MrAugu/modmail-js/issues.`);
    //   await message.channel.stopTyping(true);
    // }
  }
};
