
import { DashboardSpec } from '../types';

export const SALES_TEMPLATE: DashboardSpec = {
  version: '1.0',
  meta: {
    title: 'Global Sales Performance',
    description: 'A comprehensive view of revenue streams, quarterly targets, and conversion funnel analytics across all global regions.',
    author: 'Sales Operations'
  },
  theme: { mode: 'light', accent: '#2563eb', density: 'cozy' },
  dataSources: [
    {
      id: 'sales_data',
      type: 'inline',
      data: [
        { month: 'Jan', sales: 4200, target: 4000, leads: 120, conversions: 45, region: 'EMEA' },
        { month: 'Feb', sales: 3800, target: 4000, leads: 110, conversions: 38, region: 'AMER' },
        { month: 'Mar', sales: 5100, target: 4500, leads: 150, conversions: 62, region: 'APAC' },
        { month: 'Apr', sales: 4900, target: 4500, leads: 140, conversions: 55, region: 'EMEA' },
        { month: 'May', sales: 6200, target: 5000, leads: 190, conversions: 80, region: 'AMER' }
      ]
    }
  ],
  filters: [
    { id: 'region_filter', type: 'multi-select', label: 'Filter Region', dataSourceId: 'sales_data', field: 'region', options: [{label: 'EMEA', value: 'EMEA'}, {label: 'AMER', value: 'AMER'}, {label: 'APAC', value: 'APAC'}]}
  ],
  sections: [
    {
      id: 'alert_sec',
      layout: { columns: { base: 1, md: 1, lg: 1 }, gap: 4 },
      widgets: [
        { id: 'a1', type: 'alert', severity: 'success', title: 'Target Reached', message: 'Q2 Sales targets have been exceeded by 15% in the AMER region.' }
      ]
    },
    {
      id: 'kpis',
      layout: { columns: { base: 1, md: 3, lg: 3 }, gap: 4 },
      widgets: [
        { id: 's1', type: 'kpi', title: 'Total Revenue', field: 'sales', dataSourceId: 'sales_data', query: { aggregate: { sales: 'sum' } }, prefix: '$' },
        { id: 's2', type: 'kpi', title: 'Total Leads', field: 'leads', dataSourceId: 'sales_data', query: { aggregate: { leads: 'sum' } } },
        { id: 's3', type: 'kpi', title: 'Avg Conversion', field: 'conversions', dataSourceId: 'sales_data', query: { aggregate: { conversions: 'avg' } }, suffix: '%' }
      ]
    },
    {
      id: 'trends',
      title: 'Monthly Revenue vs Targets',
      layout: { columns: { base: 1, md: 1, lg: 1 }, gap: 6 },
      widgets: [
        { id: 'c1', type: 'chart', chartType: 'bar', title: 'Performance by Month', xAxis: 'month', yAxis: ['sales', 'target'], dataSourceId: 'sales_data' }
      ]
    }
  ]
};

export const WEB_TRAFFIC_TEMPLATE: DashboardSpec = {
  version: '1.0',
  meta: {
    title: 'Website Analytics Pro',
    description: 'Detailed analysis of visitor behavior, traffic sources, bounce rates, and user engagement metrics across the web property.',
    author: 'Marketing Team'
  },
  theme: { mode: 'light', accent: '#f59e0b', density: 'comfortable' },
  dataSources: [
    {
      id: 'traffic',
      type: 'inline',
      data: [
        { source: 'Direct', visitors: 1200, bounce_rate: 35, avg_session: 120 },
        { source: 'Social', visitors: 850, bounce_rate: 55, avg_session: 45 },
        { source: 'Search', visitors: 2400, bounce_rate: 25, avg_session: 180 },
        { source: 'Referral', visitors: 400, bounce_rate: 42, avg_session: 90 }
      ]
    }
  ],
  sections: [
    {
      id: 'header',
      layout: { columns: { base: 1, md: 1, lg: 1 }, gap: 0 },
      widgets: [{ id: 't1', type: 'text', variant: 'h2', content: 'Visitor Distribution Overview' }]
    },
    {
      id: 'main',
      layout: { columns: { base: 1, md: 2, lg: 2 }, gap: 6 },
      widgets: [
        { id: 'c1', type: 'chart', chartType: 'pie', title: 'Traffic Source Distribution', xAxis: 'source', yAxis: ['visitors'], dataSourceId: 'traffic' },
        { id: 'table1', type: 'table', title: 'Engagement Details', dataSourceId: 'traffic', columns: [
          { key: 'source', label: 'Source' },
          { key: 'bounce_rate', label: 'Bounce Rate', format: 'number' },
          { key: 'avg_session', label: 'Avg Session (s)', format: 'number' }
        ]}
      ]
    }
  ]
};

