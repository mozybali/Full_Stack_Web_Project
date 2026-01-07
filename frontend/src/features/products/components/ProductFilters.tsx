import React from 'react';
import type { Game, ProductType } from '../../../types';

/**
 * Ürün filtreleme props tipi
 */
interface ProductFiltersProps {
  games: Game[]; // Oyun listesi
  selectedGame: number | null; // Seçili oyun ID'si
  onGameChange: (gameId: number | null) => void; // Oyun değişiklik callback'i
  selectedType: ProductType | 'ALL'; // Seçili ürün tipi
  onTypeChange: (type: ProductType | 'ALL') => void; // Tip değişiklik callback'i
}

/**
 * Product Filters Component
 * 
 * Ürünleri oyun ve tip'e göre filtrelemek için kullanılan component.
 * 
 * Filtreler:
 * - Oyun seçimi (dropdown)
 * - Ürün tipi seçimi (ACCOUNT/KEY/ALL)
 * 
 * Kullanım:
 * <ProductFilters 
 *   games={games}
 *   selectedGame={selectedGame}
 *   onGameChange={setSelectedGame}
 *   selectedType={selectedType}
 *   onTypeChange={setSelectedType}
 * />
 * 
 * @param {ProductFiltersProps} props - Filter özellikleri
 */
export const ProductFilters: React.FC<ProductFiltersProps> = ({
  games,
  selectedGame,
  onGameChange,
  selectedType,
  onTypeChange,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Oyun
        </label>
        <select
          value={selectedGame || ''}
          onChange={(e) => onGameChange(e.target.value ? Number(e.target.value) : null)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">Tüm Oyunlar</option>
          {games.map(game => (
            <option key={game.id} value={game.id}>
              {game.name} ({game.platform})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Tip
        </label>
        <select
          value={selectedType}
          onChange={(e) => onTypeChange(e.target.value as ProductType | 'ALL')}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="ALL">Hepsi</option>
          <option value="ACCOUNT">Hesap</option>
          <option value="KEY">Key</option>
        </select>
      </div>
    </div>
  );
};
