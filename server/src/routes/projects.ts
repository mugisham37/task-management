import { Router } from 'express';
import { authenticate, AuthenticatedRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Get all projects (protected route)
router.get('/', authenticate, asyncHandler(async (req: AuthenticatedRequest, res) => {
  res.json({
    success: true,
    message: 'Projects endpoint - coming soon',
    data: [],
  });
}));

export default router;
