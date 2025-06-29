/**
 * Validators Index
 * 
 * This file exports all validation middleware for the application.
 * These validators use express-validator and are designed to work with PostgreSQL/UUID-based data.
 */

// Common validation utilities
export * from './common.validator';

// Activity validators
export * as activityValidators from './activity.validator';

// Authentication validators
export * as authValidators from './auth.validator';

// Calendar event validators
export * as calendarEventValidators from './calendar-event.validator';

// Comment validators
export * as commentValidators from './comment.validator';

// Feedback validators
export * as feedbackValidators from './feedback.validator';

// Invitation validators
export * as invitationValidators from './invitation.validator';

// Notification validators
export * as notificationValidators from './notification.validator';

// Project validators
export * as projectValidators from './project.validator';

// Recurring task validators
export * as recurringTaskValidators from './recurring-task.validator';

// Task validators
export * as taskValidators from './task.validator';

// Task template validators
export * as taskTemplateValidators from './task-template.validator';

// Team validators
export * as teamValidators from './team.validator';

// Workspace validators
export * as workspaceValidators from './workspace.validator';

// Re-export individual validators for convenience
export {
  // Activity validators
  getUserActivities,
  getTeamActivities,
  getWorkspaceActivities,
  getProjectActivities,
  getTaskActivities,
  getActivityById,
  getActivityStats,
  createActivity,
  cleanupOldActivities,
} from './activity.validator';

export {
  // Auth validators
  register,
  login,
  refreshToken,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendEmailVerification,
  changePassword,
  updateProfile,
  logout,
  logoutAll,
  checkUsernameAvailability,
  checkEmailAvailability,
} from './auth.validator';

export {
  // Calendar event validators
  createCalendarEvent,
  updateCalendarEvent,
  getCalendarEvent,
  deleteCalendarEvent,
  getCalendarEvents,
  respondToEventInvitation,
  addEventAttendees,
  removeEventAttendees,
  addEventReminders,
  removeEventReminders,
  getUserCalendarEvents,
} from './calendar-event.validator';

export {
  // Comment validators
  createComment,
  updateComment,
  getComment,
  deleteComment,
  getTaskComments,
  getProjectComments,
  getComments,
  addCommentAttachment,
  removeCommentAttachment,
  addCommentReaction,
  removeCommentReaction,
  getCommentStats,
  bulkDeleteComments,
  reportComment,
  toggleCommentPin,
} from './comment.validator';

export {
  // Feedback validators
  createFeedback,
  updateFeedback,
  adminUpdateFeedback,
  getFeedbacks,
  getFeedback,
  deleteFeedback,
  voteFeedback,
  getFeedbackStats,
  bulkUpdateFeedback,
} from './feedback.validator';

export {
  // Invitation validators
  createInvitation,
  getTeamInvitations,
  getInvitationByToken,
  acceptInvitation,
  declineInvitation,
  cancelInvitation,
  resendInvitation,
} from './invitation.validator';

export {
  // Notification validators
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from './notification.validator';

export {
  // Project validators
  createProject,
  updateProject,
  getProject,
  deleteProject,
  getProjects,
} from './project.validator';

export {
  // Recurring task validators
  createRecurringTaskSchema,
  updateRecurringTaskSchema,
} from './recurring-task.validator';

export {
  // Task validators
  createTask,
  updateTask,
  getTask,
  deleteTask,
  getTasks,
  bulkUpdateTasks,
  addTaskAttachment,
  removeTaskAttachment,
  updateTaskStatus,
  assignTask,
  unassignTask,
  addTaskComment,
  getTaskComments,
  addTaskTag,
  removeTaskTag,
  duplicateTask,
  moveTask,
  getTaskStats,
  getTaskHistory,
  restoreTask,
  archiveTask,
} from './task.validator';

export {
  // Task template validators
  createTaskTemplateSchema,
  updateTaskTemplateSchema,
  createTaskFromTemplateSchema,
} from './task-template.validator';

export {
  // Team validators
  createTeam,
  updateTeam,
  getTeam,
  deleteTeam,
  getTeams,
  addTeamMember,
  removeTeamMember,
  updateTeamMemberRole,
  leaveTeam,
  transferTeamOwnership,
  getTeamStats,
  getTeamMembers,
  archiveTeam,
  restoreTeam,
  bulkUpdateTeams,
  duplicateTeam,
} from './team.validator';

export {
  // Workspace validators
  createWorkspace,
  updateWorkspace,
  getWorkspace,
  deleteWorkspace,
  getWorkspaces,
  getWorkspaceProjects,
  getWorkspaceTasks,
  createPersonalWorkspace,
  getPersonalWorkspace,
  getWorkspaceStats,
  archiveWorkspace,
  restoreWorkspace,
  transferWorkspaceOwnership,
  bulkUpdateWorkspaces,
  duplicateWorkspace,
  addWorkspaceMember,
  removeWorkspaceMember,
  updateWorkspaceMemberRole,
} from './workspace.validator';

// Common validation utilities re-export
export {
  validateUuidParam,
  validateUuidBody,
  validatePagination,
  validateSort,
  validateDateRange,
  validateEmail,
  validatePassword,
  validateTextContent,
  validateUuidArray,
  validateUrl,
  validateHexColor,
  validateFileSize,
  validateMimeType,
} from './common.validator';
