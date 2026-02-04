
import React, { useState, useMemo } from 'react';
import { TEMPLATES } from '../constants/templates';
import { useDashboardStore } from '../store';

interface TemplateGalleryProps {
  onClose: () => void;
}

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({ onClose }) => {
  const { setSpec, setReadOnly } = useDashboardStore();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = useMemo(() => {
    const cats = new Set(TEMPLATES.map(t => t.category));
    return Array.from(cats);
  }, []);

  const filteredTemplates = useMemo(() => {
    return TEMPLATES.filter(t => {
      const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) || 
                            t.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory ? t.category === selectedCategory : true;
      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

  const handleSelect = (spec: any) => {
    setSpec(spec);
    setReadOnly(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-white/20">
        <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Template Gallery</h2>
            <p className="text-sm text-slate-500 mt-1">Select a starting point for your next powerful dashboard.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
             <div className="relative">
                <input 
                   type="text" 
                   placeholder="Search templates..." 
                   className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 w-full sm:w-64 outline-none"
                   value={search}
                   onChange={(e) => setSearch(e.target.value)}
                />
                <span className="absolute left-3 top-2.5 text-slate-400">🔍</span>
             </div>
             <button 
               onClick={onClose}
               className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
             >
               <span className="text-xl">×</span>
             </button>
          </div>
        </div>

        <div className="px-8 py-4 border-b border-slate-50 bg-slate-50/50 flex flex-wrap gap-2">
           <button 
             onClick={() => setSelectedCategory(null)}
             className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${!selectedCategory ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}
           >
             ALL
           </button>
           {categories.map(cat => (
             <button 
               key={cat}
               onClick={() => setSelectedCategory(cat)}
               className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${selectedCategory === cat ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}
             >
               {cat.toUpperCase()}
             </button>
           ))}
        </div>
        
        <div className="flex-1 overflow-auto p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTemplates.length > 0 ? filteredTemplates.map((template) => (
            <div 
              key={template.id}
              className="group relative bg-white border border-slate-200 rounded-3xl p-8 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/10 transition-all cursor-pointer flex flex-col overflow-hidden"
              onClick={() => handleSelect(template.spec)}
            >
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-50 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500 ease-out"></div>
              
              <div className="relative z-10 flex flex-col h-full">
                 <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
                    {template.icon}
                 </div>
                 <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-md">{template.category}</span>
                 </div>
                 <h3 className="text-xl font-black text-slate-900 mb-3 tracking-tight group-hover:text-blue-600 transition-colors">{template.title}</h3>
                 <p className="text-sm text-slate-500 leading-relaxed flex-1">{template.description}</p>
                 <div className="mt-8 flex items-center gap-2 text-xs font-black text-slate-400 group-hover:text-blue-600 transition-colors uppercase tracking-widest">
                    <span>Use Template</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                 </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-20 text-center flex flex-col items-center">
               <span className="text-4xl mb-4 opacity-20">📂</span>
               <h3 className="text-slate-400 font-bold uppercase tracking-widest text-sm">No templates found</h3>
               <button onClick={() => {setSearch(''); setSelectedCategory(null);}} className="text-blue-600 text-xs font-bold mt-4 hover:underline">Clear all filters</button>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end items-center gap-4">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">DashGen Pro v1.2</span>
          <button 
            onClick={onClose}
            className="text-xs font-black text-slate-500 hover:text-slate-900 uppercase tracking-widest px-6 py-2 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
