import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { productService } from '../services/product.service';
import { gameService } from '../services/game.service';
import type { Product, Game, ProductType } from '../types';
import { FaSearch, FaFilter } from 'react-icons/fa';

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGame, setSelectedGame] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState<ProductType | 'ALL'>('ALL');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productsData, gamesData] = await Promise.all([
        productService.getAll(),
        gameService.getAll(),
      ]);
      setProducts(productsData.filter(p => p.isActive));
      setGames(gamesData);
    } catch (error) {
      console.error('Veriler yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.game.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGame = !selectedGame || product.game.id === selectedGame;
    const matchesType = selectedType === 'ALL' || product.type === selectedType;
    return matchesSearch && matchesGame && matchesType;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Tüm Ürünler</h1>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaSearch className="inline mr-2" />
                Ara
              </label>
              <input
                type="text"
                placeholder="Ürün veya oyun ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaFilter className="inline mr-2" />
                Oyun
              </label>
              <select
                value={selectedGame || ''}
                onChange={(e) => setSelectedGame(e.target.value ? Number(e.target.value) : null)}
                className="input-field"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tip
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as ProductType | 'ALL')}
                className="input-field"
              >
                <option value="ALL">Hepsi</option>
                <option value="ACCOUNT">Hesap</option>
                <option value="KEY">Key</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredProducts.length > 0 ? (
          <>
            <p className="text-gray-600 mb-4">
              {filteredProducts.length} ürün bulundu
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">Aradığınız kriterlere uygun ürün bulunamadı.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
