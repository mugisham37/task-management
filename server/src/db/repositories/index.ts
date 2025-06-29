// Base repository exports
export * from './base/interfaces';
export * from './base/types';
export { BaseRepository } from './base/base.repository';

// Repository exports
export { UserRepository, userRepository } from './user.repository';
export { TaskRepository, taskRepository } from './task.repository';
export { ProjectRepository, projectRepository } from './project.repository';
export { WorkspaceRepository, workspaceRepository } from './workspace.repository';
export { CommentRepository, commentRepository } from './comment.repository';
export { NotificationRepository, notificationRepository } from './notification.repository';

// Import repository instances
import { userRepository } from './user.repository';
import { taskRepository } from './task.repository';
import { projectRepository } from './project.repository';
import { workspaceRepository } from './workspace.repository';
import { commentRepository } from './comment.repository';
import { notificationRepository } from './notification.repository';

// Repository instances for easy access
export const repositories = {
  user: userRepository,
  task: taskRepository,
  project: projectRepository,
  workspace: workspaceRepository,
  comment: commentRepository,
  notification: notificationRepository,
} as const;

// Type exports for repository instances
export type Repositories = typeof repositories;
export type RepositoryName = keyof Repositories;