export const PROJECT_MGMT_TEMPLATE: DashboardSpec = {
  version: '1.0',
  meta: {
    title: 'Project Roadmap & Status',
    description: 'Monitor engineering velocity, tracking milestones, task completion states, and upcoming deadlines.',
    author: 'PMO'
  },
  theme: { mode: 'light', accent: '#8b5cf6', density: 'compact' },
  dataSources: [
    {
      id: 'tasks',
      type: 'inline',
      data: [
        { id: 1, title: 'Design System', status: 'Done', priority: 'High', date: '2024-01-10' },
        { id: 2, title: 'API Integration', status: 'In Progress', priority: 'High', date: '2024-01-15' },
        { id: 3, title: 'User Testing', status: 'Todo', priority: 'Medium', date: '2024-01-20' },
        { id: 4, title: 'Bug Fixes', status: 'Todo', priority: 'Low', date: '2024-01-22' }
      ]
    }
  ],
  sections: [
    {
      id: 'tasks_sec',
      title: 'Upcoming Milestones',
      layout: { columns: { base: 1, md: 2, lg: 2 }, gap: 6 },
      widgets: [
        { id: 'tm1', type: 'timeline', titleField: 'title', descriptionField: 'status', dateField: 'date', dataSourceId: 'tasks' },
        { id: 'tc1', type: 'chart', chartType: 'pie', title: 'Task Distribution', xAxis: 'status', yAxis: ['count'], dataSourceId: 'tasks', query: { groupBy: 'status', aggregate: { count: 'count' } } }
      ]
    }
  ]
};

export const SOCIAL_MEDIA_TEMPLATE: DashboardSpec = {
  version: '1.0',
  meta: {
    title: 'Social Media Engagement',
    description: 'Analyze social presence across platforms. Track reach, impressions, follower growth, and click-through rates.',
    author: 'Social Media Manager'
  },
  theme: { mode: 'light', accent: '#ec4899', density: 'cozy' },
  dataSources: [
    {
      id: 'social_metrics',
      type: 'inline',
      data: [
        { platform: 'Twitter', reach: 15000, impressions: 45000, clicks: 1200, followers: 8500 },
        { platform: 'LinkedIn', reach: 8000, impressions: 22000, clicks: 950, followers: 3200 },
        { platform: 'Instagram', reach: 25000, impressions: 85000, clicks: 3100, followers: 12000 },
        { platform: 'TikTok', reach: 45000, impressions: 120000, clicks: 5400, followers: 15000 }
      ]
    }
  ],
  sections: [
    {
      id: 'top_kpis',
      layout: { columns: { base: 1, md: 4, lg: 4 }, gap: 4 },
      widgets: [
        { id: 'k1', type: 'kpi', title: 'Total Reach', field: 'reach', dataSourceId: 'social_metrics', query: { aggregate: { reach: 'sum' } } },
        { id: 'k2', type: 'kpi', title: 'Impressions', field: 'impressions', dataSourceId: 'social_metrics', query: { aggregate: { impressions: 'sum' } } },
        { id: 'k3', type: 'kpi', title: 'Total Clicks', field: 'clicks', dataSourceId: 'social_metrics', query: { aggregate: { clicks: 'sum' } } },
        { id: 'k4', type: 'kpi', title: 'Followers', field: 'followers', dataSourceId: 'social_metrics', query: { aggregate: { followers: 'sum' } } }
      ]
    },
    {
      id: 'breakdown',
      title: 'Platform Breakdown',
      layout: { columns: { base: 1, md: 2, lg: 2 }, gap: 6 },
      widgets: [
        { id: 'c1', type: 'chart', chartType: 'bar', title: 'Reach by Platform', xAxis: 'platform', yAxis: ['reach'], dataSourceId: 'social_metrics' },
        { id: 'c2', type: 'chart', chartType: 'pie', title: 'Impression Share', xAxis: 'platform', yAxis: ['impressions'], dataSourceId: 'social_metrics' }
      ]
    }
  ]
};

