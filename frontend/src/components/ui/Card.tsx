import React from 'react';

/**
 * Card component props tipi
 */
interface CardProps {
  children: React.ReactNode; // Card içeriği
  className?: string; // Ek CSS class'ları
  padding?: 'none' | 'sm' | 'md' | 'lg'; // İç boşluk boyutu
}

/**
 * Reusable Card Component
 * 
 * İçeriği güzel bir kart içinde gösterir.
 * 
 * Padding seçenekleri:
 * - none: Padding yok
 * - sm: 1rem (16px)
 * - md: 1.5rem (24px) - varsayılan
 * - lg: 2rem (32px)
 * 
 * Kullanım:
 * <Card padding="lg">
 *   <h3>Başlık</h3>
 *   <p>İçerik</p>
 * </Card>
 * 
 * @param {CardProps} props - Card özellikleri
 */
export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'md',
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div className={`bg-white rounded-lg shadow-md ${paddingClasses[padding]} ${className}`}>
      {children}
    </div>
  );
};
