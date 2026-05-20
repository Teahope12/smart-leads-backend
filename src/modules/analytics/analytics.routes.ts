import { Router } from 'express';
import { AnalyticsController } from './analytics.controller';
import { authMiddleware } from '../../shared/middleware/auth.middleware';

const router = Router();
const analyticsController = new AnalyticsController();

// All analytics routes require authentication
router.use(authMiddleware);
router.get('/', analyticsController.getAnalytics);

export const analyticsRoutes = router;