import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { RoleNames } from '../types';
import { FaBox, FaGamepad, FaUsers, FaShoppingBag } from 'react-icons/fa';

// Admin panelinin alt bileşenleri
import AdminProducts from '../components/admin/AdminProducts.tsx';
import AdminGames from '../components/admin/AdminGames.tsx';
import AdminOrders from '../components/admin/AdminOrders.tsx';
import AdminUsers from '../components/admin/AdminUsers.tsx';

type TabType = 'products' | 'games' | 'orders' | 'users';

const Admin: React.FC = () => {
  const { hasRole } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('products');

  const isAdmin = hasRole(RoleNames.ADMIN);

  const tabs = [
    { id: 'products' as TabType, label: 'Ürünler', icon: FaShoppingBag, adminOnly: false },
    { id: 'games' as TabType, label: 'Oyunlar', icon: FaGamepad, adminOnly: true },
    { id: 'orders' as TabType, label: 'Siparişler', icon: FaBox, adminOnly: true },
    { id: 'users' as TabType, label: 'Kullanıcılar', icon: FaUsers, adminOnly: true },
  ].filter(tab => !tab.adminOnly || isAdmin);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {isAdmin ? 'Admin Paneli' : 'Satıcı Paneli'}
        </h1>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-6 py-4 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-primary-600 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'products' && <AdminProducts />}
            {activeTab === 'games' && isAdmin && <AdminGames />}
            {activeTab === 'orders' && isAdmin && <AdminOrders />}
            {activeTab === 'users' && isAdmin && <AdminUsers />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
