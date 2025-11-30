import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';

export default function DashboardLayout() {
  return (
    <div className="min-h-screen flex">
      <aside className="w-60 bg-slate-900 border-r border-slate-800 p-4 space-y-2">
        <h2 className="text-lg font-semibold mb-4 text-indigo-400">
          Admin Panel
        </h2>
        <nav className="flex flex-col gap-2 text-sm">
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `px-2 py-1 rounded-md hover:bg-slate-800 ${
                isActive ? 'bg-slate-800 text-indigo-300' : ''
              }`
            }
          >
            Genel Bakış
          </NavLink>
          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `px-2 py-1 rounded-md hover:bg-slate-800 ${
                isActive ? 'bg-slate-800 text-indigo-300' : ''
              }`
            }
          >
            Kullanıcılar
          </NavLink>
          <NavLink
            to="/admin/products"
            className={({ isActive }) =>
              `px-2 py-1 rounded-md hover:bg-slate-800 ${
                isActive ? 'bg-slate-800 text-indigo-300' : ''
              }`
            }
          >
            Ürünler
          </NavLink>
          <NavLink
            to="/orders"
            className={({ isActive }) =>
              `px-2 py-1 rounded-md hover:bg-slate-800 ${
                isActive ? 'bg-slate-800 text-indigo-300' : ''
              }`
            }
          >
            Siparişler
          </NavLink>
        </nav>
      </aside>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
