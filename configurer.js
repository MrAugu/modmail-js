const rls = require("readline-sync");
const fs = require("fs");

var defs = fs.readFileSync("configuration.json", "utf8");
defs = JSON.parse(defs);

var token = rls.question(`Enter your bot's token: (${defs._token}) `);
var prefix = rls.question(`Enter your default prefix: (${defs._prefix}) `);
var owner = rls.question(`Enter your discord id: (${defs._owner}) `);
var mongoURL = rls.question(`Enter your mongo url: (${defs._mongoUri}) `);
var mainGuild = rls.question(`Enter your main guild id: (${defs._mainGuild}) `);
var staffGuild = rls.question(`Enter your staff guild id [Can be same as main guild.]: (${defs._staffGuild}) `);
var parent = rls.question(`Enter category id you want ticket channels to be created in [Must be inside \`staffGuild\`]: (${defs._parent}) `);
var supportRole = rls.question(`Enter role id of the 'Support Team' role [Must be inside \`staffGuild\`]: (${defs._supportRole}) `);

if (token.length < 1) token = defs._token;
if (prefix.length < 1) prefix = defs._prefix;
if (owner.length < 1) owner = defs._owner;
if (mongoURL.length < 1) mongoURL = defs._mongoUri;
if (mainGuild.length < 1) mainGuild = defs._mainGuild;
if (staffGuild.length < 1) staffGuild = defs._staffGuild;
if (parent.length < 1) parent = defs._parent;
if (supportRole.length < 1) supportRole = defs.supportRole;

console.log("");
console.log("Writing the settings...");

defs._token = token;
defs._prefix = prefix;
defs._owner = owner;
defs._mongoUri = mongoURL;
defs._mainGuild = mainGuild;
defs._staffGuild = staffGuild;
defs._parent = parent;
defs._supportRole = supportRole;

fs.writeFileSync("configuration.json", JSON.stringify(defs, null, 2));
console.log("Wrote the settings. You can now use 'node index.js' to launch the modmail bot.");
