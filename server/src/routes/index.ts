import { Router } from "express";
import activityRoutes from "./activity.routes";
import analyticsRoutes from "./analytics.routes";
import authRoutes from "./auth.routes";
import calendarRoutes from "./calendar.routes";

const router = Router();

// API version prefix
const API_VERSION = "/api/v1";

// Mount all routes with their respective paths
router.use(`${API_VERSION}/activities`, activityRoutes);
router.use(`${API_VERSION}/analytics`, analyticsRoutes);
router.use(`${API_VERSION}/auth`, authRoutes);
router.use(`${API_VERSION}/calendar`, calendarRoutes);

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
    },
    documentation: "/api-docs",
    timestamp: new Date().toISOString(),
  });
});

export default router;
