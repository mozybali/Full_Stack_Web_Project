import { useState, useEffect, useCallback } from 'react';

/**
 * Asenkron işlemler için custom hook
 * Yükleme durumu, başarı ve hata durumlarını yönetir
 * 
 * @param {Function} asyncFunction - Çalıştırılacak asenkron fonksiyon
 * @param {boolean} immediate - Hemen mi çalıştırılsın (varsayılan: true)
 * @returns {Object} - { execute, durum, değer, hata }
 */
export function useAsync(asyncFunction, immediate = true) {
  // Durumu takip et: 'idle', 'pending', 'success', 'error'
  const [status, setStatus] = useState('idle');
  // Fonksiyonun döndürdüğü değer
  const [value, setValue] = useState(null);
  // Hata bilgisi
  const [error, setError] = useState(null);

  /**
   * Asenkron fonksiyonu çalıştır
   */
  const execute = useCallback(async () => {
    setStatus('pending');
    setValue(null);
    setError(null);
    try {
      // Fonksiyonu çalıştır
      const response = await asyncFunction();
      setValue(response);
      setStatus('success');
      return response;
    } catch (err) {
      // Hata durumunda hatayı kaydet
      setError(err);
      setStatus('error');
      throw err;
    }
  }, [asyncFunction]);

  /**
   * Bileşen yüklendiğinde hemen çalıştırılacaksa çalıştır
   */
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { execute, status, value, error };
}
