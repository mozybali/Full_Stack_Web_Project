import React from 'react';

/**
 * Input component props tipi
 */
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string; // Input etiketi
  error?: string; // Hata mesajı
}

/**
 * Reusable Input Component
 * 
 * Form inputları için kullanılan, label ve hata mesajı desteği olan component.
 * 
 * Özellikler:
 * - Opsiyonel label
 * - Hata durumu gösterimi
 * - Focus state
 * - Tüm HTML input özellikleri
 * 
 * Kullanım:
 * <Input 
 *   label="Email"
 *   type="email"
 *   error="Geçersiz email"
 *   value={email}
 *   onChange={handleChange}
 * />
 * 
 * @param {InputProps} props - Input özellikleri
 */
export const Input: React.FC<InputProps> = ({
  label,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};
