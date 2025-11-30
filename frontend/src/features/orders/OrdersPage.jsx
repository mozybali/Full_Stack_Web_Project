import React, { useEffect } from 'react';
import { useOrderStore } from './store';
import { Loading, Alert } from '../../common/ui';

export default function OrdersPage() {
  const { orders, loading, error, fetchMyOrders, clearError } = useOrderStore();

  useEffect(() => {
    fetchMyOrders();
  }, []);

  if (loading) return <Loading text="Siparişler yükleniyor..." />;

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Siparişlerim</h1>

      {error && (
        <Alert
          type="error"
          title="Hata"
          message={error}
          onClose={clearError}
        />
      )}

      {orders.length === 0 ? (
        <div className="text-center py-12 bg-slate-900 border border-slate-800 rounded-lg">
          <p className="text-slate-400">Henüz siparişiniz yok</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-slate-900 border border-slate-800 rounded-lg p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    Sipariş #{order.id}
                  </h3>
                  <p className="text-sm text-slate-400">
                    {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.status === 'COMPLETED'
                      ? 'bg-green-500/20 text-green-400'
                      : order.status === 'PAID'
                      ? 'bg-blue-500/20 text-blue-400'
                      : order.status === 'PENDING'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {order.status === 'COMPLETED'
                    ? 'Tamamlandı'
                    : order.status === 'PAID'
                    ? 'Ödendi'
                    : order.status === 'PENDING'
                    ? 'Beklemede'
                    : 'İptal Edildi'}
                </span>
              </div>

              <div className="border-t border-slate-700 pt-4">
                <div className="mb-4">
                  <h4 className="font-medium mb-2">Ürünler:</h4>
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="text-sm text-slate-400 flex justify-between"
                      >
                        <span>
                          {item.product.title} x {item.quantity}
                        </span>
                        <span>
                          {(Number(item.unitPrice) * item.quantity).toFixed(2)}{' '}
                          TRY
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-slate-700 pt-4 flex justify-between">
                  <span className="font-semibold">Toplam:</span>
                  <span className="font-semibold text-indigo-400">
                    {Number(order.totalPrice).toFixed(2)} TRY
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
