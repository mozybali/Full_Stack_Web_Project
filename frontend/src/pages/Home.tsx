/**
 * Ana Sayfa (Home)
 *
 * Uygulamanın giriş sayfası.
 * - Hero banner ile arama
 * - Öne çıkan ürünler (ilk 8)
 * - Neden bizi seçmelisiniz bölümü
 */

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../hooks';
import { ProductGrid } from '../features/products';
import { ROUTES } from '../config';
import { FaSearch, FaShieldAlt, FaRocket, FaCheckCircle } from 'react-icons/fa';

const Home: React.FC = () => {
  const { activeProducts, loading, error } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');

  // Ürünleri arama terimine göre filtrele
  const filteredProducts = useMemo(() => {
    if (!activeProducts?.length) return [];
    
    return activeProducts.filter((product) => {
      // Güvenlik kontrolü
      if (!product?.game?.name || !product?.title) return false;
      
      const searchLower = searchTerm.toLowerCase();
      return (
        product.title.toLowerCase().includes(searchLower) ||
        product.game.name.toLowerCase().includes(searchLower)
      );
    });
  }, [activeProducts, searchTerm]);

  // İlk 8 ürünü göster
  const featuredProducts = filteredProducts.slice(0, 8);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 text-white py-24">
        <div className="container-custom">
          <div className="text-center">
            <h1 className="text-6xl font-bold mb-6 animate-fade-in">
              GamerMarkt'a Hoş Geldiniz
            </h1>
            <p className="text-xl text-primary-100 mb-12 max-w-2xl mx-auto">
              Güvenilir oyun hesapları ve key'leri için en iyi marketplace
            </p>

            {/* Arama Kutusu */}
            <div className="max-w-2xl mx-auto">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Oyun ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-6 py-4 rounded-lg text-gray-900 text-lg focus:outline-none focus:ring-4 focus:ring-white/50 shadow-xl transition-all"
                />
                <FaSearch className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ürünler Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900">Öne Çıkan Ürünler</h2>
              <p className="text-gray-600 mt-2">En popüler oyun hesapları ve key'ler</p>
            </div>
            <Link
              to={ROUTES.PRODUCTS}
              className="btn-primary text-lg"
            >
              Tümünü Gör →
            </Link>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded">
              <p className="text-red-700 font-medium">Hata</p>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Ürün Grid */}
          <ProductGrid
            products={featuredProducts}
            loading={loading}
            emptyMessage="Henüz ürün bulunmamaktadır"
          />
        </div>
      </section>

      {/* Neden Bizi Seçmelisiniz */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container-custom">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">
            Neden GamerMarkt?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card p-8 text-center hover:shadow-xl transition-shadow">
              <div className="flex justify-center mb-6">
                <div className="bg-blue-100 p-4 rounded-full">
                  <FaShieldAlt className="text-3xl text-blue-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Güvenli Alışveriş
              </h3>
              <p className="text-gray-600">
                Tüm işlemleriniz SSL şifrelemesi ile korunmaktadır
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card p-8 text-center hover:shadow-xl transition-shadow">
              <div className="flex justify-center mb-6">
                <div className="bg-green-100 p-4 rounded-full">
                  <FaRocket className="text-3xl text-green-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Hızlı Teslimat
              </h3>
              <p className="text-gray-600">
                Ürünleriniz ödemenin ardından anında teslim edilir
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card p-8 text-center hover:shadow-xl transition-shadow">
              <div className="flex justify-center mb-6">
                <div className="bg-yellow-100 p-4 rounded-full">
                  <FaCheckCircle className="text-3xl text-yellow-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                %100 Garantili
              </h3>
              <p className="text-gray-600">
                Tüm ürünlerimiz kapsamlı şekilde test edilmiştir
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
