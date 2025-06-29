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
