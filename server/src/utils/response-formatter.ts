import { Response } from 'express';

/**
 * Standard API response interface
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    pages?: number;
    [key: string]: any;
  };
  errors?: any;
}

/**
 * Send a success response
 * @param res - Express response object
 * @param statusCode - HTTP status code
 * @param data - Response data
 * @param message - Success message
 * @param meta - Additional metadata
 */
export const successResponse = <T>(
  res: Response,
  statusCode: number,
  data: T,
  message: string = 'Success',
  meta?: any
): Response => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
    ...(meta && { meta })
  };

  return res.status(statusCode).json(response);
};

/**
 * Send an error response
 * @param res - Express response object
 * @param statusCode - HTTP status code
 * @param message - Error message
 * @param errors - Detailed error information
 */
export const errorResponse = (
  res: Response,
  statusCode: number,
  message: string = 'An error occurred',
  errors?: any
): Response => {
  const response: ApiResponse = {
    success: false,
    message,
    ...(errors && { errors })
  };

  return res.status(statusCode).json(response);
};

/**
 * Legacy response formatter for backward compatibility
 * @param res - Express response object
 * @param statusCode - HTTP status code
 * @param message - Response message
 * @param data - Response data
 * @param meta - Additional metadata
 */
export const responseFormatter = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T,
  meta?: any
): Response => {
  return successResponse(res, statusCode, data, message, meta);
};
