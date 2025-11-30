import React from 'react';

export default function Input({
  type = 'text',
  placeholder = '',
  value = '',
  onChange,
  label = '',
  error = '',
  disabled = false,
  className = '',
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-slate-300 mb-2">
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`
          w-full px-4 py-2 border rounded-lg
          bg-slate-950 text-slate-100 placeholder-slate-600
          focus:outline-none focus:ring-2 transition-colors
          disabled:bg-slate-900 disabled:cursor-not-allowed disabled:text-slate-500
          ${error ? 'border-red-500/50 focus:ring-red-500/50' : 'border-slate-700 focus:ring-indigo-500/50'}
          ${className}
        `}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
    </div>
  );
}
