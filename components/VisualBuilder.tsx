import React, { useState } from 'react';
import { useDashboardStore } from '../store';
import { DashboardSpec, Widget, DataSource, Filter } from '../types';

export const VisualBuilder: React.FC = () => {
  const { spec, setSpec } = useDashboardStore();
  const [activeTab, setActiveTab] = useState<'general' | 'datasources' | 'filters' | 'sections'>('general');

  const updateMeta = (field: keyof DashboardSpec['meta'], value: string) => {
    setSpec({ ...spec, meta: { ...spec.meta, [field]: value } });
  };

  const updateTheme = (field: keyof DashboardSpec['theme'], value: string) => {
    setSpec({ ...spec, theme: { ...spec.theme, [field]: value } });
  };

  const addDataSource = () => {
    const newDs: DataSource = { id: `ds_${Date.now()}`, type: 'inline', data: [] };
    setSpec({ ...spec, dataSources: [...spec.dataSources, newDs] });
  };

  const updateDataSource = (index: number, field: string, value: any) => {
    const newDataSources = [...spec.dataSources];
    newDataSources[index] = { ...newDataSources[index], [field]: value };
    setSpec({ ...spec, dataSources: newDataSources });
  };

  const removeDataSource = (index: number) => {
    const newDataSources = [...spec.dataSources];
    newDataSources.splice(index, 1);
    setSpec({ ...spec, dataSources: newDataSources });
  };

  const addFilter = () => {
    const newFilter: Filter = { id: `filter_${Date.now()}`, type: 'single-select', label: 'New Filter', dataSourceId: '', field: '' };
    setSpec({ ...spec, filters: [...(spec.filters || []), newFilter] });
  };

  const updateFilter = (index: number, field: string, value: any) => {
    const newFilters = [...(spec.filters || [])];
    newFilters[index] = { ...newFilters[index], [field]: value };
    setSpec({ ...spec, filters: newFilters });
  };

  const removeFilter = (index: number) => {
    const newFilters = [...(spec.filters || [])];
    newFilters.splice(index, 1);
    setSpec({ ...spec, filters: newFilters });
  };

  const addSection = () => {
    const newSection = {
      id: `section_${Date.now()}`,
      title: 'New Section',
      layout: { columns: { base: 1, md: 2, lg: 3 }, gap: 4 },
      widgets: []
    };
    setSpec({ ...spec, sections: [...spec.sections, newSection] });
  };

  const updateSection = (index: number, field: string, value: any) => {
    const newSections = [...spec.sections];
    newSections[index] = { ...newSections[index], [field]: value };
    setSpec({ ...spec, sections: newSections });
  };

  const removeSection = (index: number) => {
    const newSections = [...spec.sections];
    newSections.splice(index, 1);
    setSpec({ ...spec, sections: newSections });
  };

  const addWidget = (sectionIndex: number) => {
    const newWidget: Widget = { id: `widget_${Date.now()}`, type: 'kpi', dataSourceId: '', field: 'value', title: 'New KPI', precision: 0 };
    const newSections = [...spec.sections];
    newSections[sectionIndex].widgets.push(newWidget);
    setSpec({ ...spec, sections: newSections });
  };

  const updateWidget = (sectionIndex: number, widgetIndex: number, field: string, value: any) => {
    const newSections = [...spec.sections];
    newSections[sectionIndex].widgets[widgetIndex] = { ...newSections[sectionIndex].widgets[widgetIndex], [field]: value };
    setSpec({ ...spec, sections: newSections });
  };

  const removeWidget = (sectionIndex: number, widgetIndex: number) => {
    const newSections = [...spec.sections];
    newSections[sectionIndex].widgets.splice(widgetIndex, 1);
    setSpec({ ...spec, sections: newSections });
  };

  return (
    <div className="flex flex-col h-full text-slate-300">
      <div className="flex border-b border-slate-800">
        {['general', 'datasources', 'filters', 'sections'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider ${activeTab === tab ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-500 hover:text-slate-300'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-6">
        {activeTab === 'general' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white mb-2">Meta Information</h3>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Title</label>
              <input type="text" value={spec.meta.title} onChange={(e) => updateMeta('title', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Description</label>
              <input type="text" value={spec.meta.description || ''} onChange={(e) => updateMeta('description', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Author</label>
              <input type="text" value={spec.meta.author || ''} onChange={(e) => updateMeta('author', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
            </div>

            <h3 className="text-sm font-bold text-white mb-2 mt-6">Theme Settings</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Mode</label>
                <select value={spec.theme.mode} onChange={(e) => updateTheme('mode', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500">
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Density</label>
                <select value={spec.theme.density} onChange={(e) => updateTheme('density', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500">
                  <option value="compact">Compact</option>
                  <option value="cozy">Cozy</option>
                  <option value="comfortable">Comfortable</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'datasources' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-white">Data Sources</h3>
              <button onClick={addDataSource} className="bg-slate-800 hover:bg-slate-700 text-white text-xs px-3 py-1.5 rounded font-medium">+ Add Source</button>
            </div>
            {spec.dataSources.map((ds, idx) => (
              <div key={idx} className="bg-slate-800 p-4 rounded-lg border border-slate-700 space-y-3 relative">
                <button onClick={() => removeDataSource(idx)} className="absolute top-2 right-2 text-slate-500 hover:text-red-400 text-xs">✕</button>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">ID</label>
                    <input type="text" value={ds.id} onChange={(e) => updateDataSource(idx, 'id', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Type</label>
                    <select value={ds.type} onChange={(e) => updateDataSource(idx, 'type', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500">
                      <option value="inline">Inline JSON</option>
                      <option value="api">API Endpoint</option>
                      <option value="csv">CSV</option>
                      <option value="postgres">PostgreSQL</option>
                      <option value="mongodb">MongoDB</option>
                    </select>
                  </div>
                </div>
                {ds.type === 'inline' && (
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Data (JSON Array)</label>
                    <textarea 
                      value={JSON.stringify(ds.data, null, 2)} 
                      onChange={(e) => {
                        try { updateDataSource(idx, 'data', JSON.parse(e.target.value)); } catch(err) {}
                      }} 
                      className="w-full h-32 bg-slate-900 border border-slate-700 rounded px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                )}
                {ds.type === 'api' && (
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">URL</label>
                    <input type="text" value={(ds as any).url || ''} onChange={(e) => updateDataSource(idx, 'url', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500" />
                  </div>
                )}
                {ds.type === 'postgres' && (
                  <>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Connection String</label>
                      <input type="text" value={(ds as any).connectionString || ''} onChange={(e) => updateDataSource(idx, 'connectionString', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500" placeholder="postgres://user:pass@host:5432/db" />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">SQL Query</label>
                      <textarea 
                        value={(ds as any).query || ''} 
                        onChange={(e) => updateDataSource(idx, 'query', e.target.value)} 
                        className="w-full h-24 bg-slate-900 border border-slate-700 rounded px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
                        placeholder="SELECT * FROM users;"
                      />
                    </div>
                  </>
                )}
                {ds.type === 'mongodb' && (
                  <>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Connection String</label>
                      <input type="text" value={(ds as any).connectionString || ''} onChange={(e) => updateDataSource(idx, 'connectionString', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500" placeholder="mongodb://user:pass@host:27017/db" />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Collection</label>
                      <input type="text" value={(ds as any).collection || ''} onChange={(e) => updateDataSource(idx, 'collection', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500" placeholder="users" />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Query (JSON String)</label>
                      <textarea 
                        value={(ds as any).query || ''} 
                        onChange={(e) => updateDataSource(idx, 'query', e.target.value)} 
                        className="w-full h-24 bg-slate-900 border border-slate-700 rounded px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
                        placeholder='{"status": "active"}'
                      />
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'filters' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-white">Filters</h3>
              <button onClick={addFilter} className="bg-slate-800 hover:bg-slate-700 text-white text-xs px-3 py-1.5 rounded font-medium">+ Add Filter</button>
            </div>
            {(spec.filters || []).map((filter, idx) => (
              <div key={idx} className="bg-slate-800 p-4 rounded-lg border border-slate-700 space-y-3 relative">
                <button onClick={() => removeFilter(idx)} className="absolute top-2 right-2 text-slate-500 hover:text-red-400 text-xs">✕</button>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">ID</label>
                    <input type="text" value={filter.id} onChange={(e) => updateFilter(idx, 'id', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Label</label>
                    <input type="text" value={filter.label} onChange={(e) => updateFilter(idx, 'label', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Type</label>
                    <select value={filter.type} onChange={(e) => updateFilter(idx, 'type', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500">
                      <option value="single-select">Single Select</option>
                      <option value="multi-select">Multi Select</option>
                      <option value="date">Date</option>
                      <option value="search">Search</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Data Source ID</label>
                    <input type="text" value={filter.dataSourceId} onChange={(e) => updateFilter(idx, 'dataSourceId', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Field</label>
                    <input type="text" value={filter.field} onChange={(e) => updateFilter(idx, 'field', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'sections' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-white">Sections & Widgets</h3>
              <button onClick={addSection} className="bg-slate-800 hover:bg-slate-700 text-white text-xs px-3 py-1.5 rounded font-medium">+ Add Section</button>
            </div>
            {spec.sections.map((section, sIdx) => (
              <div key={sIdx} className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 space-y-4 relative">
                <button onClick={() => removeSection(sIdx)} className="absolute top-2 right-2 text-slate-500 hover:text-red-400 text-xs">✕</button>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Section Title</label>
                    <input type="text" value={section.title || ''} onChange={(e) => updateSection(sIdx, 'title', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Section ID</label>
                    <input type="text" value={section.id} onChange={(e) => updateSection(sIdx, 'id', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500" />
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-xs font-bold text-slate-300">Widgets</h4>
                    <button onClick={() => addWidget(sIdx)} className="text-blue-400 hover:text-blue-300 text-xs">+ Add Widget</button>
                  </div>
                  <div className="space-y-3">
                    {section.widgets.map((widget, wIdx) => (
                      <div key={wIdx} className="bg-slate-900 p-3 rounded border border-slate-700 relative">
                        <button onClick={() => removeWidget(sIdx, wIdx)} className="absolute top-2 right-2 text-slate-600 hover:text-red-400 text-xs">✕</button>
                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <div>
                            <label className="block text-[10px] text-slate-500 uppercase">Type</label>
                            <select value={widget.type} onChange={(e) => updateWidget(sIdx, wIdx, 'type', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-white focus:outline-none">
                              <option value="kpi">KPI</option>
                              <option value="chart">Chart</option>
                              <option value="table">Table</option>
                              <option value="timeline">Timeline</option>
                              <option value="text">Text</option>
                              <option value="alert">Alert</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-500 uppercase">ID</label>
                            <input type="text" value={widget.id} onChange={(e) => updateWidget(sIdx, wIdx, 'id', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-white focus:outline-none" />
                          </div>
                          {widget.type !== 'text' && widget.type !== 'alert' && widget.type !== 'divider' && (
                            <>
                              <div>
                                <label className="block text-[10px] text-slate-500 uppercase">Data Source ID</label>
                                <input type="text" value={(widget as any).dataSourceId || ''} onChange={(e) => updateWidget(sIdx, wIdx, 'dataSourceId', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-white focus:outline-none" />
                              </div>
                              <div>
                                <label className="block text-[10px] text-slate-500 uppercase">Title</label>
                                <input type="text" value={(widget as any).title || ''} onChange={(e) => updateWidget(sIdx, wIdx, 'title', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-white focus:outline-none" />
                              </div>
                            </>
                          )}
                        </div>
                        
                        {/* Widget specific fields */}
                        {widget.type === 'kpi' && (
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[10px] text-slate-500 uppercase">Field</label>
                              <input type="text" value={(widget as any).field || ''} onChange={(e) => updateWidget(sIdx, wIdx, 'field', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-white focus:outline-none" />
                            </div>
                            <div>
                              <label className="block text-[10px] text-slate-500 uppercase">Prefix</label>
                              <input type="text" value={(widget as any).prefix || ''} onChange={(e) => updateWidget(sIdx, wIdx, 'prefix', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-white focus:outline-none" />
                            </div>
                          </div>
                        )}
                        {widget.type === 'chart' && (
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[10px] text-slate-500 uppercase">Chart Type</label>
                              <select value={(widget as any).chartType || 'line'} onChange={(e) => updateWidget(sIdx, wIdx, 'chartType', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-white focus:outline-none">
                                <option value="line">Line</option>
                                <option value="bar">Bar</option>
                                <option value="area">Area</option>
                                <option value="pie">Pie</option>
                                <option value="scatter">Scatter</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-[10px] text-slate-500 uppercase">X-Axis Field</label>
                              <input type="text" value={(widget as any).xAxis || ''} onChange={(e) => updateWidget(sIdx, wIdx, 'xAxis', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-white focus:outline-none" />
                            </div>
                            <div className="col-span-2">
                              <label className="block text-[10px] text-slate-500 uppercase">Y-Axis Fields (comma separated)</label>
                              <input type="text" value={((widget as any).yAxis || []).join(', ')} onChange={(e) => updateWidget(sIdx, wIdx, 'yAxis', e.target.value.split(',').map(s => s.trim()))} className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-white focus:outline-none" />
                            </div>
                            <div>
                              <label className="block text-[10px] text-slate-500 uppercase">X-Axis Label</label>
                              <input type="text" value={(widget as any).xAxisLabel || ''} onChange={(e) => updateWidget(sIdx, wIdx, 'xAxisLabel', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-white focus:outline-none" />
                            </div>
                            <div>
                              <label className="block text-[10px] text-slate-500 uppercase">Y-Axis Label</label>
                              <input type="text" value={(widget as any).yAxisLabel || ''} onChange={(e) => updateWidget(sIdx, wIdx, 'yAxisLabel', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-white focus:outline-none" />
                            </div>
                            <div className="col-span-2">
                              <label className="block text-[10px] text-slate-500 uppercase">Colors (comma separated hex, optional)</label>
                              <input type="text" value={((widget as any).colors || []).join(', ')} onChange={(e) => updateWidget(sIdx, wIdx, 'colors', e.target.value ? e.target.value.split(',').map(s => s.trim()) : undefined)} className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-white focus:outline-none" placeholder="#ff0000, #00ff00" />
                            </div>
                          </div>
                        )}
                        {widget.type === 'table' && (
                          <div className="grid grid-cols-1 gap-3">
                            <div>
                              <label className="block text-[10px] text-slate-500 uppercase">Columns (JSON Array)</label>
                              <textarea 
                                value={JSON.stringify((widget as any).columns || [], null, 2)} 
                                onChange={(e) => {
                                  try { updateWidget(sIdx, wIdx, 'columns', JSON.parse(e.target.value)); } catch(err) {}
                                }} 
                                className="w-full h-24 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs font-mono text-white focus:outline-none"
                              />
                            </div>
                          </div>
                        )}
                        {widget.type === 'timeline' && (
                          <div className="grid grid-cols-3 gap-3">
                            <div>
                              <label className="block text-[10px] text-slate-500 uppercase">Title Field</label>
                              <input type="text" value={(widget as any).titleField || ''} onChange={(e) => updateWidget(sIdx, wIdx, 'titleField', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-white focus:outline-none" />
                            </div>
                            <div>
                              <label className="block text-[10px] text-slate-500 uppercase">Desc Field</label>
                              <input type="text" value={(widget as any).descriptionField || ''} onChange={(e) => updateWidget(sIdx, wIdx, 'descriptionField', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-white focus:outline-none" />
                            </div>
                            <div>
                              <label className="block text-[10px] text-slate-500 uppercase">Date Field</label>
                              <input type="text" value={(widget as any).dateField || ''} onChange={(e) => updateWidget(sIdx, wIdx, 'dateField', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-white focus:outline-none" />
                            </div>
                          </div>
                        )}
                        {widget.type === 'text' && (
                          <div className="grid grid-cols-1 gap-3">
                            <div>
                              <label className="block text-[10px] text-slate-500 uppercase">Content</label>
                              <textarea 
                                value={(widget as any).content || ''} 
                                onChange={(e) => updateWidget(sIdx, wIdx, 'content', e.target.value)} 
                                className="w-full h-20 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-white focus:outline-none"
                              />
                            </div>
                          </div>
                        )}
                        {widget.type === 'alert' && (
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[10px] text-slate-500 uppercase">Title</label>
                              <input type="text" value={(widget as any).title || ''} onChange={(e) => updateWidget(sIdx, wIdx, 'title', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-white focus:outline-none" />
                            </div>
                            <div>
                              <label className="block text-[10px] text-slate-500 uppercase">Severity</label>
                              <select value={(widget as any).severity || 'info'} onChange={(e) => updateWidget(sIdx, wIdx, 'severity', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-white focus:outline-none">
                                <option value="info">Info</option>
                                <option value="warning">Warning</option>
                                <option value="error">Error</option>
                                <option value="success">Success</option>
                              </select>
                            </div>
                            <div className="col-span-2">
                              <label className="block text-[10px] text-slate-500 uppercase">Message</label>
                              <textarea 
                                value={(widget as any).message || ''} 
                                onChange={(e) => updateWidget(sIdx, wIdx, 'message', e.target.value)} 
                                className="w-full h-16 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-white focus:outline-none"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
