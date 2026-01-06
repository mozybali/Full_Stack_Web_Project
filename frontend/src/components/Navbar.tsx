/**
 * Navbar Component
 *
 * Uygulamanın üst navigasyon çubuğu.
 * - Dinamik kullanıcı menüsü
 * - Sepet yönetimi
 * - Rol bazlı erişim (Admin/Seller)
 * - Responsive tasarım
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { FaShoppingCart, FaUser, FaSignOutAlt, FaHome, FaGamepad, FaShoppingBag, FaCog, FaMoon, FaSun } from 'react-icons/fa';
import { RoleNames } from '../types';
import { ROUTES } from '../config';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout, hasRole } = useAuth();
  const { getTotalItems } = useCart();
  const { theme, toggleTheme } = useTheme();
  const cartItems = getTotalItems();

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-lg sticky top-0 z-50 transition-colors">
      <div className="container-custom">
        <div className="flex justify-between items-center h-16">
          {/* Logo ve Sol Menü */}
          <div className="flex items-center space-x-8">
            <Link
              to={ROUTES.HOME}
              className="flex items-center space-x-2 text-2xl font-bold text-primary-600 dark:text-primary-300 hover:text-primary-700 dark:hover:text-primary-200 transition-colors"
            >
              <FaGamepad className="text-3xl" />
              <span>GamerMarkt</span>
            </Link>

            {/* Desktop Navigasyon */}
            <div className="hidden md:flex items-center space-x-1">
              <Link
                to={ROUTES.HOME}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-900 dark:text-gray-50 hover:bg-primary-50 dark:hover:bg-gray-800 hover:text-primary-600 dark:hover:text-primary-300 transition-all"
              >
                <FaHome />
                <span>Ana Sayfa</span>
              </Link>
              <Link
                to={ROUTES.PRODUCTS}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-900 dark:text-gray-50 hover:bg-primary-50 dark:hover:bg-gray-800 hover:text-primary-600 dark:hover:text-primary-300 transition-all"
              >
                <FaShoppingBag />
                <span>Ürünler</span>
              </Link>
            </div>
          </div>

          {/* Sağ Menü */}
          <div className="flex items-center space-x-3">
            {/* Tema Toggle Butonu */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-900 dark:text-gray-50 hover:text-primary-600 dark:hover:text-primary-300 hover:bg-primary-50 dark:hover:bg-gray-800 rounded-lg transition-all"
              aria-label="Tema Değiştir"
            >
              {theme === 'light' ? <FaMoon className="text-xl" /> : <FaSun className="text-xl" />}
            </button>

            {isAuthenticated ? (
              <>
                {/* Sepet */}
                <Link
                  to={ROUTES.CART}
                  className="relative p-2 text-gray-900 dark:text-gray-50 hover:text-primary-600 dark:hover:text-primary-300 hover:bg-primary-50 dark:hover:bg-gray-800 rounded-lg transition-all"
                >
                  <FaShoppingCart className="text-2xl" />
                  {cartItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex-center animate-scale-in">
                      {cartItems}
                    </span>
                  )}
                </Link>

                {/* Siparişlerim */}
                <Link
                  to={ROUTES.ORDERS}
                  className="hidden sm:block px-4 py-2 rounded-lg text-gray-900 dark:text-gray-50 hover:bg-primary-50 dark:hover:bg-gray-800 hover:text-primary-600 dark:hover:text-primary-300 transition-all font-medium"
                >
                  Siparişlerim
                </Link>

                {/* Admin/Seller Paneli */}
                {(hasRole(RoleNames.ADMIN) || hasRole(RoleNames.SELLER)) && (
                  <Link
                    to={ROUTES.ADMIN}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-900 dark:text-gray-50 hover:bg-primary-50 dark:hover:bg-gray-800 hover:text-primary-600 dark:hover:text-primary-300 transition-all font-medium"
                  >
                    <FaCog />
                    <span className="hidden lg:block">Yönetim</span>
                  </Link>
                )}

                {/* Kullanıcı Bilgisi */}
                <div className="hidden md:flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-50">
                  <FaUser className="text-primary-600 dark:text-primary-300" />
                  <span className="text-sm font-semibold">{user?.username}</span>
                </div>

                {/* Çıkış Butonu */}
                <button
                  onClick={logout}
                  className="btn-danger flex items-center space-x-2"
                  aria-label="Çıkış Yap"
                >
                  <FaSignOutAlt />
                  <span className="hidden sm:block">Çıkış</span>
                </button>
              </>
            ) : (
              <>
                {/* Giriş Yap */}
                <Link
                  to={ROUTES.LOGIN}
                  className="px-4 py-2 rounded-lg text-gray-900 dark:text-gray-50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all font-medium"
                >
                  Giriş Yap
                </Link>
                {/* Kayıt Ol */}
                <Link to={ROUTES.REGISTER} className="btn-primary">
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
