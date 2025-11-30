import React from 'react';

export default function Alert({ type = 'info', title = '', message, onClose = null }) {
  const typeStyles = {
    success: 'bg-green-100 border border-green-400 text-green-700',
    error: 'bg-red-100 border border-red-400 text-red-700',
    warning: 'bg-yellow-100 border border-yellow-400 text-yellow-700',
    info: 'bg-blue-100 border border-blue-400 text-blue-700',
  };

  return (
    <div className={`p-4 rounded-lg ${typeStyles[type]}`}>
      <div className="flex justify-between items-start">
        <div>
          {title && <h3 className="font-bold mb-1">{title}</h3>}
          <p>{message}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-lg font-bold hover:opacity-75 ml-2"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}
