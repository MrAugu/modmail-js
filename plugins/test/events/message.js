module.exports = class {
  constructor (client) {
    this.client = client;
  }

  async run (message) {
    await message.react("637743397846646797");
  }
}
