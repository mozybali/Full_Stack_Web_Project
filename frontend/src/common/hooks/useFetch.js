import { useState, useCallback } from 'react';

/**
 * API çağrıları için custom hook
 * Yükleme durumu ve hataları yönetir
 * 
 * @returns {Object} - { yüklemeDurumu, hata, çalıştır, hatayıTemizle }
 */
export function useFetch() {
  // API çağrısı sırasında yükleme durumu
  const [loading, setLoading] = useState(false);
  // API çağrısında oluşan hata
  const [error, setError] = useState(null);

  /**
   * API çağrısını yürüt
   * @param {Function} apiCall - Çalıştırılacak API fonksiyonu
   * @returns {Promise} - API'den dönen veri
   */
  const execute = useCallback(async (apiCall) => {
    setLoading(true);
    setError(null);
    try {
      // API çağrısını yap
      const response = await apiCall();
      return response.data;
    } catch (err) {
      // Hata mesajını ayıkla
      const message = err.response?.data?.message || err.message;
      setError(message);
      throw err;
    } finally {
      // Yükleme tamamlandı
      setLoading(false);
    }
  }, []);

  /**
   * Hata durumunu temizle
   */
  const clearError = useCallback(() => setError(null), []);

  return { loading, error, execute, clearError };
}
