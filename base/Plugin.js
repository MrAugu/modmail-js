class Plugin {
  constructor (client, {
    name = null,
    description = "No description has been provided."
  }) {
    this.client = client;
    this.info = { name, description };
  }
}

module.exports = Plugin;
