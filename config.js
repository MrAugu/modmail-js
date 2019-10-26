const Configuration = require("./configuration.json");

const config = {
  "token": Configuration._token,
  "prefix": Configuration._prefix,
  "owner": Configuration._owner,
  "admins": Configuration._admins,
  "mongo": Configuration._mongoUri,
  "mainGuild": Configuration._mainGuild,
  "staffGuild": Configuration._staffGuild,
  "parent": Configuration._parent,
  "supportRole": Configuration._supportRole,

  "emojis": {
    "redTick": Configuration._redTickEmoji,
    "greenTick": Configuration._greenTickEmoji
  },

  permLevels: [
    { level: 0,
      name: "User",
      check: () => true
    },

    { level: 2,
      name: "Support Operator",
      check: (message) => {
        try {
          if (message.member.hasPermission("MANAGE_MESSAGES") || message.member.hasPermission("MANAGE_GUILD") || message.member.hasPermission("BAN_MEMBERS") || message.member.roles.has(message.client.config.supportRole)) {
            return true;
          } else {
            return false;
          }
        } catch (e) {
          return false;
        }
      }
    },

    { level: 9,
      name: "Bot Admin",
      check: (message) => config.admins.includes(message.author.id)
    },

    { level: 10,
      name: "Bot Owner",
      check: (message) => config.owner === message.author.id
    }
  ]
};

module.exports = config;
