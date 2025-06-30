import { Request } from 'express';

/**
 * Extended request interface with authenticated user information
 */
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

// Re-export the authenticate middleware from auth.ts for consistency
export { authenticate, authorize, optionalAuth } from './auth';

// Add auth alias for backward compatibility
export { authenticate as auth } from './auth';
