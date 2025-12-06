import { useState, useMemo } from 'react';

/**
 * Filtreleme seçenekleri için tip tanımı
 */
interface UseFilterOptions<T> {
  items: T[]; // Filtrelenecek öğeler
  searchFields?: (keyof T)[]; // Arama yapılacak alan isimleri
}

/**
 * Generic filtreleme hook'u
 * 
 * Kullanım:
 * const { filteredItems, searchTerm, setSearchTerm, updateFilter, resetFilters } = useFilter({
 *   items: products,
 *   searchFields: ['title', 'description']
 * });
 * 
 * Özellikler:
 * - Metin arama (searchTerm)
 * - Çoklu filtre desteği (filters)
 * - Otomatik memoization (performans)
 * 
 * @param {UseFilterOptions<T>} options - Filtreleme ayarları
 * @returns {Object} Filtreleme fonksiyonları ve sonuçları
 */
export const useFilter = <T extends Record<string, any>>({
  items,
  searchFields = [],
}: UseFilterOptions<T>) => {
  // Arama metni state'i
  const [searchTerm, setSearchTerm] = useState('');
  // Ek filtreler için state (örn: selectedGame, selectedType)
  const [filters, setFilters] = useState<Partial<Record<keyof T, any>>>({});

  // Filtrelenmiş öğeleri hesapla (useMemo ile optimize edilmiş)
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // 1. Arama filtresi - searchTerm ile eşleşen öğeleri bul
      if (searchTerm && searchFields.length > 0) {
        const matchesSearch = searchFields.some(field => {
          const value = item[field];
          if (typeof value === 'string') {
            return value.toLowerCase().includes(searchTerm.toLowerCase());
          }
          if (typeof value === 'object' && value !== null) {
            return Object.values(value).some(v =>
              typeof v === 'string' && v.toLowerCase().includes(searchTerm.toLowerCase())
            );
          }
          return false;
        });
        if (!matchesSearch) return false;
      }

      // 2. Ek filtreler - Diğer filtreleme kriterlerini uygula
      for (const [key, filterValue] of Object.entries(filters)) {
        if (filterValue !== null && filterValue !== undefined && filterValue !== 'ALL') {
          if (item[key] !== filterValue) {
            return false;
          }
        }
      }

      return true;
    });
  }, [items, searchTerm, filters, searchFields]);

  // Tek bir filtreyi güncelle
  const updateFilter = (key: keyof T, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Tüm filtreleri sıfırla
  const resetFilters = () => {
    setSearchTerm('');
    setFilters({});
  };

  return {
    searchTerm,
    setSearchTerm,
    filters,
    updateFilter,
    resetFilters,
    filteredItems,
  };
};
