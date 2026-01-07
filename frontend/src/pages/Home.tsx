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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 dark:from-primary-700 dark:via-primary-800 dark:to-primary-900 text-white py-24">
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
                  className="w-full px-6 py-4 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-2 border-gray-200 dark:border-gray-700 text-lg focus:outline-none focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-400/50 focus:border-primary-500 dark:focus:border-primary-400 shadow-xl transition-all placeholder-gray-400 dark:placeholder-gray-500"
                />
                <FaSearch className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 text-xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ürünler Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100">Öne Çıkan Ürünler</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">En popüler oyun hesapları ve key'ler</p>
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
            <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-400 p-4 mb-8 rounded">
              <p className="text-red-700 dark:text-red-400 font-medium">Hata</p>
              <p className="text-red-600 dark:text-red-300 text-sm">{error}</p>
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
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container-custom">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900 dark:text-gray-100">
            Neden GamerMarkt?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card p-8 text-center hover:shadow-xl transition-shadow">
              <div className="flex justify-center mb-6">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-full">
                  <FaShieldAlt className="text-3xl text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                Güvenli Alışveriş
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Tüm işlemleriniz SSL şifrelemesi ile korunmaktadır
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card p-8 text-center hover:shadow-xl transition-shadow">
              <div className="flex justify-center mb-6">
                <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-full">
                  <FaRocket className="text-3xl text-green-600 dark:text-green-400" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                Hızlı Teslimat
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Ürünleriniz ödemenin ardından anında teslim edilir
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card p-8 text-center hover:shadow-xl transition-shadow">
              <div className="flex justify-center mb-6">
                <div className="bg-yellow-100 dark:bg-yellow-900/30 p-4 rounded-full">
                  <FaCheckCircle className="text-3xl text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                %100 Garantili
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
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
