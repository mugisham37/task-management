import { Request, Response, NextFunction } from 'express';
import { auditLogRepository } from '../db/repositories';
import { AuthRequest } from './auth.middleware';

export interface AuditLogOptions {
  action: string;
  resource: string;
  getDetails?: (req: Request) => any;
  skipCondition?: (req: Request) => boolean;
  includeRequestBody?: boolean;
  includeResponseBody?: boolean;
  sensitiveFields?: string[];
}

/**
 * Middleware to log user actions for audit purposes
 */
export const auditLogMiddleware = (options: AuditLogOptions) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    // Skip if condition is met
    if (options.skipCondition && options.skipCondition(req)) {
      return next();
    }

    // Store original res.json to capture response
    const originalJson = res.json;
    let responseBody: any = null;
    let statusCode = 200;

    // Override res.json to capture response
    res.json = function(body: any) {
      responseBody = body;
      statusCode = res.statusCode;
      return originalJson.call(this, body);
    };

    // Continue with the request
    next();

    // Log after response is sent
    res.on('finish', async () => {
      try {
        await logAuditEntry(req, res, options, responseBody, statusCode);
      } catch (error) {
        console.error('Failed to log audit entry:', error);
      }
    });
  };
};

/**
 * Create audit log entry
 */
const logAuditEntry = async (
  req: AuthRequest,
  res: Response,
  options: AuditLogOptions,
  responseBody: any,
  statusCode: number
) => {
  const userId = req.user?.id;
  const userRole = req.user?.role;

  // Get additional details if provided
  let details: any = {};
  if (options.getDetails) {
    details = options.getDetails(req);
  }

  // Include request body if specified
  if (options.includeRequestBody && req.body) {
    details.requestBody = sanitizeData(req.body, options.sensitiveFields);
  }

  // Include response body if specified
  if (options.includeResponseBody && responseBody) {
    details.responseBody = sanitizeData(responseBody, options.sensitiveFields);
  }

  // Add request metadata
  details.method = req.method;
  details.url = req.originalUrl;
  details.statusCode = statusCode;
  details.userAgent = req.get('User-Agent');
  details.ip = req.ip;

  // Create audit log entry
  await auditLogRepository.create({
    userId,
    action: options.action,
    resource: options.resource,
    resourceId: details.resourceId || extractResourceId(req),
    details,
    ipAddress: req.ip,
    userAgent: req.get('User-Agent'),
    success: statusCode >= 200 && statusCode < 400,
    timestamp: new Date(),
  });
};

/**
 * Extract resource ID from request parameters
 */
const extractResourceId = (req: Request): string | null => {
  // Try common parameter names
  const idParams = ['id', 'taskId', 'projectId', 'teamId', 'workspaceId', 'userId'];
  
  for (const param of idParams) {
    if (req.params[param]) {
      return req.params[param];
    }
  }
  
  return null;
};

/**
 * Remove sensitive data from objects
 */
