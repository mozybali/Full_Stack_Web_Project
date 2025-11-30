import React from 'react';

export default function Alert({ type = 'info', title = '', message, onClose = null }) {
  const typeStyles = {
    success: 'bg-green-500/10 border border-green-500/30 text-green-400',
    error: 'bg-red-500/10 border border-red-500/30 text-red-400',
    warning: 'bg-yellow-500/10 border border-yellow-500/30 text-yellow-400',
    info: 'bg-blue-500/10 border border-blue-500/30 text-blue-400',
  };

  const iconMap = {
    success: '✓',
    error: '✕',
    warning: '!',
    info: 'ℹ',
  };

  return (
    <div className={`p-4 rounded-lg ${typeStyles[type]} animate-slideIn`}>
      <div className="flex justify-between items-start gap-3">
        <div className="flex gap-3">
          <span className="text-lg font-bold flex-shrink-0">{iconMap[type]}</span>
          <div>
            {title && <h3 className="font-semibold mb-1 text-sm">{title}</h3>}
            <p className="text-sm">{message}</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-current hover:opacity-75 ml-2 flex-shrink-0"
            aria-label="Kapat"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}
