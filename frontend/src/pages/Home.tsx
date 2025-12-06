/**
 * Ana Sayfa (Home Page)
 * 
 * Uygulamanın giriş sayfası.
 * Hero section, arama ve öne çıkan ürünleri gösterir.
 * 
 * Özellikler:
 * - Hero banner
 * - Ürün arama
 * - Öne çıkan ürünler (ilk 8)
 * - Özellikler bölümü
 */

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../hooks';
import { ProductGrid } from '../features/products';
import { ROUTES } from '../config';
import { FaSearch } from 'react-icons/fa';

const Home: React.FC = () => {
  // Aktif ürünleri hook'tan al
  const { activeProducts, loading } = useProducts();
  // Arama terimi state'i
  const [searchTerm, setSearchTerm] = useState('');

  // Arama terimine göre ürünleri filtrele (memoized)
  const filteredProducts = useMemo(() => {
    return activeProducts.filter(product =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.game.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [activeProducts, searchTerm]);

  // İlk 8 ürünü öne çıkan olarak göster
  const featuredProducts = filteredProducts.slice(0, 8);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">GamerMarkt'a Hoş Geldiniz</h1>
            <p className="text-xl mb-8">Güvenilir oyun hesapları ve key'leri için en iyi marketplace</p>
            
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Oyun ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-6 py-4 rounded-lg text-gray-900 text-lg focus:outline-none focus:ring-2 focus:ring-white"
                />
                <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Öne Çıkan Ürünler</h2>
          <Link to={ROUTES.PRODUCTS} className="text-primary-600 hover:text-primary-700 font-semibold">
            Tümünü Gör →
          </Link>
        </div>

        <ProductGrid 
          products={featuredProducts} 
          loading={loading}
          emptyMessage="Henüz ürün bulunmamaktadır."
        />
      </div>

      {/* Features Section */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Neden GamerMarkt?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-bold mb-2">Güvenli Alışveriş</h3>
              <p className="text-gray-600">Tüm işlemleriniz SSL ile korunmaktadır</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold mb-2">Hızlı Teslimat</h3>
              <p className="text-gray-600">Ürünleriniz anında teslim edilir</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl mb-4">💯</div>
              <h3 className="text-xl font-bold mb-2">%100 Garantili</h3>
              <p className="text-gray-600">Tüm ürünlerimiz test edilmiştir</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