const sanitizeData = (data: any, sensitiveFields: string[] = []): any => {
  if (!data || typeof data !== 'object') {
    return data;
  }

  const defaultSensitiveFields = [
    'password',
    'passwordHash',
    'token',
    'refreshToken',
    'secret',
    'apiKey',
    'privateKey',
    'accessToken',
    'sessionId'
  ];

  const allSensitiveFields = [...defaultSensitiveFields, ...sensitiveFields];

  if (Array.isArray(data)) {
    return data.map(item => sanitizeData(item, sensitiveFields));
  }

  const sanitized: any = {};
  
  for (const [key, value] of Object.entries(data)) {
    if (allSensitiveFields.includes(key.toLowerCase())) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeData(value, sensitiveFields);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
};

/**
 * Predefined audit log middleware for common actions
 */

export const auditCreate = (resource: string, getDetails?: (req: Request) => any) =>
  auditLogMiddleware({
    action: 'create',
    resource,
    getDetails,
    includeRequestBody: true,
  });

export const auditUpdate = (resource: string, getDetails?: (req: Request) => any) =>
  auditLogMiddleware({
    action: 'update',
    resource,
    getDetails,
    includeRequestBody: true,
  });

export const auditDelete = (resource: string, getDetails?: (req: Request) => any) =>
  auditLogMiddleware({
    action: 'delete',
    resource,
    getDetails,
  });

export const auditView = (resource: string, getDetails?: (req: Request) => any) =>
  auditLogMiddleware({
    action: 'view',
    resource,
    getDetails,
    skipCondition: (req) => req.method === 'GET' && req.query.skipAudit === 'true',
  });

export const auditExport = (resource: string, getDetails?: (req: Request) => any) =>
  auditLogMiddleware({
    action: 'export',
    resource,
    getDetails,
    includeRequestBody: true,
  });

export const auditImport = (resource: string, getDetails?: (req: Request) => any) =>
  auditLogMiddleware({
    action: 'import',
    resource,
    getDetails,
    includeRequestBody: true,
  });

export const auditLogin = () =>
  auditLogMiddleware({
    action: 'login',
    resource: 'auth',
    getDetails: (req) => ({
      email: req.body.email,
      loginMethod: 'email',
    }),
    sensitiveFields: ['password'],
  });

export const auditLogout = () =>
  auditLogMiddleware({
    action: 'logout',
    resource: 'auth',
  });

export const auditPasswordChange = () =>
  auditLogMiddleware({
    action: 'password_change',
    resource: 'auth',
    sensitiveFields: ['currentPassword', 'newPassword', 'confirmPassword'],
  });

export const auditPermissionChange = (getDetails?: (req: Request) => any) =>
  auditLogMiddleware({
    action: 'permission_change',
    resource: 'user',
    getDetails,
    includeRequestBody: true,
  });

export const auditDataAccess = (resource: string, getDetails?: (req: Request) => any) =>
  auditLogMiddleware({
    action: 'data_access',
    resource,
    getDetails,
    skipCondition: (req) => req.method === 'GET' && req.query.skipAudit === 'true',
  });

export const auditBulkOperation = (resource: string, getDetails?: (req: Request) => any) =>
  auditLogMiddleware({
    action: 'bulk_operation',
    resource,
    getDetails,
    includeRequestBody: true,
  });

export const auditConfigChange = (getDetails?: (req: Request) => any) =>
  auditLogMiddleware({
    action: 'config_change',
    resource: 'system',
    getDetails,
    includeRequestBody: true,
  });

export const auditFileUpload = (getDetails?: (req: Request) => any) =>
  auditLogMiddleware({
    action: 'file_upload',
    resource: 'file',
    getDetails: (req) => {
      const file = req.file as Express.Multer.File;
      const files = req.files as Express.Multer.File[];
      
      let fileInfo = {};
      
      if (file) {
        fileInfo = {
          filename: file.originalname,
          size: file.size,
          mimetype: file.mimetype,
        };
      } else if (files && files.length > 0) {
        fileInfo = {
          files: files.map(f => ({
            filename: f.originalname,
            size: f.size,
            mimetype: f.mimetype,
          })),
        };
      }
      
      return {
        ...fileInfo,
        ...(getDetails ? getDetails(req) : {}),
      };
    },
  });

export const auditFileDownload = (getDetails?: (req: Request) => any) =>
  auditLogMiddleware({
    action: 'file_download',
    resource: 'file',
    getDetails,
  });

export const auditApiAccess = (getDetails?: (req: Request) => any) =>
  auditLogMiddleware({
    action: 'api_access',
    resource: 'api',
    getDetails: (req) => ({
      endpoint: req.originalUrl,
      method: req.method,
      ...(getDetails ? getDetails(req) : {}),
    }),
    skipCondition: (req) => req.originalUrl.includes('/health'),
  });
