import React from 'react';

export default function Button({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) {
  const baseClasses = 'font-semibold rounded transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50';

  const variantClasses = {
    primary: 'bg-indigo-500 text-white hover:bg-indigo-600 disabled:hover:bg-indigo-500',
    secondary: 'bg-slate-700 text-slate-100 hover:bg-slate-600 disabled:hover:bg-slate-700',
    danger: 'bg-red-500 text-white hover:bg-red-600 disabled:hover:bg-red-500',
    success: 'bg-green-500 text-white hover:bg-green-600 disabled:hover:bg-green-500',
  };

  const sizeClasses = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}
