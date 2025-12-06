import React from 'react';

/**
 * Sayfa container props tipi
 */
interface PageContainerProps {
  children: React.ReactNode; // Sayfa içeriği
  className?: string; // Ek CSS class'ları
}

/**
 * Sayfa Container Component
 * 
 * Sayfa içeriklerini merkezi bir container'da gösterir.
 * Max-width, padding ve responsive davranış sağlar.
 * 
 * Özellikler:
 * - Max-width: 7xl (1280px)
 * - Responsive padding
 * - Merkezi hizalama
 * 
 * Kullanım:
 * <PageContainer>
 *   <h1>Sayfa İçeriği</h1>
 * </PageContainer>
 * 
 * @param {PageContainerProps} props - Container özellikleri
 */
export const PageContainer: React.FC<PageContainerProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${className}`}>
      {children}
    </div>
  );
};
