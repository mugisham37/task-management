import { z } from 'zod';

// User Types
export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  username: z.string().min(3).max(20),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  avatar: z.string().url().optional(),
  role: z.enum(['admin', 'user']).default('user'),
  isEmailVerified: z.boolean().default(false),
  preferences: z.object({
    theme: z.enum(['light', 'dark', 'system']).default('system'),
    notifications: z.boolean().default(true),
    language: z.string().default('en'),
  }).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type User = z.infer<typeof UserSchema>;

// Task Types
export const TaskPrioritySchema = z.enum(['low', 'medium', 'high', 'urgent']);
export const TaskStatusSchema = z.enum(['todo', 'in-progress', 'review', 'completed', 'cancelled']);

export const TaskSchema = z.object({
  id: z.string(),
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  status: TaskStatusSchema,
  priority: TaskPrioritySchema,
  assigneeId: z.string().optional(),
  assignee: UserSchema.optional(),
  creatorId: z.string(),
  creator: UserSchema.optional(),
  projectId: z.string().optional(),
  tags: z.array(z.string()).default([]),
  dueDate: z.date().optional(),
  estimatedHours: z.number().positive().optional(),
  actualHours: z.number().positive().optional(),
  attachments: z.array(z.object({
    id: z.string(),
    filename: z.string(),
    url: z.string().url(),
    size: z.number(),
    mimeType: z.string(),
  })).default([]),
  comments: z.array(z.object({
    id: z.string(),
    content: z.string(),
    authorId: z.string(),
    author: UserSchema.optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })).default([]),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Task = z.infer<typeof TaskSchema>;
export type TaskPriority = z.infer<typeof TaskPrioritySchema>;
export type TaskStatus = z.infer<typeof TaskStatusSchema>;

// Project Types
export const ProjectSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i).default('#3B82F6'),
  ownerId: z.string(),
  owner: UserSchema.optional(),
  members: z.array(UserSchema).default([]),
  tasks: z.array(TaskSchema).default([]),
  isArchived: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Project = z.infer<typeof ProjectSchema>;

// Authentication Types
export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const RegisterSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(20),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type LoginRequest = z.infer<typeof LoginSchema>;
export type RegisterRequest = z.infer<typeof RegisterSchema>;

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Socket Event Types
export interface SocketEvents {
  // Task events
  'task:created': Task;
  'task:updated': Task;
  'task:deleted': { id: string };
  'task:assigned': { taskId: string; assigneeId: string };
  
  // Project events
  'project:created': Project;
  'project:updated': Project;
  'project:deleted': { id: string };
  'project:member-added': { projectId: string; userId: string };
  'project:member-removed': { projectId: string; userId: string };
  
  // User events
  'user:online': { userId: string };
  'user:offline': { userId: string };
  
  // Notification events
  'notification:new': Notification;
}

// Notification Types
export const NotificationSchema = z.object({
  id: z.string(),
  userId: z.string(),
  title: z.string(),
  message: z.string(),
  type: z.enum(['info', 'success', 'warning', 'error']),
  isRead: z.boolean().default(false),
  data: z.record(z.any()).optional(),
  createdAt: z.date(),
});

export type Notification = z.infer<typeof NotificationSchema>;

// Form Validation Schemas
export const CreateTaskSchema = TaskSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  creator: true,
  assignee: true,
  comments: true,
});

export const UpdateTaskSchema = CreateTaskSchema.partial();

export const CreateProjectSchema = ProjectSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  owner: true,
  members: true,
  tasks: true,
});

export const UpdateProjectSchema = CreateProjectSchema.partial();

export type CreateTaskRequest = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskRequest = z.infer<typeof UpdateTaskSchema>;
export type CreateProjectRequest = z.infer<typeof CreateProjectSchema>;
export type UpdateProjectRequest = z.infer<typeof UpdateProjectSchema>;

// Utility Types
export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filter?: Record<string, any>;
}

export interface TaskFilters {
  status?: TaskStatus[];
  priority?: TaskPriority[];
  assigneeId?: string[];
  projectId?: string[];
  tags?: string[];
  dueDateFrom?: Date;
  dueDateTo?: Date;
}

export interface ProjectFilters {
  ownerId?: string;
  isArchived?: boolean;
  memberIds?: string[];
}
