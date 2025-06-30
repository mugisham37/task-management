import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';

/**
 * Validation middleware that processes express-validator results
 */
export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Run all validations
    await Promise.all(validations.map(validation => validation.run(req)));

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map(error => ({
          field: error.type === 'field' ? error.path : error.type,
          message: error.msg,
          value: error.type === 'field' ? error.value : undefined,
        })),
      });
    }

    next();
  };
};

/**
 * Alternative validation middleware for single validation chain
 */
export const validateSingle = (validation: ValidationChain) => {
  return validate([validation]);
};

/**
 * Middleware to handle validation errors in a more detailed format
 */
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().reduce((acc: any, error: any) => {
      const field = error.type === 'field' ? error.path : error.type;
      if (!acc[field]) {
        acc[field] = [];
      }
      acc[field].push(error.msg);
      return acc;
    }, {});

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: formattedErrors,
      details: errors.array(),
    });
  }

  next();
};
