const Discord = require ("discord.js"); // eslint-disable-line no-unused-vars
const Command = require("../base/Command.js");


class Status extends Command {
    constructor(client) {
      super(client, {
        name: "status",
        description: "Set The DND/Idle/Invisible/Online Presence/Status.",
        category: "",
        usage: "status <online|idle|dnd|invisible>",
        permLevel: "Support Operator"
      });
    }

    async run(message, args, level) { // eslint-disable-line no-unused-vars
        const status = args[0];
        if (!status) return message.channel.send("A status type must be provided.");

        const statusType = args[0].toLowerCase();

        if (statusType === "online" || statusType === "idle" || statusType === "dnd" || statusType === "invisible") {
            this.client.user.setStatus(status);
            message.channel.send(`Status successfully changed to **${statusType}**.\nPlease note that initially changing status may take up to a minute`);
        } else {
            return message.channel.send(`"${statusType}" is not a valid status type.`);
        }
    }
}

module.exports = Status;