export const SUPPORT_OPS_TEMPLATE: DashboardSpec = {
  version: '1.0',
  meta: {
    title: 'Support Operations Control',
    description: 'Monitor support ticket lifecycle, agent performance, and customer satisfaction (CSAT) trends.',
    author: 'Support Lead'
  },
  theme: { mode: 'light', accent: '#ef4444', density: 'cozy' },
  dataSources: [
    {
      id: 'tickets',
      type: 'inline',
      data: [
        { category: 'Billing', count: 45, avg_time: 120, csat: 4.2 },
        { category: 'Technical', count: 82, avg_time: 240, csat: 3.8 },
        { category: 'Account', count: 31, avg_time: 90, csat: 4.5 },
        { category: 'Feedback', count: 12, avg_time: 45, csat: 4.9 }
      ]
    }
  ],
  sections: [
    {
      id: 'overview',
      layout: { columns: { base: 1, md: 3, lg: 3 }, gap: 4 },
      widgets: [
        { id: 'k1', type: 'kpi', title: 'Open Tickets', field: 'count', dataSourceId: 'tickets', query: { aggregate: { count: 'sum' } } },
        { id: 'k2', type: 'kpi', title: 'Avg Resolution (min)', field: 'avg_time', dataSourceId: 'tickets', query: { aggregate: { avg_time: 'avg' } } },
        { id: 'k3', type: 'kpi', title: 'CSAT Score', field: 'csat', dataSourceId: 'tickets', query: { aggregate: { csat: 'avg' } }, precision: 1, suffix: '/ 5.0' }
      ]
    },
    {
      id: 'visuals',
      layout: { columns: { base: 1, md: 2, lg: 2 }, gap: 6 },
      widgets: [
        { id: 'c1', type: 'chart', chartType: 'bar', title: 'Tickets by Category', xAxis: 'category', yAxis: ['count'], dataSourceId: 'tickets' },
        { id: 'c2', type: 'chart', chartType: 'pie', title: 'CSAT Distribution', xAxis: 'category', yAxis: ['csat'], dataSourceId: 'tickets' }
      ]
    }
  ]
};

export const SAAS_METRICS_TEMPLATE: DashboardSpec = {
  version: '1.0',
  meta: {
    title: 'SaaS Business Health',
    description: 'Track the vital signs of a SaaS business: MRR, Churn rate, LTV, and Active User engagement trends.',
    author: 'Product Management'
  },
  theme: { mode: 'light', accent: '#10b981', density: 'comfortable' },
  dataSources: [
    {
      id: 'metrics',
      type: 'inline',
      data: [
        { date: '2023-Q1', mrr: 120000, churn: 2.1, dau: 4500 },
        { date: '2023-Q2', mrr: 145000, churn: 1.8, dau: 5200 },
        { date: '2023-Q3', mrr: 168000, churn: 1.9, dau: 6100 },
        { date: '2023-Q4', mrr: 195000, churn: 1.5, dau: 7800 }
      ]
    }
  ],
  sections: [
    {
      id: 'kpi_row',
      layout: { columns: { base: 1, md: 3, lg: 3 }, gap: 4 },
      widgets: [
        { id: 'm1', type: 'kpi', title: 'Annual Run Rate', field: 'mrr', dataSourceId: 'metrics', query: { orderBy: 'date', order: 'desc', limit: 1 }, prefix: '$', precision: 0 },
        { id: 'm2', type: 'kpi', title: 'Latest Churn', field: 'churn', dataSourceId: 'metrics', query: { orderBy: 'date', order: 'desc', limit: 1 }, suffix: '%' },
        { id: 'm3', type: 'kpi', title: 'Active Users (DAU)', field: 'dau', dataSourceId: 'metrics', query: { orderBy: 'date', order: 'desc', limit: 1 } }
      ]
    },
    {
      id: 'charts',
      layout: { columns: { base: 1, md: 1, lg: 1 }, gap: 6 },
      widgets: [
        { id: 'gc1', type: 'chart', chartType: 'area', title: 'MRR Growth Trend', xAxis: 'date', yAxis: ['mrr'], dataSourceId: 'metrics' }
      ]
    }
  ]
};

export const TEMPLATES = [
  { id: 'sales', title: 'Sales Performance', description: 'Comprehensive revenue tracking and conversion analysis.', spec: SALES_TEMPLATE, icon: '💰', category: 'Sales' },
  { id: 'traffic', title: 'Web Traffic', description: 'Visitor behavior analytics and engagement sources.', spec: WEB_TRAFFIC_TEMPLATE, icon: '🌐', category: 'Marketing' },
  { id: 'social', title: 'Social Media', description: 'Reach, impressions, and follower engagement metrics.', spec: SOCIAL_MEDIA_TEMPLATE, icon: '📱', category: 'Marketing' },
  { id: 'pm', title: 'Project Status', description: 'Timeline tracking and engineering velocity.', spec: PROJECT_MGMT_TEMPLATE, icon: '📅', category: 'Operations' },
  { id: 'support', title: 'Support Ops', description: 'Ticket volume and customer satisfaction monitoring.', spec: SUPPORT_OPS_TEMPLATE, icon: '🎧', category: 'Operations' },
  { id: 'saas', title: 'SaaS Metrics', description: 'MRR growth, churn, and active user trends.', spec: SAAS_METRICS_TEMPLATE, icon: '📈', category: 'Product' }
];
