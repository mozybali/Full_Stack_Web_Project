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
import { FaShoppingCart, FaUser, FaSignOutAlt, FaHome, FaGamepad, FaShoppingBag, FaCog } from 'react-icons/fa';
import { RoleNames } from '../types';
import { ROUTES } from '../config';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout, hasRole } = useAuth();
  const { getTotalItems } = useCart();
  const cartItems = getTotalItems();

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex justify-between items-center h-16">
          {/* Logo ve Sol Menü */}
          <div className="flex items-center space-x-8">
            <Link
              to={ROUTES.HOME}
              className="flex items-center space-x-2 text-2xl font-bold text-primary-600 hover:text-primary-700 transition-colors"
            >
              <FaGamepad className="text-3xl" />
              <span>GamerMarkt</span>
            </Link>

            {/* Desktop Navigasyon */}
            <div className="hidden md:flex items-center space-x-1">
              <Link
                to={ROUTES.HOME}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-all"
              >
                <FaHome />
                <span>Ana Sayfa</span>
              </Link>
              <Link
                to={ROUTES.PRODUCTS}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-all"
              >
                <FaShoppingBag />
                <span>Ürünler</span>
              </Link>
            </div>
          </div>

          {/* Sağ Menü */}
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                {/* Sepet */}
                <Link
                  to={ROUTES.CART}
                  className="relative p-2 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
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
                  className="hidden sm:block px-4 py-2 rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-all font-medium"
                >
                  Siparişlerim
                </Link>

                {/* Admin/Seller Paneli */}
                {(hasRole(RoleNames.ADMIN) || hasRole(RoleNames.SELLER)) && (
                  <Link
                    to={ROUTES.ADMIN}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-all font-medium"
                  >
                    <FaCog />
                    <span className="hidden lg:block">Yönetim</span>
                  </Link>
                )}

                {/* Kullanıcı Bilgisi */}
                <div className="hidden md:flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-800">
                  <FaUser className="text-primary-600" />
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
                  className="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-all font-medium"
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
