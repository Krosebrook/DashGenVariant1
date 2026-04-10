
import { DashboardSpec } from '../types';

export const EXECUTIVE_DASHBOARD: DashboardSpec = {
  version: '1.0',
  meta: {
    title: 'Executive Financial Overview',
    description: 'Quarterly financial performance, sales pipeline, and key regional growth metrics.',
    author: 'Chief Data Officer',
  },
  theme: { mode: 'light', accent: '#3b82f6', density: 'cozy' },
  dataSources: [
    {
      id: 'revenue_data',
      type: 'inline',
      data: [
        { month: 'Jan', revenue: 45000, cost: 32000, region: 'North' },
        { month: 'Feb', revenue: 52000, cost: 34000, region: 'North' },
        { month: 'Mar', revenue: 61000, cost: 38000, region: 'South' },
        { month: 'Apr', revenue: 58000, cost: 36000, region: 'East' },
        { month: 'May', revenue: 72000, cost: 42000, region: 'West' },
        { month: 'Jun', revenue: 85000, cost: 48000, region: 'West' },
      ]
    },
    {
        id: 'kpis',
        type: 'inline',
        data: [
            { id: 1, metric: 'Total Revenue', value: 373000, trend: 12.5 },
            { id: 2, metric: 'Active Customers', value: 1240, trend: 4.2 },
            { id: 3, metric: 'Burn Rate', value: 21000, trend: -2.1 },
        ]
    },
    {
      id: 'transactions',
      type: 'inline',
      data: [
        { date: '2023-10-01', client: 'Acme Corp', amount: 12500, status: 'Completed' },
        { date: '2023-10-02', client: 'Globex Inc', amount: 8400, status: 'Pending' },
        { date: '2023-10-05', client: 'Stark Ind', amount: 45000, status: 'Completed' },
        { date: '2023-10-07', client: 'Wayne Ent', amount: 3200, status: 'Failed' },
        { date: '2023-10-10', client: 'Umbrella Co', amount: 15600, status: 'Completed' },
      ]
    }
  ],
  filters: [
    {
      id: 'region_filter',
      type: 'multi-select',
      label: 'Regional Focus',
      dataSourceId: 'revenue_data',
      field: 'region',
      options: [
        { label: 'North', value: 'North' },
        { label: 'South', value: 'South' },
        { label: 'East', value: 'East' },
        { label: 'West', value: 'West' },
      ]
    }
  ],
  sections: [
    {
      id: 'sec_1',
      title: 'Performance Snapshot',
      layout: { columns: { base: 1, md: 3, lg: 3 }, gap: 4 },
      widgets: [
        { id: 'kpi_1', type: 'kpi', precision: 0, title: 'Gross Revenue', dataSourceId: 'kpis', field: 'value', query: { where: { metric: 'Total Revenue' } }, prefix: '$' },
        { id: 'kpi_2', type: 'kpi', precision: 0, title: 'Customers', dataSourceId: 'kpis', field: 'value', query: { where: { metric: 'Active Customers' } } },
        { id: 'kpi_3', type: 'kpi', precision: 0, title: 'Monthly Burn', dataSourceId: 'kpis', field: 'value', query: { where: { metric: 'Burn Rate' } }, prefix: '$' },
      ]
    },
    {
      id: 'sec_2',
      title: 'Growth Trends',
      layout: { columns: { base: 1, md: 1, lg: 2 }, gap: 6 },
      widgets: [
        { id: 'chart_1', type: 'chart', chartType: 'area', title: 'Revenue vs Cost', xAxis: 'month', yAxis: ['revenue', 'cost'], dataSourceId: 'revenue_data' },
        { id: 'table_1', type: 'table', pageSize: 10, title: 'Recent Large Transactions', dataSourceId: 'transactions', columns: [
            { key: 'client', label: 'Client Name' },
            { key: 'amount', label: 'Amount', format: 'currency' },
            { key: 'status', label: 'Status' }
        ] }
      ]
    }
  ]
};

