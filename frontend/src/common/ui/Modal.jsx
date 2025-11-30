import React from 'react';

export default function Modal({ isOpen, title, children, onClose, footer = null }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-slate-900 border border-slate-800 rounded-lg shadow-2xl max-w-md w-full mx-auto">
        <div className="flex justify-between items-center p-6 border-b border-slate-800">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-300 text-2xl leading-none w-6 h-6 flex items-center justify-center"
            aria-label="Kapat"
          >
            ×
          </button>
        </div>
        <div className="p-6 text-slate-100">{children}</div>
        {footer && (
          <div className="flex gap-2 p-6 border-t border-slate-800 justify-end">{footer}</div>
        )}
      </div>
    </div>
  );
}
