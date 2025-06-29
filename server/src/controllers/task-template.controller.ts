import type { Response, NextFunction } from "express";
import { asyncHandler } from "../utils/async-handler";
import { successResponse } from "../utils/response-formatter";
import { taskTemplateService } from "../services";
import type { AuthRequest } from "../middleware/auth.middleware";

/**
 * @desc    Create a new task template
 * @route   POST /api/v1/task-templates
 * @access  Private
 */
export const createTaskTemplate = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const userId = req.user?.id as string;
  const taskTemplate = await taskTemplateService.createTaskTemplate(req.body, { 
    userId, 
    timestamp: new Date() 
  });
  
  successResponse(res, 201, taskTemplate, "Task template created successfully");
});

/**
 * @desc    Get all task templates for the authenticated user
 * @route   GET /api/v1/task-templates
 * @access  Private
 */
export const getTaskTemplates = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const userId = req.user?.id as string;
  const result = await taskTemplateService.getTaskTemplates(req.query, req.query, { 
    userId, 
    timestamp: new Date() 
  });
  
  successResponse(res, 200, result.data, "Task templates retrieved successfully", {
    total: result.pagination.total,
    page: result.pagination.page,
    limit: result.pagination.limit,
    totalPages: result.pagination.totalPages,
    hasNext: result.pagination.hasNext,
    hasPrev: result.pagination.hasPrev,
  });
});

/**
 * @desc    Get a task template by ID
 * @route   GET /api/v1/task-templates/:id
 * @access  Private
 */
export const getTaskTemplateById = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const userId = req.user?.id as string;
  const templateId = req.params.id;
  const taskTemplate = await taskTemplateService.getTaskTemplateById(templateId, { 
    userId, 
    timestamp: new Date() 
  });
  
  successResponse(res, 200, taskTemplate, "Task template retrieved successfully");
});

/**
 * @desc    Update a task template
 * @route   PUT /api/v1/task-templates/:id
 * @access  Private
 */
export const updateTaskTemplate = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const userId = req.user?.id as string;
  const templateId = req.params.id;
  const taskTemplate = await taskTemplateService.updateTaskTemplate(templateId, req.body, { 
    userId, 
    timestamp: new Date() 
  });
  
  successResponse(res, 200, taskTemplate, "Task template updated successfully");
});

/**
 * @desc    Delete a task template
 * @route   DELETE /api/v1/task-templates/:id
 * @access  Private
 */
export const deleteTaskTemplate = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const userId = req.user?.id as string;
  const templateId = req.params.id;
  await taskTemplateService.deleteTaskTemplate(templateId, { 
    userId, 
    timestamp: new Date() 
  });
  
  successResponse(res, 200, {}, "Task template deleted successfully");
});

/**
 * @desc    Create a task from a template
 * @route   POST /api/v1/task-templates/:id/create-task
 * @access  Private
 */
export const createTaskFromTemplate = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const userId = req.user?.id as string;
  const templateId = req.params.id;
  const task = await taskTemplateService.createTaskFromTemplate(templateId, req.body, { 
    userId, 
    timestamp: new Date() 
  });
  
  successResponse(res, 201, task, "Task created from template successfully");
});

/**
 * @desc    Duplicate a task template
 * @route   POST /api/v1/task-templates/:id/duplicate
 * @access  Private
 */
export const duplicateTaskTemplate = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const userId = req.user?.id as string;
  const templateId = req.params.id;
  const duplicatedTemplate = await taskTemplateService.duplicateTemplate(templateId, { 
    userId, 
    timestamp: new Date() 
  });
  
  successResponse(res, 201, duplicatedTemplate, "Task template duplicated successfully");
});

/**
 * @desc    Get task template categories
 * @route   GET /api/v1/task-templates/categories
 * @access  Private
 */
export const getTaskTemplateCategories = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const userId = req.user?.id as string;
  const categories = await taskTemplateService.getTemplateCategories({ 
    userId, 
    timestamp: new Date() 
  });
  
  successResponse(res, 200, categories, "Task template categories retrieved successfully");
});

/**
 * @desc    Get public task templates
 * @route   GET /api/v1/task-templates/public
 * @access  Private
 */
export const getPublicTaskTemplates = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const userId = req.user?.id as string;
  const result = await taskTemplateService.getPublicTemplates(req.query, { 
    userId, 
    timestamp: new Date() 
  });
  
  successResponse(res, 200, result.data, "Public task templates retrieved successfully", {
    total: result.pagination.total,
    page: result.pagination.page,
    limit: result.pagination.limit,
    totalPages: result.pagination.totalPages,
    hasNext: result.pagination.hasNext,
    hasPrev: result.pagination.hasPrev,
  });
});

/**
 * @desc    Get task template statistics
 * @route   GET /api/v1/task-templates/stats
 * @access  Private
 */
export const getTaskTemplateStats = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const userId = req.user?.id as string;
  const stats = await taskTemplateService.getTaskTemplateStats(req.query, { 
    userId, 
    timestamp: new Date() 
  });
  
  successResponse(res, 200, stats, "Task template statistics retrieved successfully");
});
