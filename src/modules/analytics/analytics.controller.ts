import { Request, Response } from 'express';
import { AnalyticsService } from './analytics.service';

const analyticsService = new AnalyticsService();

export class AnalyticsController {
  async getAnalytics(req: Request, res: Response) {
    try {
      const analytics = await analyticsService.getAnalytics(
        (req as any).user._id,
        (req as any).user.role
      );
      
      res.status(200).json({
        success: true,
        data: analytics
      });
    } catch (error: any) {
      console.error('Analytics error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch analytics'
      });
    }
  }
}