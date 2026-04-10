
import React from 'react';
import { Card } from '../UI/Card';
import { 
  LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell,
  ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { ChartWidgetSchema } from '../../types';
import { z } from 'zod';

type ChartProps = z.infer<typeof ChartWidgetSchema> & { data: any[], accent?: string };

const DEFAULT_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#6366f1'];

export const ChartWidget: React.FC<ChartProps> = ({ title, chartType, data = [], xAxis, yAxis, xAxisLabel, yAxisLabel, colors, accent }) => {
  const chartColors = colors || [accent || '#3b82f6', ...DEFAULT_COLORS];

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return (
          <LineChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey={xAxis} fontSize={12} tickLine={false} axisLine={false} label={{ value: xAxisLabel || xAxis, position: 'insideBottom', offset: -10 }} />
            <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => val >= 1000 ? `${val/1000}k` : val} label={{ value: yAxisLabel || '', angle: -90, position: 'insideLeft' }} />
            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
            <Legend verticalAlign="top" height={36} iconType="circle" />
            {yAxis.map((key, i) => (
              <Line key={key} type="monotone" dataKey={key} stroke={chartColors[i % chartColors.length]} strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            ))}
          </LineChart>
        );
      case 'bar':
        return (
          <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey={xAxis} fontSize={12} tickLine={false} axisLine={false} label={{ value: xAxisLabel || xAxis, position: 'insideBottom', offset: -10 }} />
            <YAxis fontSize={12} tickLine={false} axisLine={false} label={{ value: yAxisLabel || '', angle: -90, position: 'insideLeft' }} />
            <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none' }} />
            <Legend verticalAlign="top" height={36} />
            {yAxis.map((key, i) => (
              <Bar key={key} dataKey={key} fill={chartColors[i % chartColors.length]} radius={[4, 4, 0, 0]} />
            ))}
          </BarChart>
        );
      case 'area':
        return (
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
             <defs>
              {yAxis.map((key, i) => (
                <linearGradient key={`grad-${key}`} id={`grad-${key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColors[i % chartColors.length]} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={chartColors[i % chartColors.length]} stopOpacity={0}/>
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey={xAxis} fontSize={12} tickLine={false} axisLine={false} label={{ value: xAxisLabel || xAxis, position: 'insideBottom', offset: -10 }} />
            <YAxis fontSize={12} tickLine={false} axisLine={false} label={{ value: yAxisLabel || '', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            {yAxis.map((key, i) => (
              <Area key={key} type="monotone" dataKey={key} stroke={chartColors[i % chartColors.length]} fillOpacity={1} fill={`url(#grad-${key})`} strokeWidth={2} />
            ))}
          </AreaChart>
        );
      case 'pie':
        return (
            <PieChart margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                <Pie 
                    data={data} 
                    dataKey={yAxis[0]} 
                    nameKey={xAxis} 
                    cx="50%" 
                    cy="50%" 
                    innerRadius={60} 
                    outerRadius={80} 
                    paddingAngle={5}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend layout="vertical" align="right" verticalAlign="middle" />
            </PieChart>
        );
      case 'scatter':
        return (
          <ScatterChart margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="x" type="number" name={xAxis} fontSize={12} tickLine={false} axisLine={false} label={{ value: xAxisLabel || xAxis, position: 'insideBottom', offset: -10 }} />
            <YAxis dataKey="y" type="number" name="Value" fontSize={12} tickLine={false} axisLine={false} label={{ value: yAxisLabel || '', angle: -90, position: 'insideLeft' }} />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ borderRadius: '8px', border: 'none' }} />
            <Legend verticalAlign="top" height={36} />
            {yAxis.map((key, i) => {
              const scatterData = data.map(d => ({ x: d[xAxis], y: d[key], payload: d }));
              return <Scatter key={key} name={key} data={scatterData} fill={chartColors[i % chartColors.length]} />;
            })}
          </ScatterChart>
        );
    }
  };

  return (
    <Card title={title}>
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
