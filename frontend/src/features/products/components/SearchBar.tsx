import React from 'react';
import { FaSearch } from 'react-icons/fa';

/**
 * SearchBar component props tipi
 */
interface SearchBarProps {
  value: string; // Arama değeri
  onChange: (value: string) => void; // Değişiklik callback'i
  placeholder?: string; // Placeholder metni
  className?: string; // Ek CSS class'ları
}

/**
 * Search Bar Component
 * 
 * Arama yapmak için kullanılan input bileşeni.
 * Arama ikonu ile birlikte gelir.
 * 
 * Kullanım:
 * <SearchBar 
 *   value={searchTerm}
 *   onChange={setSearchTerm}
 *   placeholder="Ürün ara..."
 * />
 * 
 * @param {SearchBarProps} props - SearchBar özellikleri
 */
export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Ara...',
  className = '',
}) => {
  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      />
      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
    </div>
  );
};
