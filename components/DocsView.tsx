
import React from 'react';

export const DocsView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-10 px-6 bg-white rounded-3xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="prose prose-slate max-w-none">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-4">Documentation Guide</h1>
        <p className="text-slate-500 text-lg mb-10">Master the art of schema-driven dashboards.</p>

        <section className="mb-12">
          <h2 className="text-xl font-bold text-slate-900 border-b pb-2 mb-4">Getting Started</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <h3 className="font-bold text-blue-600 mb-2">1. Define Data</h3>
              <p className="text-xs text-slate-500 leading-relaxed">Add your datasets to the <code>dataSources</code> array. Support for JSON, CSV, and REST APIs is built-in.</p>
            </div>
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <h3 className="font-bold text-blue-600 mb-2">2. Build Sections</h3>
              <p className="text-xs text-slate-500 leading-relaxed">Organize your dashboard into <code>sections</code>. Each section can have its own grid layout.</p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-bold text-slate-900 border-b pb-2 mb-4">Widget Types</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 border rounded-xl hover:bg-slate-50 transition-colors">
              <span className="text-2xl">📈</span>
              <div>
                <h4 className="font-bold text-sm">Chart Widget</h4>
                <p className="text-xs text-slate-500">Supports Line, Bar, Area, and Pie charts using the Recharts engine.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 border rounded-xl hover:bg-slate-50 transition-colors">
              <span className="text-2xl">💎</span>
              <div>
                <h4 className="font-bold text-sm">KPI Widget</h4>
                <p className="text-xs text-slate-500">Highlights high-level metrics with support for prefixes, suffixes, and precision.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 border rounded-xl hover:bg-slate-50 transition-colors">
              <span className="text-2xl">📋</span>
              <div>
                <h4 className="font-bold text-sm">Table Widget</h4>
                <p className="text-xs text-slate-500">Renders interactive grids with pagination and CSV export capabilities.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-900 rounded-3xl p-8 text-white">
          <h2 className="text-xl font-bold mb-4">JSON Example</h2>
          <pre className="text-[10px] bg-slate-950 p-4 rounded-xl overflow-x-auto text-blue-300">
{`{
  "version": "1.0",
  "meta": { "title": "My Dashboard" },
  "sections": [
    {
      "id": "main",
      "layout": { "columns": { "lg": 3 }, "gap": 4 },
      "widgets": [
        { "id": "w1", "type": "kpi", "field": "revenue", "dataSourceId": "ds1" }
      ]
    }
  ]
}`}
          </pre>
        </section>
      </div>
    </div>
  );
};
