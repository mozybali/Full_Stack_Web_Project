import React from 'react';

/**
 * Loading spinner props tipi
 */
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'; // Spinner boyutu
  className?: string; // Ek CSS class'ları
}

/**
 * Loading Spinner Component
 * 
 * Yükleme durumunu göstermek için animasyonlu spinner.
 * 
 * Boyutlar:
 * - sm: 24px
 * - md: 48px (varsayılan)
 * - lg: 64px
 * 
 * Kullanım:
 * {loading && <LoadingSpinner size="lg" />}
 * 
 * @param {LoadingSpinnerProps} props - Spinner özellikleri
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  return (
    <div className="flex justify-center items-center py-8">
      <div
        className={`animate-spin rounded-full border-b-2 border-primary-600 ${sizeClasses[size]} ${className}`}
      />
    </div>
  );
};