export const SUPPORT_DASHBOARD: DashboardSpec = {
    version: '1.0',
    meta: { title: 'IT Operations & Support', description: 'Real-time ticket monitoring and SLA tracking.' },
    theme: { mode: 'light', accent: '#3b82f6', density: 'comfortable' },
    dataSources: [
        {
            id: 'tickets',
            type: 'inline',
            data: [
                { id: 'T-101', priority: 'High', status: 'Open', category: 'Hardware', agent: 'Alice' },
                { id: 'T-102', priority: 'Low', status: 'Closed', category: 'Software', agent: 'Bob' },
                { id: 'T-103', priority: 'Medium', status: 'Open', category: 'Network', agent: 'Charlie' },
                { id: 'T-104', priority: 'High', status: 'In Progress', category: 'Access', agent: 'Alice' },
            ]
    }
  ],
  filters: [],
  sections: [
        {
            id: 'alerts',
            layout: { columns: { base: 1, md: 1, lg: 1 }, gap: 2 },
            widgets: [
                { id: 'a1', type: 'alert', severity: 'warning', title: 'Network Outage', message: 'Region US-EAST-1 is experiencing intermittent connectivity issues.' }
            ]
        },
        {
            id: 'main',
            layout: { columns: { base: 1, md: 2, lg: 2 }, gap: 4 },
            widgets: [
                { id: 'c1', type: 'chart', chartType: 'pie', title: 'Tickets by Priority', xAxis: 'priority', yAxis: ['count'], dataSourceId: 'tickets', query: { groupBy: 'priority', aggregate: { count: 'count' } } },
                { id: 't1', type: 'table', pageSize: 10, title: 'Pending Support Queue', dataSourceId: 'tickets', columns: [{ key: 'id', label: 'ID' }, { key: 'priority', label: 'Priority' }, { key: 'agent', label: 'Assigned Agent' }] }
            ]
        }
    ]
};

export const HABIT_DASHBOARD: DashboardSpec = {
    version: '1.0',
    meta: { title: 'Personal Habit Tracker', description: 'Daily progress monitoring.' },
    theme: { mode: 'light', accent: '#3b82f6', density: 'compact' },
    dataSources: [
        {
            id: 'habits',
            type: 'inline',
            data: [
                { date: '2023-11-01', task: 'Morning Run', completed: true },
                { date: '2023-11-01', task: 'Meditation', completed: true },
                { date: '2023-11-02', task: 'Morning Run', completed: false },
                { date: '2023-11-02', task: 'Reading', completed: true },
            ]
    }
  ],
  filters: [],
  sections: [
        {
            id: 'h1',
            layout: { columns: { base: 1, md: 1, lg: 1 }, gap: 4 },
            widgets: [
                { id: 'timeline_1', type: 'timeline', titleField: 'task', descriptionField: 'completed', dateField: 'date', dataSourceId: 'habits' }
            ]
        }
    ]
};

export const MONGODB_DEMO_DASHBOARD: DashboardSpec = {
  version: '1.0',
  meta: {
    title: 'MongoDB Analytics Demo',
    description: 'Real-time data from a MongoDB collection.',
    author: 'Data Engineer'
  },
  theme: { mode: 'dark', accent: '#10b981', density: 'cozy' },
  dataSources: [
    {
      id: 'mongo_users',
      type: 'mongodb',
      connectionString: 'mongodb://localhost:27017/test',
      collection: 'users',
      query: '{"active": true}'
    }
  ],
  filters: [],
  sections: [
    {
      id: 'main',
      layout: { columns: { base: 1, md: 2, lg: 2 }, gap: 6 },
      widgets: [
        { id: 'k1', type: 'kpi', precision: 0, title: 'Active Users', field: 'name', dataSourceId: 'mongo_users', query: { aggregate: { name: 'count' } } },
        { id: 't1', type: 'table', pageSize: 5, title: 'User List', dataSourceId: 'mongo_users', columns: [{ key: 'name', label: 'Name' }, { key: 'email', label: 'Email' }] }
      ]
    }
  ]
};
