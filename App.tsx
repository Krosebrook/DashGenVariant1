
import React, { useState, useEffect } from 'react';
import { useDashboardStore } from './store';
import { DashboardRenderer } from './components/DashboardRenderer';
import { DashboardBuilder } from './components/DashboardBuilder';
import { TemplateGallery } from './components/TemplateGallery';
import { DocsView } from './components/DocsView';
import { EXECUTIVE_DASHBOARD } from './constants/examples';
import { getShareableUrl, decodeSpec } from './utils/sharing';

const App: React.FC = () => {
  const { spec, activeFilters, setFilter, setSpec, loadData, isReadOnly, setReadOnly } = useDashboardStore();
  const [view, setView] = useState<'preview' | 'builder' | 'docs'>('preview');
  const [showTemplates, setShowTemplates] = useState(false);
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sharedSpecEncoded = urlParams.get('spec');
    const viewOnlyParam = urlParams.get('viewOnly');

    if (sharedSpecEncoded) {
      const decoded = decodeSpec(sharedSpecEncoded);
      if (decoded) {
        setSpec(decoded);
        setReadOnly(true);
        setView('preview');
      }
    } else {
      loadData();
    }

    if (viewOnlyParam === 'true') {
      setReadOnly(true);
    }
  }, []);

  const handlePrint = () => window.print();

  const handleShare = () => {
    const url = getShareableUrl(spec);
    navigator.clipboard.writeText(url);
    setShareStatus('copied');
    setTimeout(() => setShareStatus('idle'), 2000);
  };

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isReadOnly) return;
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const csvSourceId = 'uploaded_csv';
      
      const newSpec = { ...spec };
      const existing = newSpec.dataSources.findIndex(d => d.id === csvSourceId);
      const newDataSource = { id: csvSourceId, type: 'csv', content };
      
      if (existing > -1) {
          newSpec.dataSources[existing] = newDataSource as any;
      } else {
          newSpec.dataSources.push(newDataSource as any);
      }
      setSpec(newSpec);
    };
    reader.readAsText(file);
  };

  return (
    <div className={`min-h-screen flex flex-col ${spec.theme.mode === 'dark' ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <header className="no-print bg-white border-b border-slate-200 sticky top-0 z-30 px-8 h-16 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => { if(!isReadOnly) { setReadOnly(false); setView('preview'); } }}>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                <span className="text-white font-bold text-xl">D</span>
            </div>
            <h1 className="text-lg font-black text-slate-900 tracking-tight">DASH<span className="text-blue-600">PRO</span></h1>
          </div>
          
          {!isReadOnly && (
            <nav className="flex items-center bg-slate-100 p-1 rounded-xl">
              <button onClick={() => setView('preview')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${view === 'preview' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>PREVIEW</button>
              <button onClick={() => setView('builder')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${view === 'builder' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>EDITOR</button>
              <button onClick={() => setView('docs')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${view === 'docs' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>DOCS</button>
            </nav>
          )}

          {isReadOnly && (
            <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-lg">
               <span className="text-[10px] font-black text-blue-700 uppercase tracking-widest">Read Only Mode</span>
               <button onClick={() => setReadOnly(false)} className="text-[10px] text-blue-400 font-bold ml-2">Unlock</button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowTemplates(true)}
            className="text-xs text-slate-600 font-bold hover:text-blue-600 transition-colors px-4 border-r border-slate-200"
          >
            TEMPLATES
          </button>
          
          <button 
            onClick={handleShare}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all border ${
              shareStatus === 'copied' ? 'bg-emerald-50 border-emerald-500 text-emerald-600' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            {shareStatus === 'copied' ? 'LINK COPIED' : 'SHARE'}
          </button>

          {!isReadOnly && (
            <label className="text-xs bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg font-bold cursor-pointer transition-colors border border-slate-200">
              CSV
              <input type="file" accept=".csv" className="hidden" onChange={handleCsvUpload} />
            </label>
          )}

          <button onClick={handlePrint} className="bg-slate-900 text-white px-5 py-2.5 rounded-lg text-xs font-bold hover:bg-slate-800 transition-all shadow-md">
            PDF
          </button>
        </div>
      </header>

      {view === 'preview' && spec.filters.length > 0 && (
        <div className="no-print bg-white/80 backdrop-blur-md border-b border-slate-200 px-10 py-5 flex flex-wrap items-end gap-8 sticky top-16 z-20">
          {spec.filters.map(filter => (
            <div key={filter.id} className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{filter.label}</label>
              {filter.type === 'multi-select' ? (
                <div className="flex gap-2">
                   {filter.options?.map(opt => (
                     <button
                        key={opt.value}
                        onClick={() => {
                          const current = activeFilters[filter.id] || [];
                          const next = current.includes(opt.value) ? current.filter((v: any) => v !== opt.value) : [...current, opt.value];
                          setFilter(filter.id, next);
                        }}
                        className={`px-3 py-1.5 text-[11px] font-bold rounded-lg border transition-all ${
                          (activeFilters[filter.id] || []).includes(opt.value)
                            ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/30'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                     >
                       {opt.label}
                     </button>
                   ))}
                </div>
              ) : (
                <input 
                   className="text-xs px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none w-64 bg-slate-50 transition-all"
                   placeholder={`Filter by ${filter.field}...`}
                   onChange={(e) => setFilter(filter.id, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>
      )}

      <main className="flex-1 bg-slate-50 p-10">
        <div className="max-w-7xl mx-auto">
          {view === 'preview' && (
            <div className="animate-in fade-in duration-500">
               <div className="mb-12">
                  <h1 className="text-4xl font-black text-slate-900 tracking-tight">{spec.meta.title}</h1>
                  {spec.meta.description && <p className="text-slate-500 mt-2 text-lg font-medium leading-relaxed max-w-3xl">{spec.meta.description}</p>}
               </div>
               <DashboardRenderer />
            </div>
          )}
          {view === 'builder' && (
            <div className="h-[calc(100vh-180px)] animate-in slide-in-from-bottom-4 duration-300">
               <DashboardBuilder />
            </div>
          )}
          {view === 'docs' && <DocsView />}
        </div>
      </main>

      {showTemplates && <TemplateGallery onClose={() => setShowTemplates(false)} />}
    </div>
  );
};

export default App;
