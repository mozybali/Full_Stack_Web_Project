import React from 'react';
import useUIStore from '../../stores/useUIStore';

/**
 * Küresel Yükleme Göstericisi
 * Tüm sayfa boyunca API işlemlerinin yapıldığını gösterir
 */
export default function GlobalLoader() {
  const { isGlobalLoading } = useUIStore();

  // Yükleme yoksa hiçbir şey gösterme
  if (!isGlobalLoading) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
      <div className="flex flex-col items-center">
        {/* Dönen yükleme spinner'ı */}
        <div className="relative w-12 h-12 mb-4">
          <div className="absolute inset-0 rounded-full border-4 border-gray-300"></div>
          <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
        </div>
        {/* Yükleme metni */}
        <p className="text-white font-semibold">Yükleniyor...</p>
      </div>
    </div>
  );
}
