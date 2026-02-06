
import { DashboardSpec } from '../types';

export const SALES_TEMPLATE: DashboardSpec = {
  version: '1.0',
  meta: {
    title: 'Global Sales Performance',
    description: 'Executive overview of global revenue streams, product performance, and regional sales vs targets. Features interactive filtering and trend analysis.',
    author: 'Sales Operations'
  },
  theme: { mode: 'light', accent: '#2563eb', density: 'cozy' },
  dataSources: [
    {
      id: 'monthly_sales',
      type: 'inline',
      data: [
        { month: 'Jan', revenue: 4200, target: 4000, leads: 120, region: 'North' },
        { month: 'Feb', revenue: 3800, target: 4000, leads: 110, region: 'South' },
        { month: 'Mar', revenue: 5100, target: 4500, leads: 150, region: 'East' },
        { month: 'Apr', revenue: 4900, target: 4500, leads: 140, region: 'West' },
        { month: 'May', revenue: 6200, target: 5000, leads: 190, region: 'North' },
        { month: 'Jun', revenue: 6800, target: 5500, leads: 210, region: 'South' },
        { month: 'Jul', revenue: 7100, target: 6000, leads: 240, region: 'East' }
      ]
    },
    {
      id: 'product_sales',
      type: 'inline',
      data: [
        { product: 'Enterprise License', amount: 125000, deals: 45, growth: 12 },
        { product: 'Pro Plan', amount: 84000, deals: 210, growth: 8 },
        { product: 'Starter Pack', amount: 32000, deals: 540, growth: -2 },
        { product: 'Consulting', amount: 45000, deals: 12, growth: 15 }
      ]
    }
  ],
  filters: [
    { id: 'region_filter', type: 'multi-select', label: 'Filter Region', dataSourceId: 'monthly_sales', field: 'region', options: [
      {label: 'North', value: 'North'}, {label: 'South', value: 'South'}, {label: 'East', value: 'East'}, {label: 'West', value: 'West'}
    ]}
  ],
  sections: [
    {
      id: 'summary',
      layout: { columns: { base: 1, md: 3, lg: 3 }, gap: 4 },
      widgets: [
        { id: 'k1', type: 'kpi', title: 'Total Revenue', field: 'revenue', dataSourceId: 'monthly_sales', query: { aggregate: { revenue: 'sum' } }, prefix: '$' },
        { id: 'k2', type: 'kpi', title: 'Sales Pipeline Leads', field: 'leads', dataSourceId: 'monthly_sales', query: { aggregate: { leads: 'sum' } } },
        { id: 'k3', type: 'kpi', title: 'Avg Deal Size', field: 'amount', dataSourceId: 'product_sales', query: { aggregate: { amount: 'avg' } }, prefix: '$', precision: 0 }
      ]
    },
    {
      id: 'main_charts',
      title: 'Revenue Trends',
      layout: { columns: { base: 1, md: 1, lg: 2 }, gap: 6 },
      widgets: [
        { id: 'c1', type: 'chart', chartType: 'area', title: 'Revenue vs Target', xAxis: 'month', yAxis: ['revenue', 'target'], dataSourceId: 'monthly_sales', colors: ['#2563eb', '#93c5fd'] },
        { id: 'c2', type: 'chart', chartType: 'bar', title: 'Leads Generated', xAxis: 'month', yAxis: ['leads'], dataSourceId: 'monthly_sales', accent: '#8b5cf6' }
      ]
    },
    {
      id: 'products',
      title: 'Product Performance',
      layout: { columns: { base: 1, md: 1, lg: 2 }, gap: 6 },
      widgets: [
        { id: 'c3', type: 'chart', chartType: 'pie', title: 'Revenue Mix', xAxis: 'product', yAxis: ['amount'], dataSourceId: 'product_sales' },
        { id: 't1', type: 'table', title: 'Product Breakdown', dataSourceId: 'product_sales', columns: [
          { key: 'product', label: 'Product Name' },
          { key: 'amount', label: 'Revenue', format: 'currency' },
          { key: 'deals', label: 'Deals Closed', format: 'number' },
          { key: 'growth', label: 'YoY Growth %', format: 'number' }
        ]}
      ]
    }
  ]
};

