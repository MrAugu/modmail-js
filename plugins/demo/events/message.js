module.exports = class {
  constructor (client) {
    this.client = client;
  }

  async run (message) {
    if (message.content.startsWith("hello")) return message.channel.send("Hello!");
  }
}
