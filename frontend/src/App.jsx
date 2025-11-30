import React from 'react';
import { ErrorProvider } from './common/context/ErrorContext';
import { ErrorBoundary } from './common/components/ErrorBoundary';
import { ErrorNotification } from './common/components/ErrorNotification';
import NotificationCenter from './common/components/NotificationCenter';
import GlobalLoader from './common/components/GlobalLoader';
import AppRouter from './router';

/**
 * Ana uygulama bileşeni
 * Tüm global provider'ları ve layout'ları içerir
 */
export default function App() {
  return (
    <ErrorBoundary>
      {/* Hata yönetimi context'i */}
      <ErrorProvider>
        {/* Uygulamanın ana router'ı */}
        <AppRouter />
        
        {/* Hata bildirimleri göstericisi */}
        <ErrorNotification />
        
        {/* Bildirim merkezi (toast messages) */}
        <NotificationCenter />
        
        {/* Küresel yükleme göstericisi */}
        <GlobalLoader />
      </ErrorProvider>
    </ErrorBoundary>
  );
}
