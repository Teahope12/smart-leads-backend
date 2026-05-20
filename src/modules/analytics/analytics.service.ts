import { Lead } from '../../shared/models/Lead.model';
import { User } from '../../shared/models/User.model';
import { IAnalyticsData } from './analytics.types';

export class AnalyticsService {
  async getAnalytics(userId: string, userRole: string): Promise<IAnalyticsData> {
    // Build query based on user role
    const query: any = {};
    if (userRole !== 'Admin') {
      query.createdBy = userId;
    }

    // Get all leads for analytics
    const leads = await Lead.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    const totalLeads = leads.length;

    // Leads by Status
    const statusMap = new Map();
    leads.forEach(lead => {
      statusMap.set(lead.status, (statusMap.get(lead.status) || 0) + 1);
    });
    
    const statusColors: Record<string, string> = {
      New: '#10B981',
      Contacted: '#F59E0B',
      Qualified: '#3B82F6',
      Lost: '#EF4444'
    };

    const leadsByStatus = Array.from(statusMap.entries()).map(([status, count]) => ({
      status: status as string,
      count: count as number,
      percentage: totalLeads > 0 ? ((count as number) / totalLeads) * 100 : 0,
      color: statusColors[status as string] || '#6B7280'
    }));

    // Leads by Source
    const sourceMap = new Map();
    const sourceIcons: Record<string, string> = {
      Website: '🌐',
      Instagram: '📸',
      Referral: '👥'
    };
    
    leads.forEach(lead => {
      sourceMap.set(lead.source, (sourceMap.get(lead.source) || 0) + 1);
    });

    const leadsBySource = Array.from(sourceMap.entries()).map(([source, count]) => ({
      source: source as string,
      count: count as number,
      percentage: totalLeads > 0 ? ((count as number) / totalLeads) * 100 : 0,
      icon: sourceIcons[source as string] || '📌'
    }));

    // Leads by Month (last 6 months)
    const monthMap = new Map();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    leads.forEach(lead => {
      const date = new Date(lead.createdAt);
      if (date >= sixMonthsAgo) {
        const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
        const monthName = date.toLocaleString('default', { month: 'short' });
        monthMap.set(monthKey, {
          month: monthName,
          year: date.getFullYear(),
          count: (monthMap.get(monthKey)?.count || 0) + 1
        });
      }
    });

    const leadsByMonth = Array.from(monthMap.values()).sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month);
    });

    // Recent Activity (last 10 leads) - Fixed type conversion
    const recentActivity = leads.slice(0, 10).map(lead => ({
      _id: lead._id.toString(),
      name: lead.name,
      email: lead.email,
      status: lead.status,
      source: lead.source,
      createdAt: lead.createdAt.toISOString(),
      createdBy: {
        name: (lead.createdBy as any)?.name || 'Unknown'
      }
    }));

    // Conversion Rate
    const qualified = leads.filter(l => l.status === 'Qualified').length;
    const lost = leads.filter(l => l.status === 'Lost').length;
    const conversionRate = totalLeads > 0 ? (qualified / totalLeads) * 100 : 0;

    // Average Leads Per Day (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const last30DaysLeads = leads.filter(l => new Date(l.createdAt) >= thirtyDaysAgo);
    const averageLeadsPerDay = last30DaysLeads.length / 30;

    // Top Performers (users with most leads)
    const userLeadCount = new Map();
    leads.forEach(lead => {
      const createdBy = lead.createdBy as any;
      if (createdBy && createdBy._id) {
        const userIdStr = createdBy._id.toString();
        userLeadCount.set(userIdStr, {
          userId: userIdStr,
          name: createdBy.name,
          leadCount: (userLeadCount.get(userIdStr)?.leadCount || 0) + 1
        });
      }
    });

    const topPerformers = Array.from(userLeadCount.values())
      .sort((a, b) => b.leadCount - a.leadCount)
      .slice(0, 5);

    // Trends (daily, weekly, monthly)
    const dailyMap = new Map();
    const weeklyMap = new Map();
    const monthlyMap = new Map();

    leads.forEach(lead => {
      const date = new Date(lead.createdAt);
      const dateStr = date.toISOString().split('T')[0];
      dailyMap.set(dateStr, (dailyMap.get(dateStr) || 0) + 1);

      const weekStr = `${date.getFullYear()}-W${Math.ceil(date.getDate() / 7)}`;
      weeklyMap.set(weekStr, (weeklyMap.get(weekStr) || 0) + 1);

      const monthStr = `${date.getFullYear()}-${date.getMonth() + 1}`;
      monthlyMap.set(monthStr, (monthlyMap.get(monthStr) || 0) + 1);
    });

    const trends = {
      daily: Array.from(dailyMap.entries())
        .slice(-30)
        .map(([date, count]) => ({ date, count: count as number })),
      weekly: Array.from(weeklyMap.entries())
        .slice(-12)
        .map(([week, count]) => ({ week, count: count as number })),
      monthly: Array.from(monthlyMap.entries())
        .slice(-6)
        .map(([month, count]) => ({ month, count: count as number }))
    };

    return {
      totalLeads,
      leadsByStatus,
      leadsBySource,
      leadsByMonth,
      recentActivity,
      conversionRate: {
        total: totalLeads,
        qualified,
        lost,
        rate: conversionRate
      },
      averageLeadsPerDay,
      topPerformers,
      trends
    };
  }
}