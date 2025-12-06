import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaArrowLeft } from 'react-icons/fa';

/**
 * 404 Bulunamadı Sayfası
 * 
 * Kullanıcı mevcut olmayan bir sayfaya erişmeye çalıştığında gösterilir.
 * Ana sayfaya veya geriye dönmek için linkler içerir.
 */
const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center px-4">
      <div className="text-center">
        {/* 404 Büyük Yazı */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600 mb-2">
            404
          </h1>
          <div className="text-6xl mb-4">🎮</div>
        </div>

        {/* Başlık ve Açıklama */}
        <h2 className="text-4xl font-bold text-white mb-4">Sayfa Bulunamadı</h2>
        <p className="text-xl text-gray-400 mb-2">
          Aradığınız sayfa maalesef mevcut değil.
        </p>
        <p className="text-gray-500 mb-12">
          URL'yi kontrol edin veya ana sayfaya dönün.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <FaHome size={20} />
            <span>Ana Sayfaya Dön</span>
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition-all duration-300 border border-gray-600"
          >
            <FaArrowLeft size={20} />
            <span>Geriye Dön</span>
          </button>
        </div>

        {/* İnfografik */}
        <div className="mt-16 pt-16 border-t border-gray-700">
          <p className="text-gray-500 text-sm mb-6">
            Sizin için faydalı olabilecek sayfalar:
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/products"
              className="text-primary-400 hover:text-primary-300 transition-colors"
            >
              Ürünler
            </Link>
            <span className="text-gray-600">•</span>
            <Link
              to="/cart"
              className="text-primary-400 hover:text-primary-300 transition-colors"
            >
              Sepet
            </Link>
            <span className="text-gray-600">•</span>
            <Link
              to="/login"
              className="text-primary-400 hover:text-primary-300 transition-colors"
            >
              Giriş Yap
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
