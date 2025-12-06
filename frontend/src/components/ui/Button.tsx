import React from 'react';

/**
 * Button component props tipi
 */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success'; // Buton stili
  size?: 'sm' | 'md' | 'lg'; // Buton boyutu
  children: React.ReactNode; // Buton içeriği
}

/**
 * Reusable Button Component
 * 
 * Farklı stil ve boyutlarda buton oluşturmak için kullanılır.
 * 
 * Variant'lar:
 * - primary: Ana aksiyon (mavi)
 * - secondary: İkincil aksiyon (gri)
 * - danger: Tehlikeli aksiyon (kırmızı)
 * - success: Başarı aksiyonu (yeşil)
 * 
 * Boyutlar:
 * - sm: Küçük
 * - md: Orta (varsayılan)
 * - lg: Büyük
 * 
 * Kullanım:
 * <Button variant="primary" size="lg" onClick={handleClick}>
 *   Gönder
 * </Button>
 * 
 * @param {ButtonProps} props - Buton özellikleri
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) => {
  // Temel stil class'ları (her buton için geçerli)
  const baseClasses = 'font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    success: 'bg-green-600 text-white hover:bg-green-700',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
