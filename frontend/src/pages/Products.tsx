/**
 * Ürünler Sayfası (Products Page)
 * 
 * Tüm ürünlerin listelendiği sayfa.
 * Arama ve filtreleme özellikleri içerir.
 * 
 * Filtreler:
 * - Metin arama (ürün adı veya oyun adı)
 * - Oyuna göre filtreleme
 * - Ürün tipine göre filtreleme (ACCOUNT/KEY)
 * 
 * Kullanılan modüller:
 * - useProducts: Ürün verilerini yönetir
 * - useGames: Oyun listesini getirir
 * - SearchBar: Arama bileşeni
 * - ProductFilters: Filtreleme bileşenleri
 * - ProductGrid: Ürün grid görünümü
 */

import React, { useState, useMemo } from 'react';
import { useProducts, useGames } from '../hooks';
import { SearchBar, ProductFilters, ProductGrid } from '../features/products';
import { PageContainer } from '../layouts';
import type { ProductType } from '../types';

const Products: React.FC = () => {
  // Custom hook'lar ile veri yönetimi
  const { activeProducts, loading: productsLoading } = useProducts();
  const { games, loading: gamesLoading } = useGames();
  
  // Filtre state'leri
  const [searchTerm, setSearchTerm] = useState(''); // Arama terimi
  const [selectedGame, setSelectedGame] = useState<number | null>(null); // Seçili oyun
  const [selectedType, setSelectedType] = useState<ProductType | 'ALL'>('ALL'); // Seçili ürün tipi

  // Tüm filtreleri uygula (memoized)
  const filteredProducts = useMemo(() => {
    return activeProducts.filter(product => {
      // 1. Metin araması kontrolü
      const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.game.name.toLowerCase().includes(searchTerm.toLowerCase());
      // 2. Oyun filtresi kontrolü
      const matchesGame = !selectedGame || product.game.id === selectedGame;
      // 3. Ürün tipi filtresi kontrolü
      const matchesType = selectedType === 'ALL' || product.type === selectedType;
      // Tüm kriterlere uyuyorsa göster
      return matchesSearch && matchesGame && matchesType;
    });
  }, [activeProducts, searchTerm, selectedGame, selectedType]);

  // Herhangi bir veri yükleniyorsa loading true
  const loading = productsLoading || gamesLoading;

  return (
    <div className="min-h-screen bg-gray-50">
      <PageContainer>
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Tüm Ürünler</h1>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 space-y-4">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Ürün veya oyun ara..."
          />
          
          <ProductFilters
            games={games}
            selectedGame={selectedGame}
            onGameChange={setSelectedGame}
            selectedType={selectedType}
            onTypeChange={setSelectedType}
          />
        </div>

        {/* Results */}
        {!loading && filteredProducts.length > 0 && (
          <p className="text-gray-600 mb-4">
            {filteredProducts.length} ürün bulundu
          </p>
        )}

        <ProductGrid
          products={filteredProducts}
          loading={loading}
          emptyMessage="Aradığınız kriterlere uygun ürün bulunamadı."
        />
      </PageContainer>
    </div>
  );
};

export default Products;
