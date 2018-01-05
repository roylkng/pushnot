var log4js = require('log4js');
var E = require('../lib/constants');

var logAppenders = [
  {
    type: "file",
    filename: "logs/connecto.log",
    "maxLogSize": 20480000, // Not sure what unit is. My guess is its in Bytes. So it should roll when file size gets to 20MB
    "backups" : 60, // Maximum 60 backup files
    // This appender is used when logger is connecto_logger(default), console or express_logger
    category : ["connecto_logger", "console", "express_logger"],
  },
  {
    type: "console",
    // express and console messages are both appended to console. This is to mimic the current behavior.
    category : ["express_logger", "console", "connecto_logger"],
  },
];

// If we are not in development mode, add mailer appender
if (E.config.environment !== E.ENVIRONMENTS.DEVELOPMENT) {
  logAppenders.push({
      "type": "file",
      "level": "ERROR",         // Include only error logs.
      filename: "logs/forever.err",
      category : ["connecto_logger", "console"],

    });
}
if (false) {
  logAppenders.push({
      "type": "logLevelFilter", // This is a recursive appender,
                                // filters log messages and
                                // sends them to its own appender.

      "level": "ERROR",         // Include only error logs.
      // Email is sent only when ERROR level logging happens in console or connecto_logger (so, this avoids ERRORs thrown when 5xx is returned by express)
      category : ["connecto_logger", "console"],

      "appender": {             // the filter's appender, smtp
        "type": "smtp",
        "recipients": "notify@connecto.io",
        "sendInterval": 60,     // Batch log messages, and send via 
                                // this interval in seconds (0 sends 
                                // immediately, unbatched).
        "transport": "SMTP",
        "SMTP": {
          "host": "smtp.gmail.com",
          "secureConnection": true,
          "port": 465,
          "auth": {
           "user": "contact@thoughtfabrics.com",
           "pass": "rang!ru123"
          }
        }
      }
    });
}

log4js.configure({
  replaceConsole: true,
  appenders: logAppenders
});

module.exports.logger = log4js.getLogger("connecto_logger");;
module.exports.express_logger = log4js.getLogger("express_logger");;
