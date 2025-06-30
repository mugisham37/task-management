import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

interface EnvironmentConfig {
  // Server Configuration
  port: number;
  nodeEnv: string;
  clientUrl: string;

  // Database Configuration
  databaseUrl: string;

  // JWT Configuration
  jwtSecret: string;

  // Redis Configuration
  redisUrl?: string;

  // Email Configuration
  smtpHost?: string;
  smtpPort?: number;
  smtpUser?: string;
  smtpPass?: string;

  // File Upload Configuration
  maxFileSize: number;
  uploadPath: string;

  // Logging Configuration
  logLevel: string;

  // Rate Limiting Configuration
  rateLimitWindowMs: number;
  rateLimitMaxRequests: number;

  // Session Configuration
  sessionSecret: string;

  // CORS Configuration
  allowedOrigins: string[];

  // Job Configuration
  enableJobs: string;
  jobIntervals: {
    taskNotifications: number;
    recurringTasks: number;
    calendarReminders: number;
    overdueTaskCheck: number;
  };
}

const config: EnvironmentConfig = {
  // Server Configuration
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',

  // Database Configuration
  databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/taskmanagement',

  // JWT Configuration
  jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',

  // Redis Configuration
  redisUrl: process.env.REDIS_URL,

  // Email Configuration
  smtpHost: process.env.SMTP_HOST,
  smtpPort: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : undefined,
  smtpUser: process.env.SMTP_USER,
  smtpPass: process.env.SMTP_PASS,

  // File Upload Configuration
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10), // 10MB default
  uploadPath: process.env.UPLOAD_PATH || 'uploads',

  // Logging Configuration
  logLevel: process.env.LOG_LEVEL || 'info',

  // Rate Limiting Configuration
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
  rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),

  // Session Configuration
  sessionSecret: process.env.SESSION_SECRET || 'your-session-secret-change-this-in-production',

  // CORS Configuration
  allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],

  // Job Configuration
  enableJobs: process.env.ENABLE_JOBS || 'true',
  jobIntervals: {
    taskNotifications: parseInt(process.env.TASK_NOTIFICATIONS_INTERVAL || '300000', 10), // 5 minutes
    recurringTasks: parseInt(process.env.RECURRING_TASKS_INTERVAL || '300000', 10), // 5 minutes
    calendarReminders: parseInt(process.env.CALENDAR_REMINDERS_INTERVAL || '300000', 10), // 5 minutes
    overdueTaskCheck: parseInt(process.env.OVERDUE_TASK_CHECK_INTERVAL || '3600000', 10), // 1 hour
  }
};

// Validation
if (!config.jwtSecret || config.jwtSecret === 'your-super-secret-jwt-key-change-this-in-production') {
  if (config.nodeEnv === 'production') {
    throw new Error('JWT_SECRET must be set in production');
  }
  console.warn('Warning: Using default JWT_SECRET. Please set a secure JWT_SECRET in production.');
}

if (!config.sessionSecret || config.sessionSecret === 'your-session-secret-change-this-in-production') {
  if (config.nodeEnv === 'production') {
    throw new Error('SESSION_SECRET must be set in production');
  }
  console.warn('Warning: Using default SESSION_SECRET. Please set a secure SESSION_SECRET in production.');
}

export default config;
