
import React, { useState, useEffect } from 'react';
import { useDashboardStore } from './store';
import { DashboardRenderer } from './components/DashboardRenderer';
import { DashboardBuilder } from './components/DashboardBuilder';
import { TemplateGallery } from './components/TemplateGallery';
import { DocsView } from './components/DocsView';
import { Auth } from './components/Auth';
import { EXECUTIVE_DASHBOARD } from './constants/examples';
import { getShareableUrl, decodeSpec } from './utils/sharing';

const App: React.FC = () => {
  const { spec, activeFilters, setFilter, setSpec, loadData, isReadOnly, setReadOnly, user, token, logout } = useDashboardStore();
  const [view, setView] = useState<'preview' | 'builder' | 'docs' | 'dashboards'>('preview');
  const [showTemplates, setShowTemplates] = useState(false);
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light');
  const [savedDashboards, setSavedDashboards] = useState<any[]>([]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light');
    const handler = (e: MediaQueryListEvent) => setSystemTheme(e.matches ? 'dark' : 'light');
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const effectiveTheme = spec.theme.mode === 'system' ? systemTheme : spec.theme.mode;

  useEffect(() => {
    if (token && !user) {
      fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => {
        if (!res.ok) throw new Error('Invalid token');
        return res.json();
      })
      .then(data => {
        useDashboardStore.setState({ user: data.user });
      })
      .catch(() => {
        logout();
      });
    }
  }, []);

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

  useEffect(() => {
    if (user && token && view === 'dashboards') {
      fetch('/api/dashboards', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => setSavedDashboards(data))
      .catch(err => console.error(err));
    }
  }, [user, token, view]);

  const handleSaveDashboard = async () => {
    if (!user || !token) return alert('Please login to save dashboards');
    try {
      const res = await fetch('/api/dashboards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ spec })
      });
      if (!res.ok) throw new Error('Failed to save');
      alert('Dashboard saved successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to save dashboard');
    }
  };

  const loadSavedDashboard = (savedSpec: any) => {
    setSpec(savedSpec);
    setView('preview');
  };

  const deleteDashboard = async (id: number) => {
    if (!confirm('Are you sure?')) return;
    try {
      await fetch(`/api/dashboards/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setSavedDashboards(savedDashboards.filter(d => d.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (!user && !isReadOnly) {
    return (
      <div className={`min-h-screen flex flex-col transition-colors duration-300 ${effectiveTheme === 'dark' ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
        <header className={`no-print border-b sticky top-0 z-30 px-8 h-16 flex items-center justify-between shadow-sm transition-colors duration-300 ${effectiveTheme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                <span className="text-white font-bold text-xl">D</span>
            </div>
            <h1 className={`text-lg font-black tracking-tight ${effectiveTheme === 'dark' ? 'text-white' : 'text-slate-900'}`}>DASH<span className="text-blue-600">PRO</span></h1>
          </div>
        </header>
        <main className="flex-1 p-10 flex items-center justify-center">
          <Auth />
        </main>
      </div>
    );
  }

  const handlePrint = () => window.print();

  const handleShare = () => {
    const url = getShareableUrl(spec, true);
    navigator.clipboard.writeText(url);
    setShareStatus('copied');
    setTimeout(() => setShareStatus('idle'), 2000);
  };

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSpec({ ...spec, theme: { ...spec.theme, mode: e.target.value as any } });
  };

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isReadOnly) return;
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const csvSourceId = `csv_${Date.now()}`;
      
      const newSpec = { ...spec };
      // Check if CSV sources exist and append, or add new
      const newDataSource = { id: csvSourceId, type: 'csv', content };
      newSpec.dataSources.push(newDataSource as any);
      
      setSpec(newSpec);
      alert(`CSV loaded with ID: ${csvSourceId}`);
    };
    reader.readAsText(file);
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${effectiveTheme === 'dark' ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <header className={`no-print border-b sticky top-0 z-30 px-8 h-16 flex items-center justify-between shadow-sm transition-colors duration-300 ${effectiveTheme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => { if(!isReadOnly) { setReadOnly(false); setView('preview'); } }}>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                <span className="text-white font-bold text-xl">D</span>
            </div>
            <h1 className={`text-lg font-black tracking-tight ${effectiveTheme === 'dark' ? 'text-white' : 'text-slate-900'}`}>DASH<span className="text-blue-600">PRO</span></h1>
          </div>
          
          {!isReadOnly && (
            <nav className={`flex items-center p-1 rounded-xl ${effectiveTheme === 'dark' ? 'bg-slate-800' : 'bg-slate-100'}`}>
              <button onClick={() => setView('preview')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${view === 'preview' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-400'}`}>PREVIEW</button>
              <button onClick={() => setView('builder')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${view === 'builder' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-400'}`}>EDITOR</button>
              <button onClick={() => setView('dashboards')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${view === 'dashboards' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-400'}`}>MY DASHBOARDS</button>
              <button onClick={() => setView('docs')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${view === 'docs' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-400'}`}>DOCS</button>
            </nav>
          )}

          {isReadOnly && (
            <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-lg">
               <span className="text-[10px] font-black text-blue-700 uppercase tracking-widest">Read Only Mode</span>
               <button onClick={() => setReadOnly(false)} className="text-[10px] text-blue-400 hover:text-blue-600 font-bold ml-2">Unlock</button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center mr-2 border-r border-slate-700 pr-4">
            <select 
              value={spec.theme.mode} 
              onChange={handleThemeChange}
              className={`text-xs font-bold rounded-lg border px-2 py-1.5 outline-none cursor-pointer transition-colors ${
                effectiveTheme === 'dark' 
                  ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' 
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <option value="light">☀️ Light</option>
              <option value="dark">🌙 Dark</option>
              <option value="system">🖥️ System</option>
            </select>
          </div>

          {!isReadOnly && (
            <button 
              onClick={handleSaveDashboard}
              className={`text-xs font-bold transition-colors px-4 border-r ${effectiveTheme === 'dark' ? 'text-slate-400 hover:text-blue-400 border-slate-700' : 'text-slate-600 hover:text-blue-600 border-slate-200'}`}
            >
              SAVE
            </button>
          )}

          <button 
            onClick={() => setShowTemplates(true)}
            className={`text-xs font-bold transition-colors px-4 border-r ${effectiveTheme === 'dark' ? 'text-slate-400 hover:text-blue-400 border-slate-700' : 'text-slate-600 hover:text-blue-600 border-slate-200'}`}
          >
            TEMPLATES
          </button>
          
          <button 
            onClick={handleShare}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all border ${
              shareStatus === 'copied' 
                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' 
                : effectiveTheme === 'dark'
                  ? 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            {shareStatus === 'copied' ? 'LINK COPIED' : 'SHARE'}
          </button>

          {!isReadOnly && (
            <label className={`text-xs px-4 py-2 rounded-lg font-bold cursor-pointer transition-colors border ${
              effectiveTheme === 'dark' 
                ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300' 
                : 'bg-slate-100 hover:bg-slate-200 border-slate-200'
            }`}>
              UPLOAD CSV
              <input type="file" accept=".csv" className="hidden" onChange={handleCsvUpload} />
            </label>
          )}

          <button onClick={handlePrint} className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-xs font-bold hover:bg-blue-500 transition-all shadow-md shadow-blue-500/20">
            PDF
          </button>

          {!isReadOnly && (
            <button onClick={logout} className={`text-xs font-bold transition-colors px-4 border-l ${effectiveTheme === 'dark' ? 'text-red-400 hover:text-red-300 border-slate-700' : 'text-red-600 hover:text-red-500 border-slate-200'}`}>
              LOGOUT
            </button>
          )}
        </div>
      </header>

      {view === 'preview' && spec.filters?.length > 0 && (
        <div className={`no-print backdrop-blur-md border-b px-10 py-5 flex flex-wrap items-end gap-8 sticky top-16 z-20 transition-colors duration-300 ${
          effectiveTheme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-200'
        }`}>
          {spec.filters.map(filter => (
            <div key={filter.id} className="flex flex-col gap-2">
              <label className={`text-[10px] font-black uppercase tracking-widest ${effectiveTheme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>{filter.label}</label>
              
              {filter.type === 'multi-select' && (
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
                            : effectiveTheme === 'dark' 
                                ? 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                     >
                       {opt.label}
                     </button>
                   ))}
                </div>
              )}

              {filter.type === 'date' && (
                <div className="flex gap-2 items-center">
                  <input 
                    type="date"
                    className={`text-xs px-2 py-1.5 border rounded-lg outline-none transition-all ${
                      effectiveTheme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'
                    }`}
                    onChange={(e) => setFilter(filter.id, { ...activeFilters[filter.id], start: e.target.value })}
                  />
                  <span className="text-slate-400">-</span>
                  <input 
                    type="date"
                    className={`text-xs px-2 py-1.5 border rounded-lg outline-none transition-all ${
                      effectiveTheme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'
                    }`}
                    onChange={(e) => setFilter(filter.id, { ...activeFilters[filter.id], end: e.target.value })}
                  />
                </div>
              )}

              {(filter.type === 'search' || !['multi-select', 'date'].includes(filter.type)) && (
                <div className="relative">
                  <input 
                    className={`text-xs px-4 py-2 border rounded-lg outline-none w-64 transition-all pl-8 ${
                      effectiveTheme === 'dark' 
                        ? 'bg-slate-800 border-slate-700 text-white focus:border-blue-500' 
                        : 'bg-slate-50 border-slate-200 focus:border-blue-500'
                    }`}
                    placeholder={`Search ${filter.field}...`}
                    onChange={(e) => setFilter(filter.id, e.target.value)}
                  />
                  <span className="absolute left-2.5 top-2 text-slate-400 text-xs">🔍</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <main className={`flex-1 p-10 transition-colors duration-300 ${effectiveTheme === 'dark' ? 'bg-slate-950' : 'bg-slate-50'}`}>
        <div className="max-w-7xl mx-auto">
          {view === 'preview' && (
            <div className="animate-in fade-in duration-500">
               <div className="mb-12">
                  <h1 className={`text-4xl font-black tracking-tight ${effectiveTheme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{spec.meta.title}</h1>
                  {spec.meta.description && <p className={`mt-2 text-lg font-medium leading-relaxed max-w-3xl ${effectiveTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{spec.meta.description}</p>}
               </div>
               <DashboardRenderer />
            </div>
          )}
          {view === 'builder' && (
            <div className="h-[calc(100vh-180px)] animate-in slide-in-from-bottom-4 duration-300">
               <DashboardBuilder />
            </div>
          )}
          {view === 'dashboards' && (
            <div className="animate-in fade-in duration-500">
              <h2 className={`text-2xl font-bold mb-6 ${effectiveTheme === 'dark' ? 'text-white' : 'text-slate-900'}`}>My Dashboards</h2>
              {savedDashboards.length === 0 ? (
                <p className={`text-sm ${effectiveTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>You haven't saved any dashboards yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedDashboards.map(d => (
                    <div key={d.id} className={`p-6 rounded-xl border shadow-sm transition-all hover:shadow-md ${effectiveTheme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                      <h3 className={`text-lg font-bold mb-2 ${effectiveTheme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{d.spec.meta.title || 'Untitled Dashboard'}</h3>
                      <p className={`text-xs mb-4 ${effectiveTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Last updated: {new Date(d.updated_at).toLocaleDateString()}</p>
                      <div className="flex gap-3">
                        <button onClick={() => loadSavedDashboard(d.spec)} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 rounded-lg transition-colors">Open</button>
                        <button onClick={() => deleteDashboard(d.id)} className="px-4 bg-red-100 hover:bg-red-200 text-red-600 text-xs font-bold py-2 rounded-lg transition-colors">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
