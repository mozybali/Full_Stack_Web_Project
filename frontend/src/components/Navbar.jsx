import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import useAuthStore from '../features/auth/useAuthStore';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="text-xl font-bold text-indigo-400">
          GameVault
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `hover:text-indigo-300 ${isActive ? 'text-indigo-400' : ''}`
            }
          >
            Mağaza
          </NavLink>
          {user && (
            <>
              <NavLink
                to="/cart"
                className={({ isActive }) =>
                  `hover:text-indigo-300 ${isActive ? 'text-indigo-400' : ''}`
                }
              >
                Sepet
              </NavLink>
              {user.roles?.includes('ADMIN') && (
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    `hover:text-indigo-300 ${
                      isActive ? 'text-indigo-400' : ''
                    }`
                  }
                >
                  Admin
                </NavLink>
              )}
            </>
          )}
        </nav>

        <div className="flex items-center gap-3 text-sm">
          {user ? (
            <>
              <span className="text-slate-300">Merhaba, {user.username}</span>
              <button
                onClick={handleLogout}
                className="px-3 py-1 rounded-md border border-slate-700 hover:bg-slate-800"
              >
                Çıkış
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-3 py-1 rounded-md border border-slate-700 hover:bg-slate-800"
              >
                Giriş
              </Link>
              <Link
                to="/register"
                className="px-3 py-1 rounded-md bg-indigo-500 hover:bg-indigo-600 text-white"
              >
                Kayıt Ol
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
