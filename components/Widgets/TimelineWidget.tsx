
import React from 'react';
import { Card } from '../UI/Card';
import { TimelineWidgetSchema } from '../../types';
import { z } from 'zod';
import { Calendar, Clock, ChevronRight } from 'lucide-react';

type TimelineProps = z.infer<typeof TimelineWidgetSchema> & { data: any[] };

export const TimelineWidget: React.FC<TimelineProps> = ({ title, data = [], dateField, titleField, descriptionField }) => {
  // Ensure data is sorted chronologically
  const sortedData = [...data].sort((a, b) => {
    return new Date(b[dateField]).getTime() - new Date(a[dateField]).getTime();
  });

  return (
    <Card title={title}>
      <div className="relative space-y-0 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200">
        {sortedData.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <Calendar className="w-8 h-8 mb-2 opacity-20" />
            <p className="text-sm italic">No events found.</p>
          </div>
        )}
        
        {/* Vertical Line */}
        {sortedData.length > 0 && (
          <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-slate-100 dark:bg-slate-800"></div>
        )}

        {sortedData.map((item, i) => (
          <div key={i} className="group relative pl-10 pb-8 last:pb-2">
            {/* Dot */}
            <div className="absolute left-0 top-1.5 w-6 h-6 flex items-center justify-center z-10">
              <div className="w-2.5 h-2.5 bg-white dark:bg-slate-900 border-2 border-blue-500 rounded-full transition-all group-hover:scale-125 group-hover:bg-blue-500"></div>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <span className="flex items-center gap-1 text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">
                  <Clock className="w-3 h-3" />
                  {new Date(item[dateField]).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              
              <div className="bg-white dark:bg-slate-900/50 border border-transparent group-hover:border-slate-200 dark:group-hover:border-slate-700 p-3 rounded-xl transition-all">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                  {item[titleField]}
                  <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400" />
                </h4>
                {descriptionField && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                    {String(item[descriptionField])}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
