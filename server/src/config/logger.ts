import winston from "winston"
import path from "path"
import fs from "fs"
import config from "./environment"

const { combine, timestamp, errors, json, colorize, printf } = winston.format

// Create logs directory if it doesn't exist
const logDir = config.logDir || "logs"
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true })
}

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
}

// Define colors for each level
const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "white",
}

// Tell winston that you want to link the colors
winston.addColors(colors)

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json(),
)

// Define console format (more readable for development)
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(({ level, message, timestamp, ...meta }) => {
    const metaString = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ""
    return `${timestamp} ${level}: ${message} ${metaString}`
  }),
)

// Create logger instance
const logger = winston.createLogger({
  level: config.logLevel || "info",
  levels,
  format: logFormat,
  defaultMeta: { service: "task-management-api" },
  transports: [
    // Write logs to files
    new winston.transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error",
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: path.join(logDir, "combined.log"),
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5,
    }),
  ],
})

// Add console transport in development
if (config.nodeEnv !== "production") {
  logger.add(
    new winston.transports.Console({
      format: consoleFormat,
    }),
  )
}

// Create a stream object for Morgan
export const stream = {
  write: (message: string) => {
    logger.http(message.trim())
  },
}

// Add request context middleware
export const requestLogger = (req: any, res: any, next: any) => {
  // Generate a unique request ID
  const requestId = req.headers["x-request-id"] || `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  // Add request ID to response headers
  res.setHeader("X-Request-ID", requestId)

  // Add request context to request object for use in other parts of the application
  req.requestId = requestId
  req.requestContext = {
    requestId,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.headers["user-agent"],
    timestamp: new Date().toISOString(),
  }

  next()
}

/**
 * Create a contextual logger for a specific request
 */
export const createRequestLogger = (req: any) => {
  const context = req.requestContext || {}
  
  return {
    info: (message: string, meta?: any) => logger.info(message, { ...context, ...meta }),
    error: (message: string, meta?: any) => logger.error(message, { ...context, ...meta }),
    warn: (message: string, meta?: any) => logger.warn(message, { ...context, ...meta }),
    debug: (message: string, meta?: any) => logger.debug(message, { ...context, ...meta }),
    http: (message: string, meta?: any) => logger.http(message, { ...context, ...meta }),
  }
}

/**
 * Log performance metrics
 */
export const logPerformance = (operation: string, duration: number, metadata?: any) => {
  logger.info("Performance metric", {
    operation,
    duration,
    ...metadata,
  })
}

/**
 * Log database operations
 */
export const logDatabase = (operation: string, table: string, duration?: number, metadata?: any) => {
  logger.debug("Database operation", {
    operation,
    table,
    duration,
    ...metadata,
  })
}

/**
 * Log authentication events
 */
export const logAuth = (event: string, userId?: string, metadata?: any) => {
  logger.info("Authentication event", {
    event,
    userId,
    ...metadata,
  })
}

/**
 * Log API requests
 */
export const logApiRequest = (method: string, url: string, statusCode: number, duration: number, metadata?: any) => {
  logger.http("API request", {
    method,
    url,
    statusCode,
    duration,
    ...metadata,
  })
}

/**
 * Log security events
 */
export const logSecurity = (event: string, severity: "low" | "medium" | "high" | "critical", metadata?: any) => {
  const logLevel = severity === "critical" || severity === "high" ? "error" : severity === "medium" ? "warn" : "info"
  
  logger[logLevel]("Security event", {
    event,
    severity,
    ...metadata,
  })
}

/**
 * Log business events
 */
export const logBusiness = (event: string, metadata?: any) => {
  logger.info("Business event", {
    event,
    ...metadata,
  })
}

export default logger
