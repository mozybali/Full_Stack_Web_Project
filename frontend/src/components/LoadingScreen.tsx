/**
 * Yükleme Ekranı Component'i
 * 
 * Uygulama genelinde kullanılan standart yükleme ekranı.
 * Merkezi bir loading UI sağlayarak tutarlılık oluşturur.
 * 
 * Özellikler:
 * - Dönen yükleme ikonu (spinner)
 * - Özelleştirilebilir mesaj
 * - Merkezi ve tam ekran görünüm
 * 
 * Kullanım:
 * <LoadingScreen />
 * <LoadingScreen message="Veriler yükleniyor..." />
 * 
 * @param {LoadingScreenProps} props - Component özellikleri
 */
import React from 'react';

/**
 * LoadingScreen props tipi
 */
interface LoadingScreenProps {
  message?: string; // Gösterilecek mesaj (varsayılan: "Yükleniyor...")
}

/**
 * Uygulama genelinde kullanılan yükleme ekranı component'i
 * Tutarlı UI/UX sağlıyor
 */
const LoadingScreen: React.FC<LoadingScreenProps> = ({ message = 'Yükleniyor...' }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 dark:border-primary-400 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">{message}</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
