import winston from 'winston';
import config from './environment';

const { combine, timestamp, errors, json, colorize, simple, printf } = winston.format;

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define colors for each level
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

// Tell winston that you want to link the colors
winston.addColors(colors);

// Custom format for console output
const consoleFormat = printf(({ level, message, timestamp, ...meta }) => {
  let log = `${timestamp} [${level.toUpperCase()}]: ${message}`;
  
  // Add metadata if present
  if (Object.keys(meta).length > 0) {
    log += ` ${JSON.stringify(meta)}`;
  }
  
  return log;
});

// Define which transports the logger must use
const transports: winston.transport[] = [
  // Console transport
  new winston.transports.Console({
    format: combine(
      colorize({ all: true }),
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      consoleFormat
    ),
  }),
];

// Add file transports in production
if (config.nodeEnv === 'production') {
  transports.push(
    // Error log file
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: combine(
        timestamp(),
        errors({ stack: true }),
        json()
      ),
    }),
    // Combined log file
    new winston.transports.File({
      filename: 'logs/combined.log',
      format: combine(
        timestamp(),
        errors({ stack: true }),
        json()
      ),
    }),
    // Job-specific log file
    new winston.transports.File({
      filename: 'logs/jobs.log',
      level: 'info',
      format: combine(
        timestamp(),
        errors({ stack: true }),
        json()
      ),
    })
  );
}

// Create the logger
const logger = winston.createLogger({
  level: config.logLevel,
  levels,
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    json()
  ),
  transports,
  // Handle exceptions and rejections
  exceptionHandlers: [
    new winston.transports.Console({
      format: combine(
        colorize({ all: true }),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        consoleFormat
      ),
    }),
  ],
  rejectionHandlers: [
    new winston.transports.Console({
      format: combine(
        colorize({ all: true }),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        consoleFormat
      ),
    }),
  ],
});

// Add file exception handlers in production
if (config.nodeEnv === 'production') {
  logger.exceptions.handle(
    new winston.transports.File({ filename: 'logs/exceptions.log' })
  );
  logger.rejections.handle(
    new winston.transports.File({ filename: 'logs/rejections.log' })
  );
}

// Create a stream object with a 'write' function that will be used by morgan
export const stream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};

export default logger;
