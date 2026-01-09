import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { RoleNames } from '../types';
import { FaBox, FaGamepad, FaUsers, FaShoppingBag, FaTachometerAlt, FaShieldAlt } from 'react-icons/fa';

// Admin panelinin alt bileşenleri
import Dashboard from '../components/admin/Dashboard';
import AdminProducts from '../components/admin/AdminProducts.tsx';
import AdminGames from '../components/admin/AdminGames.tsx';
import AdminOrders from '../components/admin/AdminOrders.tsx';
import AdminUsers from '../components/admin/AdminUsers.tsx';
import AdminRoles from '../components/admin/AdminRoles.tsx';

type TabType = 'dashboard' | 'products' | 'games' | 'orders' | 'users' | 'roles';

const Admin: React.FC = () => {
  const { hasRole } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  const isAdmin = hasRole(RoleNames.ADMIN);

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Dashboard', icon: FaTachometerAlt, adminOnly: false },
    { id: 'products' as TabType, label: 'Ürünler', icon: FaShoppingBag, adminOnly: false },
    { id: 'orders' as TabType, label: 'Siparişler', icon: FaBox, adminOnly: false },
    { id: 'games' as TabType, label: 'Oyunlar', icon: FaGamepad, adminOnly: true },
    { id: 'users' as TabType, label: 'Kullanıcılar', icon: FaUsers, adminOnly: true },
    { id: 'roles' as TabType, label: 'Roller', icon: FaShieldAlt, adminOnly: true },
  ].filter(tab => !tab.adminOnly || isAdmin);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-8">
          {isAdmin ? 'Admin Paneli' : 'Satıcı Paneli'}
        </h1>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex -mb-px">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-6 py-4 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
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
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'products' && <AdminProducts />}
            {activeTab === 'games' && isAdmin && <AdminGames />}
            {activeTab === 'orders' && isAdmin && <AdminOrders />}
            {activeTab === 'users' && isAdmin && <AdminUsers />}
            {activeTab === 'roles' && isAdmin && <AdminRoles />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
