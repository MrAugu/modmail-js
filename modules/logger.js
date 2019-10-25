const moment = require("moment");
const colors = require("colors");

class Logger {
  static log (ctx) {
    const timestamp = `<${moment().format("YYYY-MM-DD HH:mm:ss")}>`;
    console.log(`${timestamp} ${colors.bgCyan("[LOG]")}: ${ctx}`);
  }

  static error (ctx) {
    const timestamp = `<${moment().format("YYYY-MM-DD HH:mm:ss")}>`;
    console.log(`${timestamp} ${colors.bgRed("[ERROR]")}: ${ctx}`);
  }

  static warn (ctx) {
    const timestamp = `<${moment().format("YYYY-MM-DD HH:mm:ss")}>`;
    console.log(`${timestamp} ${colors.bgYellow("[WARN]")}: ${ctx}`);
  }

  static debug (ctx) {
    const timestamp = `<${moment().format("YYYY-MM-DD HH:mm:ss")}>`;
    console.log(`${timestamp} ${colors.bgGreen("[DEBUG]")}: ${ctx}`);
  }

  static ready (ctx) {
    const timestamp = `<${moment().format("YYYY-MM-DD HH:mm:ss")}>`;
    console.log(`${timestamp} ${colors.green("[READY]")}: ${ctx}`);
  }

  static cmd (ctx) {
    const timestamp = `<${moment().format("YYYY-MM-DD HH:mm:ss")}>`;
    console.log(`${timestamp} ${colors.bgBlack("[CMD]")}: ${ctx}`);
  }
}

module.exports = Logger;