
import React, { useState, useEffect } from 'react';
import { useDashboardStore } from '../store';
import { DashboardSpecSchema } from '../types';
import { VisualBuilder } from './VisualBuilder';

export const DashboardBuilder: React.FC = () => {
  const { spec, setSpec } = useDashboardStore();
  const [jsonText, setJsonText] = useState(JSON.stringify(spec, null, 2));
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState<'json' | 'form'>('form');

  useEffect(() => {
    if (editMode === 'json') {
      setJsonText(JSON.stringify(spec, null, 2));
    }
  }, [spec, editMode]);

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
          <button onClick={() => setEditMode('form')} className={`text-xs px-3 py-1 rounded ${editMode === 'form' ? 'bg-slate-800 text-white' : 'text-slate-500'}`}>Visual Builder</button>
          <button onClick={() => setEditMode('json')} className={`text-xs px-3 py-1 rounded ${editMode === 'json' ? 'bg-slate-800 text-white' : 'text-slate-500'}`}>JSON</button>
        </div>
        {editMode === 'json' && (
          <button onClick={handleUpdate} className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-3 py-1.5 rounded font-medium">Apply JSON</button>
        )}
      </div>
      
      <div className="flex-1 overflow-auto">
        {editMode === 'json' ? (
          <div className="h-full p-4">
            <textarea
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              className="w-full h-full bg-transparent font-mono text-xs text-slate-300 focus:outline-none resize-none"
              spellCheck={false}
            />
          </div>
        ) : (
          <VisualBuilder />
        )}
      </div>
      {error && editMode === 'json' && (
        <div className="p-4 bg-red-900/50 text-red-200 text-[10px] whitespace-pre-wrap">{error}</div>
      )}
    </div>
  );
};
