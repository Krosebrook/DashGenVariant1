
import React from 'react';
import { Card } from '../UI/Card';
import { TimelineWidgetSchema } from '../../types';
import { z } from 'zod';

type TimelineProps = z.infer<typeof TimelineWidgetSchema> & { data: any[] };

export const TimelineWidget: React.FC<TimelineProps> = ({ title, data = [], dateField, titleField, descriptionField }) => {
  // Ensure data is sorted chronologically
  const sortedData = [...data].sort((a, b) => {
    return new Date(b[dateField]).getTime() - new Date(a[dateField]).getTime();
  });

  return (
    <Card title={title}>
      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
        {sortedData.length === 0 && <p className="text-sm text-slate-400 italic">No events found.</p>}
        {sortedData.map((item, i) => (
          <div key={i} className="flex gap-4 border-l-2 border-slate-200 pl-6 relative pb-1">
            <div className="absolute w-3 h-3 bg-white border-2 border-blue-500 rounded-full -left-[7px] top-1.5 transition-colors hover:bg-blue-50"></div>
            <div className="flex-1">
               <span className="text-[10px] text-slate-400 block mb-0.5 uppercase font-bold tracking-wider">
                 {new Date(item[dateField]).toLocaleDateString()}
               </span>
               <h4 className="font-bold text-slate-900 text-sm">{item[titleField]}</h4>
               {descriptionField && (
                 <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                   {String(item[descriptionField])}
                 </p>
               )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
