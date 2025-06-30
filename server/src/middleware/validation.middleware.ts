import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'

/**
 * Middleware to handle validation errors from express-validator
 */
export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req)
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: 'path' in error ? error.path : 'unknown',
        message: error.msg,
        value: 'value' in error ? error.value : undefined
      }))
    })
  }
  
  next()
}

/**
 * Alternative validation middleware with different error format
 */
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req)
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation errors',
      errors: errors.array().map(error => ({
        field: 'path' in error ? error.path : 'unknown',
        message: error.msg
      }))
    })
  }
  
  next()
}

/**
 * Validation middleware that throws errors instead of returning response
 */
export const throwValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req)
  
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed')
    ;(error as any).statusCode = 400
    ;(error as any).errors = errors.array()
    throw error
  }
  
  next()
}
