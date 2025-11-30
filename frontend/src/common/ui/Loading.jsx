import React from 'react';

export default function Loading({ text = 'Yükleniyor...' }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-slate-700 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-transparent border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
      <p className="mt-4 text-slate-300">{text}</p>
    </div>
  );
}
