const Discord = require("discord.js"); // eslint-disable-line no-unused-vars

module.exports = class {
  constructor (client) {
    this.client = client;
  }

  async run () {
    await this.client.wait(1000);

    await this.client.user.setStatus("online");
    await this.client.user.setActivity(`${this.client.guilds.cache.size} Servers | ${this.client.config.prefix}help`, { type: "WATCHING" });

    this.client.staffGuild = this.client.guilds.cache.get(this.client.config.staffGuild);
    this.client.mainGuild = this.client.guilds.cache.get(this.client.config.mainGuild);

    this.client.logger.ready(`Logged in as ${this.client.user.tag}. Serving ${this.client.guilds.cache.size} Servers and ${this.client.users.cache.size} Users.`);
  }
};
