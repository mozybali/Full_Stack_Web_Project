import React, { useState, useEffect } from 'react';
import { orderService } from '../../services/order.service';
import type { Order, OrderStatus } from '../../types';

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await orderService.getAll(0, 100);
      setOrders(data);
    } catch (error) {
      console.error('Siparişler yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: number, newStatus: OrderStatus) => {
    try {
      await orderService.updateStatus(orderId, { status: newStatus });
      loadOrders();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Durum güncellenemedi');
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'PAID':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="text-center py-8">Yükleniyor...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Siparişler</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Alıcı</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ürün Sayısı</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Toplam</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durum</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tarih</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="px-6 py-4">#{order.id}</td>
                <td className="px-6 py-4">{order.buyer.username}</td>
                <td className="px-6 py-4">{order.items.length} ürün</td>
                <td className="px-6 py-4 font-semibold">₺{order.totalPrice.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                </td>
                <td className="px-6 py-4">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                    className="text-sm border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="PENDING">Beklemede</option>
                    <option value="PAID">Ödendi</option>
                    <option value="COMPLETED">Tamamlandı</option>
                    <option value="CANCELLED">İptal</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;
