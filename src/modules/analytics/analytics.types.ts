export interface IAnalyticsData {
  totalLeads: number;
  leadsByStatus: {
    status: string;
    count: number;
    percentage: number;
    color: string;
  }[];
  leadsBySource: {
    source: string;
    count: number;
    percentage: number;
    icon: string;
  }[];
  leadsByMonth: {
    month: string;
    count: number;
    year: number;
  }[];
  recentActivity: {
    _id: string;
    name: string;
    email: string;
    status: string;
    source: string;
    createdAt: string;
    createdBy: {
      name: string;
    };
  }[];
  conversionRate: {
    total: number;
    qualified: number;
    lost: number;
    rate: number;
  };
  averageLeadsPerDay: number;
  topPerformers: {
    userId: string;
    name: string;
    leadCount: number;
  }[];
  trends: {
    daily: { date: string; count: number }[];
    weekly: { week: string; count: number }[];
    monthly: { month: string; count: number }[];
  };
}