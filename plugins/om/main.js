const Plugin = require("../../base/Plugin.js");

class Om extends Plugin {
  constructor (client) {
    super(client, {
      name: "OM",
      description: "Does something."
    });
  }

  async load () {
    console.log("Loading omgggg!");
  }
}

module.exports = Om;
