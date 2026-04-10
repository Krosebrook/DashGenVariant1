
import { z } from 'zod';

export const DataSourceSchema = z.discriminatedUnion('type', [
  z.object({
    id: z.string(),
    type: z.literal('inline'),
    data: z.array(z.record(z.string(), z.any())),
  }),
  z.object({
    id: z.string(),
    type: z.literal('api'),
    url: z.string().url(),
  }),
  z.object({
    id: z.string(),
    type: z.literal('csv'),
    url: z.string().optional(),
    content: z.string().optional(),
  }),
  z.object({
    id: z.string(),
    type: z.literal('postgres'),
    connectionString: z.string(),
    query: z.string(),
  }),
  z.object({
    id: z.string(),
    type: z.literal('mongodb'),
    connectionString: z.string(),
    collection: z.string(),
    query: z.string().optional(), // JSON string for the query
  }),
]);

export const QuerySchema = z.object({
  select: z.array(z.string()).optional(),
  where: z.record(z.string(), z.any()).optional(),
  groupBy: z.string().optional(),
  aggregate: z.record(z.string(), z.enum(['sum', 'avg', 'count', 'min', 'max'])).optional(),
  orderBy: z.string().optional(),
  order: z.enum(['asc', 'desc']).optional(),
  limit: z.number().optional(),
});

export const BaseWidgetSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
  dataSourceId: z.string(),
  query: QuerySchema.optional(),
});

export const KPIWidgetSchema = BaseWidgetSchema.extend({
  type: z.literal('kpi'),
  field: z.string(),
  label: z.string().optional(),
  suffix: z.string().optional(),
  prefix: z.string().optional(),
  trendField: z.string().optional(),
  precision: z.number().optional().default(0),
});

export const ChartWidgetSchema = BaseWidgetSchema.extend({
  type: z.literal('chart'),
  chartType: z.enum(['line', 'bar', 'area', 'pie', 'scatter']),
  xAxis: z.string(),
  yAxis: z.array(z.string()),
  xAxisLabel: z.string().optional(),
  yAxisLabel: z.string().optional(),
  colors: z.array(z.string()).optional(),
  stacked: z.boolean().optional(),
});

export const TableWidgetSchema = BaseWidgetSchema.extend({
  type: z.literal('table'),
  columns: z.array(z.object({
    key: z.string(),
    label: z.string(),
    format: z.enum(['text', 'number', 'currency', 'date']).optional(),
  })),
  pageSize: z.number().optional().default(10),
});

export const TextWidgetSchema = BaseWidgetSchema.omit({ dataSourceId: true, query: true }).extend({
  type: z.literal('text'),
  content: z.string(),
  variant: z.enum(['body', 'h1', 'h2', 'h3']).optional(),
});

export const TimelineWidgetSchema = BaseWidgetSchema.extend({
  type: z.literal('timeline'),
  titleField: z.string(),
  descriptionField: z.string(),
  dateField: z.string(),
});

export const AlertWidgetSchema = z.object({
  id: z.string(),
  type: z.literal('alert'),
  title: z.string(),
  message: z.string(),
  severity: z.enum(['info', 'warning', 'error', 'success']),
});

export const WidgetSchema = z.discriminatedUnion('type', [
  KPIWidgetSchema,
  ChartWidgetSchema,
  TableWidgetSchema,
  TextWidgetSchema,
  AlertWidgetSchema,
  TimelineWidgetSchema,
  z.object({ id: z.string(), type: z.literal('divider') }),
]);

export const FilterSchema = z.object({
  id: z.string(),
  type: z.enum(['date', 'multi-select', 'single-select', 'search']),
  label: z.string(),
  dataSourceId: z.string(),
  field: z.string(),
  defaultValue: z.any().optional(),
  options: z.array(z.object({ label: z.string(), value: z.any() })).optional(),
});

export const DashboardSpecSchema = z.object({
  version: z.literal('1.0'),
  meta: z.object({
    title: z.string(),
    description: z.string().optional(),
    author: z.string().optional(),
  }),
  theme: z.object({
    mode: z.enum(['light', 'dark', 'system']).default('light'),
    accent: z.string().default('#3b82f6'),
    density: z.enum(['compact', 'cozy', 'comfortable']).default('cozy'),
  }),
  dataSources: z.array(DataSourceSchema),
  filters: z.array(FilterSchema).optional().default([]),
  sections: z.array(z.object({
    id: z.string(),
    title: z.string().optional(),
    description: z.string().optional(),
    layout: z.object({
      columns: z.object({
        base: z.number().default(1),
        md: z.number().default(2),
        lg: z.number().default(3),
      }),
      gap: z.number().default(4),
    }),
    widgets: z.array(WidgetSchema),
  })),
});

export type DashboardSpec = z.infer<typeof DashboardSpecSchema>;
export type Widget = z.infer<typeof WidgetSchema>;
export type DataSource = z.infer<typeof DataSourceSchema>;
export type Filter = z.infer<typeof FilterSchema>;
export type Query = z.infer<typeof QuerySchema>;
