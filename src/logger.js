const winston = require("winston");
const formatter = require("winston");
const LEVEL = Symbol.for("level");

// Define your severity levels.
// With them, You can create log files,
// see or hide levels based on the running ENV.
const levels = {
  info: 0,
  http: 1,
};

// This method set the current severity based on the current NODE_ENV:
// show all the log levels if the server was run in development mode;
// otherwise, if it was run in production, show only warn and error messages.
const level = () => {
  return "http";
};

// Define different colors for each level.
// Colors make the log message more visible,
// adding the ability to focus or ignore messages.
const colors = {
  info: "blue",
  http: "magenta",
};

// Tell winston that you want to link the colors defined above to the severity levels.
winston.addColors(colors);

// Choose the aspect of your log customizing the log format.
const format = winston.format.combine(
  // Add the message timestamp with the preferred format
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  // Tell Winston that the logs must be colored
  winston.format.colorize({ level: true }),
  // Define the format of the message showing the timestamp, the level and the message
  winston.format.printf(
    (info) => `[${info.timestamp}] ${info.level}: ${info.message}`
  )
);

// Define which transports the logger must use to print out messages.
const transports = [
  // Allow the use the console to print the messages
  new winston.transports.Console(),

  // Allow to print all the error level messages inside error.log file
  new winston.transports.File({
    filename: "logs/access.log",
    level: "http",
    maxsize: 5242880, //5MB
    maxFiles: 5,
  }),
];

// Create the logger instance that has to be exported and used to log messages.
const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
  exitOnError: false,
});

module.exports = logger;
