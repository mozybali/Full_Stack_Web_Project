import React from 'react';

interface LoadingScreenProps {
  message?: string;
}

/**
 * Uygulama genelinde kullanılan yükleme ekranı component'i
 * Tutarlı UI/UX sağlıyor
 */
const LoadingScreen: React.FC<LoadingScreenProps> = ({ message = 'Yükleniyor...' }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mx-auto mb-4"></div>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
