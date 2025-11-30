import React, { useEffect } from 'react';
import { useError } from '../context/ErrorContext';
import { Alert } from '../ui';

/**
 * Hata Bildirimi Bileşeni
 * ErrorContext'teki hatayı ekranda gösterir
 * 5 saniye sonra otomatik kapatılır
 */
export function ErrorNotification() {
  const { error, clearError } = useError();

  /**
   * Hata gösterildiğinde 5 saniye sonra otomatik temizle
   */
  useEffect(() => {
    if (error) {
      // 5 saniye sonra hatayı temizle
      const timer = setTimeout(clearError, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  // Hata yoksa hiçbir şey gösterme
  if (!error) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      <Alert
        type={error.type}
        message={error.message}
        onClose={clearError}
      />
    </div>
  );
}
