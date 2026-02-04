
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
  footer?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, title, description, className = "", footer }) => {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col ${className}`}>
      {(title || description) && (
        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
          {title && <h3 className="text-sm font-semibold text-slate-900">{title}</h3>}
          {description && <p className="text-xs text-slate-500 mt-1">{description}</p>}
        </div>
      )}
      <div className="p-5 flex-1">
        {children}
      </div>
      {footer && (
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50">
          {footer}
        </div>
      )}
    </div>
  );
};
