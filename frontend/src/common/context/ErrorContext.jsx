import React, { createContext, useState, useCallback } from 'react';

/**
 * Hata yönetimi context'i
 * Tüm uygulama boyunca hataları yönetmek için kullanılır
 */
export const ErrorContext = createContext();

/**
 * Hata Provider
 * Hata state'ini ve fonksiyonlarını sağlar
 */
export function ErrorProvider({ children }) {
  // Güncel hata state'i
  const [error, setError] = useState(null);

  /**
   * Hata göster
   * @param {string} message - Hata mesajı
   * @param {string} type - Hata tipi (error, warning, info)
   */
  const showError = useCallback((message, type = 'error') => {
    setError({ message, type, id: Date.now() });
  }, []);

  /**
   * Hata temizle
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <ErrorContext.Provider value={{ error, showError, clearError }}>
      {children}
    </ErrorContext.Provider>
  );
}

/**
 * useError hook'u
 * ErrorProvider içinde hata context'ine erişmek için kullanılır
 */
export function useError() {
  const context = React.useContext(ErrorContext);
  if (!context) {
    throw new Error('useError mutlaka ErrorProvider içinde kullanılmalıdır');
  }
  return context;
}