export const WEB_TRAFFIC_TEMPLATE: DashboardSpec = {
  version: '1.0',
  meta: {
    title: 'Website Analytics Pro',
    description: 'Deep dive into visitor traffic, session trends, device usage, and engagement sources.',
    author: 'Marketing Team'
  },
  theme: { mode: 'light', accent: '#f59e0b', density: 'comfortable' },
  dataSources: [
    {
      id: 'traffic_sources',
      type: 'inline',
      data: [
        { source: 'Direct', visitors: 1200, bounce: 45 },
        { source: 'Social', visitors: 850, bounce: 60 },
        { source: 'Organic Search', visitors: 2400, bounce: 30 },
        { source: 'Paid Search', visitors: 1100, bounce: 35 },
        { source: 'Referral', visitors: 400, bounce: 40 }
      ]
    },
    {
      id: 'daily_stats',
      type: 'inline',
      data: [
        { date: 'Mon', sessions: 450, users: 380 },
        { date: 'Tue', sessions: 520, users: 410 },
        { date: 'Wed', sessions: 580, users: 490 },
        { date: 'Thu', sessions: 540, users: 450 },
        { date: 'Fri', sessions: 610, users: 520 },
        { date: 'Sat', sessions: 320, users: 280 },
        { date: 'Sun', sessions: 350, users: 290 }
      ]
    },
    {
      id: 'devices',
      type: 'inline',
      data: [
        { device: 'Desktop', percentage: 55 },
        { device: 'Mobile', percentage: 35 },
        { device: 'Tablet', percentage: 10 }
      ]
    }
  ],
  sections: [
    {
      id: 'overview',
      layout: { columns: { base: 1, md: 4, lg: 4 }, gap: 4 },
      widgets: [
        { id: 'k1', type: 'kpi', title: 'Total Users', field: 'users', dataSourceId: 'daily_stats', query: { aggregate: { users: 'sum' } } },
        { id: 'k2', type: 'kpi', title: 'Total Sessions', field: 'sessions', dataSourceId: 'daily_stats', query: { aggregate: { sessions: 'sum' } } },
        { id: 'k3', type: 'kpi', title: 'Avg Bounce Rate', field: 'bounce', dataSourceId: 'traffic_sources', query: { aggregate: { bounce: 'avg' } }, suffix: '%' },
        { id: 'k4', type: 'kpi', title: 'Top Source', field: 'visitors', dataSourceId: 'traffic_sources', query: { orderBy: 'visitors', order: 'desc', limit: 1 }, prefix: 'Vol: ' }
      ]
    },
    {
      id: 'charts',
      layout: { columns: { base: 1, md: 2, lg: 2 }, gap: 6 },
      widgets: [
        { id: 'c1', type: 'chart', chartType: 'line', title: 'Weekly Traffic Trend', xAxis: 'date', yAxis: ['sessions', 'users'], dataSourceId: 'daily_stats' },
        { id: 'c2', type: 'chart', chartType: 'bar', title: 'Traffic by Source', xAxis: 'source', yAxis: ['visitors'], dataSourceId: 'traffic_sources' }
      ]
    },
    {
      id: 'details',
      layout: { columns: { base: 1, md: 3, lg: 3 }, gap: 6 },
      widgets: [
        { id: 'c3', type: 'chart', chartType: 'pie', title: 'Device Breakdown', xAxis: 'device', yAxis: ['percentage'], dataSourceId: 'devices' },
        { id: 't1', type: 'table', title: 'Source Performance', dataSourceId: 'traffic_sources', columns: [
          { key: 'source', label: 'Channel' },
          { key: 'visitors', label: 'Visitors', format: 'number' },
          { key: 'bounce', label: 'Bounce Rate %', format: 'number' }
        ]}
      ]
    }
  ]
};

