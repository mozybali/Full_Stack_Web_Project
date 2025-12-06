import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

/**
 * Ana layout props tipi
 */
interface MainLayoutProps {
  children: React.ReactNode; // Sayfa içeriği
}

/**
 * Ana Layout Component
 * 
 * Tüm sayfaları saran, Navbar ve Footer içeren layout bileşeni.
 * App.tsx'te kullanılır ve tüm route'ları sarar.
 * 
 * Kullanım:
 * <MainLayout>
 *   <YourPageContent />
 * </MainLayout>
 * 
 * @param {MainLayoutProps} props - Layout özellikleri
 */
export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};
