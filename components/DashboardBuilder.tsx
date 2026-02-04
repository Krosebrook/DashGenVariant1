
import React, { useState, useEffect } from 'react';
import { useDashboardStore } from '../store';
import { DashboardSpecSchema } from '../types';

export const DashboardBuilder: React.FC = () => {
  const { spec, setSpec } = useDashboardStore();
  const [jsonText, setJsonText] = useState(JSON.stringify(spec, null, 2));
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState<'json' | 'form'>('json');

  useEffect(() => {
    setJsonText(JSON.stringify(spec, null, 2));
  }, [spec]);

  const handleUpdate = () => {
    try {
      const parsed = JSON.parse(jsonText);
      const validated = DashboardSpecSchema.parse(parsed);
      setSpec(validated);
      setError(null);
    } catch (e: any) {
      setError(e.errors ? e.errors.map((err: any) => `${err.path.join('.')}: ${err.message}`).join('\n') : e.message);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-xl overflow-hidden shadow-2xl">
      <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950">
        <div className="flex gap-4">
          <button onClick={() => setEditMode('json')} className={`text-xs px-3 py-1 rounded ${editMode === 'json' ? 'bg-slate-800 text-white' : 'text-slate-500'}`}>JSON</button>
          <button onClick={() => setEditMode('form')} className={`text-xs px-3 py-1 rounded ${editMode === 'form' ? 'bg-slate-800 text-white' : 'text-slate-500'}`}>Visual Builder</button>
        </div>
        <button onClick={handleUpdate} className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-3 py-1.5 rounded font-medium">Apply</button>
      </div>
      
      <div className="flex-1 overflow-auto p-4">
        {editMode === 'json' ? (
          <textarea
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            className="w-full h-full bg-transparent font-mono text-xs text-slate-300 focus:outline-none resize-none"
            spellCheck={false}
          />
        ) : (
          <div className="text-slate-400 text-sm italic p-10 text-center">
            Visual Builder GUI is coming soon. Use JSON tab for direct specification control.
          </div>
        )}
      </div>
      {error && (
        <div className="p-4 bg-red-900/50 text-red-200 text-[10px] whitespace-pre-wrap">{error}</div>
      )}
    </div>
  );
};