export const PROJECT_MGMT_TEMPLATE: DashboardSpec = {
  version: '1.0',
  meta: {
    title: 'Agile Project Board',
    description: 'Track sprint velocity, task distribution, and upcoming milestones for engineering teams.',
    author: 'PMO'
  },
  theme: { mode: 'light', accent: '#8b5cf6', density: 'compact' },
  dataSources: [
    {
      id: 'milestones',
      type: 'inline',
      data: [
        { id: 1, title: 'Beta Release', status: 'On Track', date: '2024-03-15' },
        { id: 2, title: 'Security Audit', status: 'Pending', date: '2024-03-20' },
        { id: 3, title: 'Public Launch', status: 'Planning', date: '2024-04-01' }
      ]
    },
    {
      id: 'tasks',
      type: 'inline',
      data: [
        { status: 'Backlog', count: 12 },
        { status: 'Todo', count: 8 },
        { status: 'In Progress', count: 5 },
        { status: 'Review', count: 3 },
        { status: 'Done', count: 15 }
      ]
    },
    {
      id: 'velocity',
      type: 'inline',
      data: [
        { sprint: 'S1', points: 28 },
        { sprint: 'S2', points: 32 },
        { sprint: 'S3', points: 30 },
        { sprint: 'S4', points: 35 },
        { sprint: 'S5', points: 42 }
      ]
    }
  ],
  sections: [
    {
      id: 'header',
      layout: { columns: { base: 1, md: 1, lg: 1 }, gap: 4 },
      widgets: [
        { id: 'txt1', type: 'text', variant: 'h2', content: 'Engineering Sprint Dashboard' }
      ]
    },
    {
      id: 'kpis',
      layout: { columns: { base: 1, md: 3, lg: 3 }, gap: 4 },
      widgets: [
        { id: 'k1', type: 'kpi', title: 'Completed Tasks', field: 'count', dataSourceId: 'tasks', query: { where: { status: 'Done' } } },
        { id: 'k2', type: 'kpi', title: 'Active Tasks', field: 'count', dataSourceId: 'tasks', query: { where: { status: 'In Progress' } } },
        { id: 'k3', type: 'kpi', title: 'Current Velocity', field: 'points', dataSourceId: 'velocity', query: { orderBy: 'sprint', order: 'desc', limit: 1 }, suffix: ' pts' }
      ]
    },
    {
      id: 'charts',
      layout: { columns: { base: 1, md: 2, lg: 2 }, gap: 6 },
      widgets: [
        { id: 'c1', type: 'chart', chartType: 'bar', title: 'Sprint Velocity History', xAxis: 'sprint', yAxis: ['points'], dataSourceId: 'velocity' },
        { id: 'c2', type: 'chart', chartType: 'pie', title: 'Task Status Distribution', xAxis: 'status', yAxis: ['count'], dataSourceId: 'tasks' }
      ]
    },
    {
      id: 'timeline',
      title: 'Roadmap',
      layout: { columns: { base: 1, md: 1, lg: 1 }, gap: 0 },
      widgets: [
        { id: 'tl1', type: 'timeline', titleField: 'title', descriptionField: 'status', dateField: 'date', dataSourceId: 'milestones' }
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

export const INVENTORY_TEMPLATE: DashboardSpec = {
  version: '1.0',
  meta: {
    title: 'Inventory & Logistics',
    description: 'Monitor warehouse stock levels, track low inventory alerts, and analyze category distribution.',
    author: 'Operations'
  },
  theme: { mode: 'light', accent: '#f97316', density: 'compact' },
  dataSources: [
    {
      id: 'inventory',
      type: 'inline',
      data: [
        { item: 'Laptop Pro', category: 'Electronics', stock: 15, reorder: 20, value: 15000 },
        { item: 'Desk Chair', category: 'Furniture', stock: 120, reorder: 50, value: 12000 },
        { item: 'Monitor 27"', category: 'Electronics', stock: 45, reorder: 30, value: 9000 },
        { item: 'Keyboard', category: 'Accessories', stock: 200, reorder: 100, value: 4000 },
        { item: 'Mouse', category: 'Accessories', stock: 180, reorder: 100, value: 3600 }
      ]
    },
    {
      id: 'movements',
      type: 'inline',
      data: [
        { date: 'Mon', inbound: 50, outbound: 35 },
        { date: 'Tue', inbound: 20, outbound: 45 },
        { date: 'Wed', inbound: 40, outbound: 60 },
        { date: 'Thu', inbound: 65, outbound: 40 },
        { date: 'Fri', inbound: 30, outbound: 55 }
      ]
    }
  ],
  sections: [
    {
      id: 'kpis',
      layout: { columns: { base: 1, md: 3, lg: 3 }, gap: 4 },
      widgets: [
        { id: 'k1', type: 'kpi', title: 'Total Stock Value', field: 'value', dataSourceId: 'inventory', query: { aggregate: { value: 'sum' } }, prefix: '$' },
        { id: 'k2', type: 'kpi', title: 'Low Stock Items', field: 'item', dataSourceId: 'inventory', query: { where: { category: 'Electronics' }, aggregate: { item: 'count' } } }, 
        { id: 'k3', type: 'kpi', title: 'Total Items', field: 'stock', dataSourceId: 'inventory', query: { aggregate: { stock: 'sum' } } }
      ]
    },
    {
      id: 'charts',
      layout: { columns: { base: 1, md: 2, lg: 2 }, gap: 6 },
      widgets: [
        { id: 'c1', type: 'chart', chartType: 'bar', title: 'Stock by Category', xAxis: 'category', yAxis: ['stock'], dataSourceId: 'inventory', query: { groupBy: 'category', aggregate: { stock: 'sum' } } },
        { id: 'c2', type: 'chart', chartType: 'line', title: 'Weekly Movement', xAxis: 'date', yAxis: ['inbound', 'outbound'], dataSourceId: 'movements' }
      ]
    }
  ]
};

export const CAMPAIGN_TEMPLATE: DashboardSpec = {
  version: '1.0',
  meta: {
    title: 'Marketing Campaigns',
    description: 'Track campaign ROI, click-through rates, and conversion costs across active marketing channels.',
    author: 'Marketing'
  },
  theme: { mode: 'dark', accent: '#d946ef', density: 'cozy' },
  dataSources: [
    {
      id: 'campaigns',
      type: 'inline',
      data: [
        { name: 'Summer Sale', channel: 'Email', spend: 5000, revenue: 25000, clicks: 1200 },
        { name: 'Tech Launch', channel: 'Social', spend: 12000, revenue: 18000, clicks: 4500 },
        { name: 'Brand Awareness', channel: 'Display', spend: 8000, revenue: 4000, clicks: 8000 },
        { name: 'Retargeting', channel: 'Social', spend: 3000, revenue: 15000, clicks: 900 }
      ]
    }
  ],
  sections: [
    {
      id: 'summary',
      layout: { columns: { base: 1, md: 3, lg: 3 }, gap: 4 },
      widgets: [
        { id: 'k1', type: 'kpi', title: 'Total Spend', field: 'spend', dataSourceId: 'campaigns', query: { aggregate: { spend: 'sum' } }, prefix: '$' },
        { id: 'k2', type: 'kpi', title: 'Total Revenue', field: 'revenue', dataSourceId: 'campaigns', query: { aggregate: { revenue: 'sum' } }, prefix: '$' },
        { id: 'k3', type: 'kpi', title: 'Total Clicks', field: 'clicks', dataSourceId: 'campaigns', query: { aggregate: { clicks: 'sum' } } }
      ]
    },
    {
      id: 'details',
      layout: { columns: { base: 1, md: 2, lg: 2 }, gap: 6 },
      widgets: [
        { id: 'c1', type: 'chart', chartType: 'bar', title: 'ROI by Campaign', xAxis: 'name', yAxis: ['revenue', 'spend'], dataSourceId: 'campaigns' },
        { id: 't1', type: 'table', title: 'Campaign Data', dataSourceId: 'campaigns', columns: [{ key: 'name', label: 'Campaign' }, { key: 'channel', label: 'Channel' }, { key: 'revenue', label: 'Revenue', format: 'currency' }] }
      ]
    }
  ]
};

export const SERVER_HEALTH_TEMPLATE: DashboardSpec = {
  version: '1.0',
  meta: {
    title: 'Server Health Monitor',
    description: 'Real-time monitoring of system resources, response times, and error rates for infrastructure.',
    author: 'DevOps'
  },
  theme: { mode: 'dark', accent: '#22c55e', density: 'compact' },
  dataSources: [
    {
      id: 'servers',
      type: 'inline',
      data: [
        { host: 'web-01', cpu: 45, memory: 60, status: 'Healthy' },
        { host: 'web-02', cpu: 55, memory: 65, status: 'Healthy' },
        { host: 'db-01', cpu: 85, memory: 90, status: 'Warning' },
        { host: 'cache-01', cpu: 15, memory: 40, status: 'Healthy' }
      ]
    },
    {
      id: 'metrics',
      type: 'inline',
      data: [
        { time: '10:00', requests: 1200, errors: 5 },
        { time: '10:05', requests: 1450, errors: 8 },
        { time: '10:10', requests: 1800, errors: 12 },
        { time: '10:15', requests: 1600, errors: 4 },
        { time: '10:20', requests: 1350, errors: 6 }
      ]
    }
  ],
  sections: [
    {
      id: 'alerts',
      layout: { columns: { base: 1, md: 1, lg: 1 }, gap: 4 },
      widgets: [
        { id: 'a1', type: 'alert', severity: 'warning', title: 'High Load on DB-01', message: 'Database server CPU usage exceeds 80% threshold.' }
      ]
    },
    {
      id: 'overview',
      layout: { columns: { base: 1, md: 3, lg: 3 }, gap: 4 },
      widgets: [
        { id: 'k1', type: 'kpi', title: 'Avg CPU Load', field: 'cpu', dataSourceId: 'servers', query: { aggregate: { cpu: 'avg' } }, suffix: '%' },
        { id: 'k2', type: 'kpi', title: 'Total Requests', field: 'requests', dataSourceId: 'metrics', query: { aggregate: { requests: 'sum' } } },
        { id: 'k3', type: 'kpi', title: 'Error Rate', field: 'errors', dataSourceId: 'metrics', query: { aggregate: { errors: 'avg' } }, precision: 1 }
      ]
    },
    {
      id: 'charts',
      layout: { columns: { base: 1, md: 2, lg: 2 }, gap: 6 },
      widgets: [
        { id: 'c1', type: 'chart', chartType: 'bar', title: 'Resource Usage by Host', xAxis: 'host', yAxis: ['cpu', 'memory'], dataSourceId: 'servers' },
        { id: 'c2', type: 'chart', chartType: 'line', title: 'Request Volume', xAxis: 'time', yAxis: ['requests'], dataSourceId: 'metrics', accent: '#22c55e' }
      ]
    }
  ]
};

export const TEMPLATES = [
  { id: 'sales', title: 'Sales Performance', description: 'Comprehensive revenue tracking and conversion analysis.', spec: SALES_TEMPLATE, icon: '💰', category: 'Sales' },
  { id: 'traffic', title: 'Web Traffic', description: 'Visitor behavior analytics and engagement sources.', spec: WEB_TRAFFIC_TEMPLATE, icon: '🌐', category: 'Marketing' },
  { id: 'social', title: 'Social Media', description: 'Reach, impressions, and follower engagement metrics.', spec: SOCIAL_MEDIA_TEMPLATE, icon: '📱', category: 'Marketing' },
  { id: 'campaign', title: 'Marketing Campaigns', description: 'Track ROI and performance across ad channels.', spec: CAMPAIGN_TEMPLATE, icon: '📣', category: 'Marketing' },
  { id: 'pm', title: 'Project Status', description: 'Timeline tracking and engineering velocity.', spec: PROJECT_MGMT_TEMPLATE, icon: '📅', category: 'Operations' },
  { id: 'inventory', title: 'Inventory Logic', description: 'Stock levels, warehouse movements and low stock alerts.', spec: INVENTORY_TEMPLATE, icon: '📦', category: 'Logistics' },
  { id: 'support', title: 'Support Ops', description: 'Ticket volume and customer satisfaction monitoring.', spec: SUPPORT_OPS_TEMPLATE, icon: '🎧', category: 'Operations' },
  { id: 'server', title: 'Server Health', description: 'Real-time infrastructure and resource monitoring.', spec: SERVER_HEALTH_TEMPLATE, icon: '🖥️', category: 'DevOps' },
  { id: 'saas', title: 'SaaS Metrics', description: 'MRR growth, churn, and active user trends.', spec: SAAS_METRICS_TEMPLATE, icon: '📈', category: 'Product' }
];
