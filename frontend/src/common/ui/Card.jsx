import React from 'react';

export default function Card({ children, className = '', title = '' }) {
  return (
    <div className={`bg-slate-900 border border-slate-800 rounded-lg p-6 hover:border-slate-700 transition-colors ${className}`}>
      {title && <h3 className="text-lg font-semibold mb-4 text-slate-100">{title}</h3>}
      <div className="text-slate-300">{children}</div>
    </div>
  );
}
