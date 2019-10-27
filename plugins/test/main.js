const Plugin = require("../../base/Plugin.js");
const path = require("path");

class Test extends Plugin {
  constructor (client) {
    super(client, {
      name: "test",
      description: "Tests."
    });
  }

  async load () {
    // Commands
    this.client.loadCommand(__dirname + `${path.sep}commands`, "plugin.js");

    // Event Files
    const messageEventFile = require("./events/message.js");
    const messageEvent = new messageEventFile(this.client);
    
    // Event Listeners
    this.client.on("message", (...args) => messageEvent.run(...args));
  }
}

module.exports = Test;
