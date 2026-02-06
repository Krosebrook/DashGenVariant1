
import React, { useState, useRef } from 'react';
import { Card } from '../UI/Card';
import { TableWidgetSchema } from '../../types';
import { z } from 'zod';

type TableProps = z.infer<typeof TableWidgetSchema> & { data: any[] };

export const TableWidget: React.FC<TableProps> = ({ title, columns, data = [], pageSize = 10 }) => {
  const [page, setPage] = useState(0);
  const tableRef = useRef<HTMLDivElement>(null);
  const totalPages = Math.ceil(data.length / pageSize);
  const paginatedData = data.slice(page * pageSize, (page + 1) * pageSize);

  const formatValue = (val: any, format?: string) => {
    if (val === null || val === undefined) return '-';
    switch (format) {
      case 'currency': return `$${Number(val).toLocaleString()}`;
      case 'number': return Number(val).toLocaleString();
      case 'date': return new Date(val).toLocaleDateString();
      default: return String(val);
    }
  };

  const handleExport = () => {
    const headers = columns.map(c => c.label).join(',');
    const rows = data.map(row => columns.map(c => row[c.key]).join(',')).join('\n');
    const blob = new Blob([`${headers}\n${rows}`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title || 'export'}.csv`;
    a.click();
  };

  const handlePrint = () => {
    if (tableRef.current) {
      // Add a class to the card to target it in CSS
      tableRef.current.classList.add('print-target');
      document.body.classList.add('printing-mode');
      
      window.print();

      // Cleanup
      document.body.classList.remove('printing-mode');
      tableRef.current.classList.remove('print-target');
    }
  };

  return (
    <div ref={tableRef} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
      {(title) && (
        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
          <div className="flex gap-2 no-print">
            <button 
              onClick={handlePrint}
              className="text-xs text-slate-600 hover:text-blue-600 font-medium flex items-center gap-1"
            >
              Print PDF
            </button>
            <button 
              onClick={handleExport}
              className="text-xs text-blue-600 font-medium hover:underline flex items-center gap-1"
            >
              CSV
            </button>
          </div>
        </div>
      )}
      <div className="p-0 flex-1">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/30">
                {columns.map(col => (
                  <th key={col.key} className="py-3 px-4 font-semibold text-slate-600">{col.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, i) => (
                <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  {columns.map(col => (
                    <td key={col.key} className="py-2.5 px-4 text-slate-700">
                      {formatValue(row[col.key], col.format)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between no-print">
          <span className="text-xs text-slate-500">Showing {paginatedData.length} of {data.length} records</span>
          <div className="flex gap-2">
              <button 
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-2 py-1 text-xs border rounded disabled:opacity-50 hover:bg-white"
              >Prev</button>
              <button 
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="px-2 py-1 text-xs border rounded disabled:opacity-50 hover:bg-white"
              >Next</button>
          </div>
      </div>
    </div>
  );
};
