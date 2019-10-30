const Command = require("../base/Command");
const Messages = require("../models/message.js");
const Threads = require("../models/thread.js");

class Logs extends Command {
  constructor (client) {
    super(client, {
      name: "logs",
      description: "Shows thread logs of the threads.",
      category: "Modmail",
      usage: "<ticket id>",
      enabled: true,
      guildOnly: false,
      aliases: [],
      permLevel: "Support Operator",
      cooldown: 5,
      args: true,
      DMonly: false
    });
  }

  async run (message, args, level, reply) { // eslint-disable-line no-unused-vars
    var tID = parseInt(args[0]);
    if (isNaN(tID)) return reply(`${this.client.config.emojis.redTick} Invalid ticket id.`);

    const msgs = await Messages.find({ thread: tID });
    if (msgs.length < 1) return reply(`${this.client.config.emojis.redTick} No ticket was found with that id.`);
    const thread = await Threads.findOne({ id: tID });

    const threadRecipient = await this.client.users.fetch(thread.recipient);

    var out = `=== Thread Details ===
Thread ID: ${thread.id}
Recipient: ${threadRecipient.tag} (ID: ${thread.recipient})
Issue: ${thread.issue}
Thread Type: ${thread.nsfw ? "Not Safe For Work (NSFW)" : "Safe For Work (SFW)"}
Created At: ${new Date(thread.timestamp).toDateString()}

=== Messages ===

`;

  for (const m of msgs) {
    const ma = await this.client.users.fetch(m.author);
    const mr = m.recipient !== "Staff" ? await this.client.users.fetch(m.recipient) : "Staff";

    var fetchedContent = `@ ${ma.tag} (ID: ${m.author}) ${new Date(m.timestamp).toDateString()}
- Content: ${m.content}
- Recipient: ${mr === "Staff" ? "Staff" : `${mr.tag} (ID: ${mr.id})`}`;
    for (const at of m.attachments) {
      fetchedContent += `
> Attachment: ${at}`;
    }

    out += `${fetchedContent}

`;
  }

    message.channel.send(`${this.client.config.emojis.greenTick} Ticket **#${thread.id}** details:`, { files: [{ attachment: Buffer.from(out), name: `ticket_${thread.id}_details.txt` }] });
  }
}

module.exports = Logs;
