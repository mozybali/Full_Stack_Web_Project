/**
 * Navbar Component
 * 
 * Uygulamanın üst navigasyon çubuğu.
 * 
 * Özellikler:
 * - Logo ve ana navigasyon linkleri
 * - Kullanıcı durumuna göre dinamik menü (giriş yapmış/yapmamış)
 * - Sepet ikonu ve ürün sayısı
 * - Admin paneli erişimi (SELLER rolü için)
 * - Responsive tasarım
 * 
 * Kullanılan Context'ler:
 * - useAuth: Kullanıcı bilgisi ve yetkilendirme
 * - useCart: Sepet bilgisi
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FaShoppingCart, FaUser, FaSignOutAlt, FaHome, FaGamepad, FaShoppingBag, FaCog } from 'react-icons/fa';
import { RoleNames } from '../types';

const Navbar: React.FC = () => {
  // Auth context'ten kullanıcı bilgisi ve fonksiyonları al
  const { user, isAuthenticated, logout, hasRole } = useAuth();
  // Cart context'ten sepet bilgilerini al
  const { getTotalItems } = useCart();

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-primary-600">
              <FaGamepad />
              <span>GamerMarkt</span>
            </Link>
            
            <div className="hidden md:flex space-x-4">
              <Link to="/" className="flex items-center space-x-1 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 hover:text-primary-600 transition-colors">
                <FaHome />
                <span>Ana Sayfa</span>
              </Link>
              <Link to="/products" className="flex items-center space-x-1 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 hover:text-primary-600 transition-colors">
                <FaShoppingBag />
                <span>Ürünler</span>
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/cart" className="relative p-2 text-gray-700 hover:text-primary-600 transition-colors">
                  <FaShoppingCart size={24} />
                  {getTotalItems() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {getTotalItems()}
                    </span>
                  )}
                </Link>

                <Link to="/orders" className="px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 hover:text-primary-600 transition-colors">
                  Siparişlerim
                </Link>

                {(hasRole(RoleNames.ADMIN) || hasRole(RoleNames.SELLER)) && (
                  <Link to="/admin" className="flex items-center space-x-1 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 hover:text-primary-600 transition-colors">
                    <FaCog />
                    <span>Yönetim</span>
                  </Link>
                )}

                <div className="flex items-center space-x-2 px-3 py-2 rounded-md bg-gray-100">
                  <FaUser />
                  <span className="text-sm font-medium">{user?.username}</span>
                </div>

                <button
                  onClick={logout}
                  className="flex items-center space-x-1 px-3 py-2 rounded-md text-white bg-red-500 hover:bg-red-600 transition-colors"
                >
                  <FaSignOutAlt />
                  <span>Çıkış</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors">
                  Giriş Yap
                </Link>
                <Link to="/register" className="btn-primary">
                  Kayıt Ol
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
