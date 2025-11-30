import React, { useEffect } from 'react';
import { useProductStore } from '../catalog/store';
import { useGameStore } from './store';
import { useOrderStore } from '../orders/store';
import { Loading } from '../../common/ui';

export default function AdminDashboard() {
  const { products, loading: productsLoading } = useProductStore();
  const { games, loading: gamesLoading } = useGameStore();
  const { orders, loading: ordersLoading, fetchAllOrders } = useOrderStore();

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const loading = productsLoading || gamesLoading || ordersLoading;

  const stats = [
    { label: 'Toplam Ürün', value: products.length, icon: '📦' },
    { label: 'Toplam Oyun', value: games.length, icon: '🎮' },
    { label: 'Toplam Sipariş', value: orders.length, icon: '🛒' },
    {
      label: 'Tamamlanan',
      value: orders.filter((o) => o.status === 'COMPLETED').length,
      icon: '✓',
    },
    {
      label: 'Beklemede',
      value: orders.filter((o) => o.status === 'PENDING').length,
      icon: '⏳',
    },
  ];

  if (loading) return <Loading text="Veriler yükleniyor..." />;

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-8">Yönetim Paneli</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-slate-900 border border-slate-800 rounded-lg p-6 hover:border-slate-700 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{stat.icon}</span>
              <span className="text-xs text-slate-500">Toplam</span>
            </div>
            <p className="text-slate-400 text-sm mb-1">{stat.label}</p>
            <p className="text-2xl font-semibold text-indigo-400">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Son Siparişler */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Son Siparişler</h2>
          {orders.length === 0 ? (
            <p className="text-slate-400 text-sm">Sipariş yok</p>
          ) : (
            <div className="space-y-3">
              {orders.slice(-5).map((order) => (
                <div
                  key={order.id}
                  className="flex justify-between items-center p-3 bg-slate-950/50 rounded border border-slate-800/50"
                >
                  <div>
                    <p className="font-medium">Sipariş #{order.id}</p>
                    <p className="text-xs text-slate-400">
                      {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      order.status === 'COMPLETED'
                        ? 'bg-green-500/20 text-green-400'
                        : order.status === 'PAID'
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}
                  >
                    {order.status === 'COMPLETED'
                      ? 'Tamamlandı'
                      : order.status === 'PAID'
                      ? 'Ödendi'
                      : 'Beklemede'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Son Ürünler */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Son Ürünler</h2>
          {products.length === 0 ? (
            <p className="text-slate-400 text-sm">Ürün yok</p>
          ) : (
            <div className="space-y-3">
              {products.slice(-5).map((product) => (
                <div
                  key={product.id}
                  className="flex justify-between items-center p-3 bg-slate-950/50 rounded border border-slate-800/50"
                >
                  <div>
                    <p className="font-medium line-clamp-1">{product.title}</p>
                    <p className="text-xs text-slate-400">
                      {product.game?.name}
                    </p>
                  </div>
                  <span className="text-indigo-400 font-semibold">
                    {Number(product.price).toFixed(2)} TRY
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
