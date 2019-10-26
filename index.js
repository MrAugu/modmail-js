if (Number(process.version.slice(1).split(".")[0]) < 8) throw new Error("Node 8.0.0 or higher is required. Update Node on your system.");

const { Client, Collection } = require("discord.js");
const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);
const klaw = require("klaw");
const path = require("path");
const mongoose = require("mongoose");
const fs = require("fs");

try {
  require("./configuration.json");
} catch (e) {
  console.log("[Startup Log]: Configuration file not found.");
  console.log("[Startup Log]: Creating a configuration file...");
  const defaults = {
    "_token": "TOKEN",
    "_prefix": "-",
    "_owner": "ID",
    "_admins": [],
    "_mongoUri": "MONGODB_URL",
    "_mainGuild": "ID",
    "_staffGuild": "ID",
    "_parent": "ID",
    "_supportRole": "ID",
    "_redTickEmoji": "❌",
    "_greenTickEmoji": "✅"
  };

  fs.writeFileSync("configuration.json", JSON.stringify(defaults, null, 4));

  console.log("[Startup Log]: Created a new configuration file.");
  console.log("[Startup Log]: Use 'node configurer.js' to edit your configuration via interactive command line interface.");
  process.exit(1);
}

const dbUrl = require("./config.js").mongo;

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

class Bot extends Client {
  constructor (options) {
    super(options);
    this.config = require("./config.js");
    this.commands = new Collection();
    this.aliases = new Collection();
    this.plugins = new Collection();

    this.logger = require("./modules/logger.js");

    this.wait = require("util").promisify(setTimeout);

    this.awaitReply = async (msg, question, limit = 60000) => {
      const filter = m => m.author.id === msg.author.id;
      const ms = await msg.channel.send(question);
      try {
        const collected = await msg.channel.awaitMessages(filter, { max: 1, time: limit, errors: ["time"] });
        return collected.first().content;
      } catch (e) {
        return false;
      }
    };

    this.clean = async (client, text) => {
      if (text && text.constructor.name == "Promise") text = await text;
      if (typeof evaled !== "string") text = require("util").inspect(text, {depth: 0});

      text = text.replace(/`/g, "`" + String.fromCharCode(8203))
        .replace(/@/g, "@" + String.fromCharCode(8203))
        .replace(client.token, "nani");

      return text;
    };
  }

  permlevel (message) {
    let permlvl = 0;

    const permOrder = this.config.permLevels.slice(0).sort((p, c) => p.level < c.level ? 1 : -1);

    while (permOrder.length) {
      const currentLevel = permOrder.shift();
      if (message.guild && currentLevel.guildOnly) continue;
      if (currentLevel.check(message)) {
        permlvl = currentLevel.level;
        break;
      }
    }
    return permlvl;
  }

  loadCommand (commandPath, commandName) {
    try {
      const props = new (require(`${commandPath}${path.sep}${commandName}`))(this);
      this.logger.log(`Loading Command: ${props.help.name}`, "log");
      props.conf.location = commandPath;
      if (props.init) {
        props.init(this);
      }
      this.commands.set(props.help.name, props);
      props.conf.aliases.forEach(alias => {
        this.aliases.set(alias, props.help.name);
      });
      return false;
    } catch (e) {
      throw e;
      return `Unable to load command ${commandName}: ${e}`;
    }
  }

  async unloadCommand (commandPath, commandName) {
    let command;
    if (this.commands.has(commandName)) {
      command = this.commands.get(commandName);
    } else if (this.aliases.has(commandName)) {
      command = this.commands.get(this.aliases.get(commandName));
    }
    if (!command) return `The command \`${commandName}\` doesn"t seem to exist, nor is it an alias. Try again!`;

    if (command.shutdown) {
      await command.shutdown(this);
    }
    delete require.cache[require.resolve(`${commandPath}${path.sep}${commandName}.js`)];
    return false;
  }

  loadPlugin (pluginPath, pluginName) {
    try {
      const props = new (require(`${pluginPath}${path.sep}main`))(this);
      this.logger.log(`Loading Plugin: ${props.info.name}`, "log");
      props.info.location = pluginPath;
      if (props.init) {
        props.init(this);
      }
      this.plugins.set(props.info.name, props);
      if (props.load) props.load();
      return false;
    } catch (e) {
      return `Unable to load plugin ${pluginName}: ${e}`;
    }
  }
}

const client = new Bot();

const init = async () => {
  klaw("./commands").on("data", (item) => {
    const cmdFile = path.parse(item.path);
    if (!cmdFile.ext || cmdFile.ext !== ".js") return;
    const response = client.loadCommand(cmdFile.dir, `${cmdFile.name}${cmdFile.ext}`);
    if (response) client.logger.error(response);
  });

  const evtFiles = await readdir("./events/");
  client.logger.log(`Loading a total of ${evtFiles.length} events.`, "log");
  evtFiles.forEach(file => {
    const eventName = file.split(".")[0];
    client.logger.log(`Loading Event: ${eventName}`);
    const event = new (require(`./events/${file}`))(client);

    client.on(eventName, (...args) => event.run(...args));
    delete require.cache[require.resolve(`./events/${file}`)];
  });

  client.levelCache = {};
  for (let i = 0; i < client.config.permLevels.length; i++) {
    const thisLevel = client.config.permLevels[i];
    client.levelCache[thisLevel.name] = thisLevel.level;
  }

  await client.wait(500);

  klaw("./plugins").on("data", (item) => {
    const pluginFile = path.parse(item.path);
    if (pluginFile.ext !== ".js") return;
    if (pluginFile.name !== "main") return;
    const response = client.loadPlugin(pluginFile.dir, `${pluginFile.name}${pluginFile.ext}`);
    if (response) client.logger.error(response);
  });

  client.login(client.config.token);
};

init();

client.on("disconnect", () => client.logger.warn("Bot is disconnecting..."));
client.on("reconnecting", () => client.logger.log("Bot reconnecting...", "log"));
client.on("error", e => client.logger.error(e));
client.on("warn", info => client.logger.warn(info));

process.on("uncaughtException", (err) => {
  const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
  console.error("Uncaught Exception: ", errorMsg);
  process.exit(1);
});
