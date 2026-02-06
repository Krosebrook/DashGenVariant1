
import React from 'react';
import { Card } from '../UI/Card';
import { KPIWidgetSchema } from '../../types';
import { z } from 'zod';

type KPIProps = z.infer<typeof KPIWidgetSchema> & { data: any[] };

export const KPIWidget: React.FC<KPIProps> = ({ title, data = [], field, prefix, suffix, precision = 0 }) => {
  const value = data.length > 0 ? data[0][field] : 0;
  const formattedValue = typeof value === 'number' 
    ? value.toLocaleString(undefined, { minimumFractionDigits: precision, maximumFractionDigits: precision })
    : value;

  return (
    <Card className="hover:border-slate-300 transition-colors">
      <div className="flex flex-col">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{title}</span>
        <div className="mt-2 flex items-baseline gap-1">
          {prefix && <span className="text-xl font-medium text-slate-400">{prefix}</span>}
          <span className="text-3xl font-bold text-slate-900 tracking-tight">{formattedValue}</span>
          {suffix && <span className="text-sm font-medium text-slate-400">{suffix}</span>}
        </div>
      </div>
    </Card>
  );
};
