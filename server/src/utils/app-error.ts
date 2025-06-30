/**
 * Custom application error classes for consistent error handling
 */

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly code?: string;
  public readonly errors?: Record<string, string[]>;

  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true,
    code?: string,
    errors?: Record<string, string[]>
  ) {
    super(message);
    
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.code = code;
    this.errors = errors;

    // Maintains proper stack trace for where our error was thrown
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, errors?: Record<string, string[]>) {
    super(message, 400, true, 'VALIDATION_ERROR', errors);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed') {
    super(message, 401, true, 'AUTHENTICATION_ERROR');
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Access forbidden') {
    super(message, 403, true, 'FORBIDDEN_ERROR');
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404, true, 'NOT_FOUND_ERROR');
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Resource conflict') {
    super(message, 409, true, 'CONFLICT_ERROR');
  }
}

export class TooManyRequestsError extends AppError {
  constructor(message: string = 'Too many requests') {
    super(message, 429, true, 'RATE_LIMIT_ERROR');
  }
}

export class InternalServerError extends AppError {
  constructor(message: string = 'Internal server error') {
    super(message, 500, true, 'INTERNAL_SERVER_ERROR');
  }
}

export class BadRequestError extends AppError {
  constructor(message: string = 'Bad request') {
    super(message, 400, true, 'BAD_REQUEST_ERROR');
  }
}

export class UnprocessableEntityError extends AppError {
  constructor(message: string = 'Unprocessable entity', errors?: Record<string, string[]>) {
    super(message, 422, true, 'UNPROCESSABLE_ENTITY_ERROR', errors);
  }
}

export class ServiceUnavailableError extends AppError {
  constructor(message: string = 'Service unavailable') {
    super(message, 503, true, 'SERVICE_UNAVAILABLE_ERROR');
  }
}

/**
 * Helper function to create custom errors
 */
export const createError = (
  message: string,
  statusCode: number = 500,
  code?: string,
  errors?: Record<string, string[]>
): AppError => {
  return new AppError(message, statusCode, true, code, errors);
};

/**
 * Type guard to check if error is an AppError
 */
export const isAppError = (error: any): error is AppError => {
  return error instanceof AppError;
};

/**
 * Type guard to check if error is operational
 */
export const isOperationalError = (error: any): boolean => {
  if (isAppError(error)) {
    return error.isOperational;
  }
  return false;
};
