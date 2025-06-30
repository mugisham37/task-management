import { Router } from "express";
import activityRoutes from "./activity.routes";
import analyticsRoutes from "./analytics.routes";
import authRoutes from "./auth.routes";
import calendarRoutes from "./calendar.routes";
import commentRoutes from "./comment.routes";
import dashboardRoutes from "./dashboard.routes";
import exportImportRoutes from "./export-import.routes";

const router = Router();

// API version prefix
const API_VERSION = "/api/v1";

// Mount all routes with their respective paths
router.use(`${API_VERSION}/activities`, activityRoutes);
router.use(`${API_VERSION}/analytics`, analyticsRoutes);
router.use(`${API_VERSION}/auth`, authRoutes);
router.use(`${API_VERSION}/calendar`, calendarRoutes);
router.use(`${API_VERSION}/comments`, commentRoutes);
router.use(`${API_VERSION}/dashboard`, dashboardRoutes);
router.use(`${API_VERSION}/export-import`, exportImportRoutes);

// API documentation route
router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Task Management API",
    version: "1.0.0",
    endpoints: {
      activities: `${API_VERSION}/activities`,
      analytics: `${API_VERSION}/analytics`,
      auth: `${API_VERSION}/auth`,
      calendar: `${API_VERSION}/calendar`,
      comments: `${API_VERSION}/comments`,
      dashboard: `${API_VERSION}/dashboard`,
      exportImport: `${API_VERSION}/export-import`,
    },
    documentation: "/api-docs",
    timestamp: new Date().toISOString(),
  });
});

export default router;
