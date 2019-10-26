const Plugin = require("../../base/Plugin.js");

class Test extends Plugin {
  constructor (client) {
    super(client, {
      name: "test",
      description: "Tests."
    });
  }

  async load () {
    console.log("Loading!");
  }
}

module.exports = Test;
