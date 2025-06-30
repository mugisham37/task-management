import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';
import { createError } from './errorHandler';

// Ensure upload directories exist
const ensureUploadDirs = () => {
  const dirs = [
    'uploads/attachments',
    'uploads/avatars',
    'uploads/feedback',
    'uploads/temp',
    'uploads/exports',
    'uploads/imports'
  ];
  
  dirs.forEach(dir => {
    const fullPath = path.join(process.cwd(), dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
  });
};

// Initialize upload directories
ensureUploadDirs();

// Storage configuration for different file types
const createStorage = (destination: string) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(process.cwd(), 'uploads', destination);
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      // Generate unique filename
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
      const ext = path.extname(file.originalname);
      const name = path.basename(file.originalname, ext);
      cb(null, `${name}-${uniqueSuffix}${ext}`);
    }
  });
};

// File filter for different types
const createFileFilter = (allowedTypes: string[], maxSize?: number) => {
  return (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // Check file type
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(createError(`File type ${file.mimetype} is not allowed. Allowed types: ${allowedTypes.join(', ')}`, 400));
    }
    
    cb(null, true);
  };
};

// Common file types
const IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp'
];

const DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
  'text/csv'
];

const ARCHIVE_TYPES = [
  'application/zip',
  'application/x-zip-compressed',
  'application/x-rar-compressed',
  'application/x-7z-compressed'
];

const ALL_ALLOWED_TYPES = [...IMAGE_TYPES, ...DOCUMENT_TYPES, ...ARCHIVE_TYPES];

// Avatar upload middleware
export const avatarUpload = multer({
  storage: createStorage('avatars'),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 1
  },
  fileFilter: createFileFilter(IMAGE_TYPES)
});

// Attachment upload middleware
export const attachmentUpload = multer({
  storage: createStorage('attachments'),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
    files: 10
  },
  fileFilter: createFileFilter(ALL_ALLOWED_TYPES)
});

// Feedback upload middleware (for screenshots and attachments)
export const feedbackUpload = multer({
  storage: createStorage('feedback'),
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB
    files: 5
  },
  fileFilter: createFileFilter([...IMAGE_TYPES, ...DOCUMENT_TYPES])
});

// Import file upload middleware
export const importUpload = multer({
  storage: createStorage('imports'),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB
    files: 1
  },
  fileFilter: createFileFilter(['text/csv', 'application/json', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'])
});

// General upload middleware
export const upload = multer({
  storage: createStorage('temp'),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
    files: 10
  },
  fileFilter: createFileFilter(ALL_ALLOWED_TYPES)
});

// Memory storage for temporary processing
export const memoryUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 1
  },
  fileFilter: createFileFilter(ALL_ALLOWED_TYPES)
});

// Custom upload middleware with validation
export const createUploadMiddleware = (options: {
  destination: string;
  allowedTypes: string[];
  maxFileSize: number;
  maxFiles: number;
}) => {
  return multer({
    storage: createStorage(options.destination),
    limits: {
      fileSize: options.maxFileSize,
      files: options.maxFiles
    },
    fileFilter: createFileFilter(options.allowedTypes)
  });
};

// File cleanup utility
export const cleanupFile = (filePath: string) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error('Error cleaning up file:', error);
  }
};

// Cleanup multiple files
export const cleanupFiles = (filePaths: string[]) => {
  filePaths.forEach(cleanupFile);
};

// File validation middleware (to be used after multer)
export const validateUploadedFiles = (req: Request, res: any, next: any) => {
  const files = req.files as Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] };
  const file = req.file as Express.Multer.File;
  
  try {
    // Validate single file
    if (file) {
      validateSingleFile(file);
    }
    
    // Validate multiple files
    if (files) {
      if (Array.isArray(files)) {
        files.forEach(validateSingleFile);
      } else {
        Object.values(files).flat().forEach(validateSingleFile);
      }
    }
    
    next();
  } catch (error) {
    // Cleanup uploaded files on validation error
    if (file) cleanupFile(file.path);
    if (files) {
      const filesToCleanup = Array.isArray(files) ? files : Object.values(files).flat();
      filesToCleanup.forEach(f => cleanupFile(f.path));
    }
    
    next(error);
  }
};

// Validate individual file
const validateSingleFile = (file: Express.Multer.File) => {
  // Check if file exists
  if (!fs.existsSync(file.path)) {
    throw createError('Uploaded file not found', 400);
  }
  
  // Check file size matches
  const stats = fs.statSync(file.path);
  if (stats.size !== file.size) {
    throw createError('File size mismatch', 400);
  }
  
  // Additional security checks could be added here
  // e.g., virus scanning, content type validation, etc.
};

// Middleware to handle multer errors
export const handleUploadErrors = (error: any, req: Request, res: any, next: any) => {
  if (error instanceof multer.MulterError) {
    let message = 'File upload error';
    let statusCode = 400;
    
    switch (error.code) {
      case 'LIMIT_FILE_SIZE':
        message = 'File too large';
        break;
      case 'LIMIT_FILE_COUNT':
        message = 'Too many files';
        break;
      case 'LIMIT_UNEXPECTED_FILE':
        message = 'Unexpected file field';
        break;
      case 'LIMIT_PART_COUNT':
        message = 'Too many parts';
        break;
      case 'LIMIT_FIELD_KEY':
        message = 'Field name too long';
        break;
      case 'LIMIT_FIELD_VALUE':
        message = 'Field value too long';
        break;
      case 'LIMIT_FIELD_COUNT':
        message = 'Too many fields';
        break;
      default:
        message = error.message;
    }
    
    return res.status(statusCode).json({
      success: false,
      message,
      error: error.code
    });
  }
  
  next(error);
};

// Get file URL helper
export const getFileUrl = (filePath: string): string => {
  // Remove the uploads/ prefix and return relative path
  return filePath.replace(/^uploads\//, '');
};

// Check if file exists
export const fileExists = (filePath: string): boolean => {
  const fullPath = path.join(process.cwd(), 'uploads', filePath);
  return fs.existsSync(fullPath);
};

// Get file info
export const getFileInfo = (filePath: string) => {
  const fullPath = path.join(process.cwd(), 'uploads', filePath);
  
  if (!fs.existsSync(fullPath)) {
    return null;
  }
  
  const stats = fs.statSync(fullPath);
  const ext = path.extname(fullPath);
  const name = path.basename(fullPath, ext);
  
  return {
    name,
    extension: ext,
    size: stats.size,
    createdAt: stats.birthtime,
    modifiedAt: stats.mtime,
    path: filePath
  };
};
