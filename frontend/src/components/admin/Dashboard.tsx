/**
 * Admin Dashboard Component
 * Satışlar, siparişler, ürünler ve diğer istatistiklerin özeti
 */

import React, { useState, useEffect } from 'react';
import { productService } from '../../services/product.service';
import { orderService } from '../../services/order.service';
import { userService } from '../../services/user.service';
import { gameService } from '../../services/game.service';
import type { Product, Order, User, Game } from '../../types';
import { FaBox, FaShoppingCart, FaUsers, FaGamepad, FaDollarSign } from 'react-icons/fa';

interface StatCard {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  subtext?: string;
}

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productsData, ordersData, usersData, gamesData] = await Promise.all([
        productService.getAll(),
        orderService.getAll(0, 100),
        userService.getAll(),
        gameService.getAll(),
      ]);
      setProducts(productsData);
      setOrders(ordersData);
      setUsers(usersData);
      setGames(gamesData);
    } catch (error) {
      console.error('Dashboard veri yükleme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Yükleniyor...</div>;
  }

  const totalRevenue = orders
    .filter((o) => o.status === 'COMPLETED')
    .reduce((sum, order) => sum + order.totalPrice, 0);

  const completedOrders = orders.filter((o) => o.status === 'COMPLETED').length;
  const pendingOrders = orders.filter((o) => o.status === 'PENDING').length;

  const stats: StatCard[] = [
    {
      title: 'Toplam Gelir',
      value: `₺${totalRevenue.toFixed(2)}`,
      icon: <FaDollarSign className="text-3xl" />,
      color: 'bg-green-50 border-green-200',
      subtext: 'Tamamlanan siparişlar',
    },
    {
      title: 'Toplam Siparişler',
      value: orders.length,
      icon: <FaShoppingCart className="text-3xl" />,
      color: 'bg-blue-50 border-blue-200',
      subtext: `${pendingOrders} beklemede`,
    },
    {
      title: 'Toplam Ürünler',
      value: products.length,
      icon: <FaBox className="text-3xl" />,
      color: 'bg-purple-50 border-purple-200',
      subtext: `${games.length} oyun`,
    },
    {
      title: 'Toplam Kullanıcılar',
      value: users.length,
      icon: <FaUsers className="text-3xl" />,
      color: 'bg-orange-50 border-orange-200',
      subtext: 'Platform üyeleri',
    },
  ];

  // En çok satılan ürünler
  const topProducts = products.slice(0, 5);

  // Son siparişler
  const recentOrders = orders.slice(0, 5);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`border rounded-lg p-6 ${stat.color}`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                {stat.subtext && (
                  <p className="text-xs text-gray-500 mt-2">{stat.subtext}</p>
                )}
              </div>
              <div className="text-gray-400 opacity-50">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Son Siparişler */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold mb-4">Son Siparişler</h3>
          <div className="space-y-3">
            {recentOrders.length === 0 ? (
              <p className="text-gray-500 text-sm">Sipariş bulunmamaktadır</p>
            ) : (
              recentOrders.map((order) => (
                <div key={order.id} className="flex justify-between items-center pb-3 border-b last:border-b-0">
                  <div>
                    <p className="font-medium">#{order.id}</p>
                    <p className="text-sm text-gray-600">{order.buyer.username}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₺{Number(order.totalPrice).toFixed(2)}</p>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        order.status === 'COMPLETED'
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'PENDING'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* En Çok Satılan Ürünler */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold mb-4">Ürünler</h3>
          <div className="space-y-3">
            {topProducts.length === 0 ? (
              <p className="text-gray-500 text-sm">Ürün bulunmamaktadır</p>
            ) : (
              topProducts.map((product) => (
                <div key={product.id} className="flex justify-between items-center pb-3 border-b last:border-b-0">
                  <div>
                    <p className="font-medium">{product.title}</p>
                    <p className="text-sm text-gray-600">{product.game.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₺{Number(product.price).toFixed(2)}</p>
                    <p className="text-xs text-gray-600">Stok: {product.stock}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Hızlı İstatistikler */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-blue-900">Sistem İstatistikleri</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-blue-600">{completedOrders}</p>
            <p className="text-sm text-gray-600">Tamamlanan Sipariş</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-600">{pendingOrders}</p>
            <p className="text-sm text-gray-600">Beklemede</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-600">{products.filter((p) => p.stock === 0).length}</p>
            <p className="text-sm text-gray-600">Tükenen Ürün</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-600">{games.length}</p>
            <p className="text-sm text-gray-600">Toplam Oyun</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
