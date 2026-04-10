
import React from 'react';
import { useDashboardStore } from '../store';
import { executeQuery } from '../dataEngine';
import { KPIWidget } from './Widgets/KPIWidget';
import { ChartWidget } from './Widgets/ChartWidget';
import { TableWidget } from './Widgets/TableWidget';
import { TimelineWidget } from './Widgets/TimelineWidget';
import { Widget } from '../types';

export const DashboardRenderer: React.FC = () => {
  const { spec, activeFilters, dataCache, isLoading, errors } = useDashboardStore();

  const getWidgetData = (widget: any) => {
    const data = dataCache[widget.dataSourceId] || [];
    return executeQuery(data, widget.query, activeFilters, spec.filters);
  };

  const renderWidget = (widget: Widget) => {
    if (isLoading) return <div key={widget.id} className="h-40 bg-slate-100 animate-pulse rounded-xl" />;
    
    const data = (widget as any).dataSourceId ? getWidgetData(widget) : [];

    switch (widget.type) {
      case 'kpi': return <KPIWidget key={widget.id} {...widget} data={data} />;
      case 'chart': return <ChartWidget key={widget.id} {...widget} data={data} accent={spec.theme.accent} />;
      case 'table': return <TableWidget key={widget.id} {...widget} data={data} />;
      case 'timeline': return <TimelineWidget key={widget.id} {...widget} data={data} />;
      case 'alert':
        const severityStyles = {
          info: 'bg-blue-50 text-blue-800 border-blue-200',
          warning: 'bg-amber-50 text-amber-800 border-amber-200',
          error: 'bg-red-50 text-red-800 border-red-200',
          success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        };
        return (
          <div key={widget.id} className={`p-4 rounded-lg border ${severityStyles[widget.severity]} mb-4 col-span-full`}>
            <div className="font-bold mb-1">{widget.title}</div>
            <p className="text-sm">{widget.message}</p>
          </div>
        );
      case 'divider': return <hr key={widget.id} className="my-6 border-slate-200 col-span-full" />;
      case 'text':
        const variantStyles = {
          h1: 'text-3xl font-bold text-slate-900',
          h2: 'text-2xl font-semibold text-slate-800',
          h3: 'text-xl font-medium text-slate-700',
          body: 'text-slate-600 leading-relaxed',
        };
        return <div key={widget.id} className={`${variantStyles[widget.variant || 'body']} col-span-full`}>{widget.content}</div>;
      default: return <div key={(widget as any).id}>Unsupported Widget</div>;
    }
  };

  const hasErrors = Object.keys(errors || {}).length > 0;

  return (
    <div className="dashboard-container space-y-16 pb-20">
      {hasErrors && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <h3 className="text-red-800 font-bold mb-2">Data Source Errors</h3>
          <ul className="list-disc pl-5 text-sm text-red-600">
            {Object.entries(errors).map(([id, msg]) => (
              <li key={id}><strong>{id}:</strong> {msg}</li>
            ))}
          </ul>
        </div>
      )}
      {spec.sections.map((section) => (
        <section key={section.id}>
          {(section.title || section.description) && (
            <div className="mb-8 border-l-4 border-slate-200 pl-4">
              {section.title && <h2 className="text-2xl font-bold text-slate-900">{section.title}</h2>}
              {section.description && <p className="text-slate-500 mt-1">{section.description}</p>}
            </div>
          )}
          <div 
            className="grid gap-6"
            style={{ 
                gridTemplateColumns: `repeat(${section.layout.columns.lg}, 1fr)`,
                gap: `${section.layout.gap * 4}px`
            }}
          >
            {section.widgets.map(widget => renderWidget(widget))}
          </div>
        </section>
      ))}
    </div>
  );
};
