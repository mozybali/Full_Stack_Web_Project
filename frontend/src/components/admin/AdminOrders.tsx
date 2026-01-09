import React, { useState, useEffect } from 'react';
import { orderService } from '../../services/order.service';
import { useToast } from '../ui/ToastContainer';
import { useAuth } from '../../context/AuthContext';
import type { Order, OrderStatus } from '../../types';
import { FaEye } from 'react-icons/fa';
import { RoleNames } from '../../types';

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<OrderStatus | ''>('');
  const [viewMode, setViewMode] = useState<'seller' | 'all'>('seller');
  const { addToast } = useToast();
  const { hasRole } = useAuth();
  const isAdmin = hasRole(RoleNames.ADMIN);

  useEffect(() => {
    loadOrders();
  }, [viewMode]);

  const loadOrders = async () => {
    try {
      const data = viewMode === 'seller'
        ? await orderService.getSellerOrders()
        : await orderService.getAll(0, 100);
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
      addToast('Sipariş durumu güncellendi', 'success');
      loadOrders();
      setSelectedOrder(null);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Durum güncellenemedi';
      addToast(message, 'error');
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
    return <div className="text-center py-8 text-gray-900 dark:text-gray-100">Yükleniyor...</div>;
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.buyer.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === '' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">Siparişler</h2>
          <div className="flex bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode('seller')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'seller'
                  ? 'bg-white dark:bg-gray-600 text-primary-600 dark:text-primary-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              Ürünlerimden Yapılan
            </button>
            {isAdmin && (
              <button
                onClick={() => setViewMode('all')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'all'
                    ? 'bg-white dark:bg-gray-600 text-primary-600 dark:text-primary-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
              >
                Tüm Siparişler
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filtreleme */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">Alıcı Adı Ara</label>
            <input
              type="text"
              placeholder="Kullanıcı adı..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">Durum Filtresi</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value === '' ? '' : (e.target.value as OrderStatus))}
              className="input-field"
            >
              <option value="">Tüm Durumlar</option>
              <option value="PENDING">Beklemede</option>
              <option value="PAID">Ödendi</option>
              <option value="COMPLETED">Tamamlandı</option>
              <option value="CANCELLED">İptal</option>
            </select>
          </div>
        </div>
      </div>

      {/* Siparişler Tablosu */}
      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <table className="min-w-full">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Alıcı</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Ürün Sayısı</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Toplam</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Durum</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Tarih</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-6 py-4 text-gray-900 dark:text-gray-100">#{order.id}</td>
                <td className="px-6 py-4 text-gray-900 dark:text-gray-100">{order.buyer.username}</td>
                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{order.items.length} ürün</td>
                <td className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">₺{Number(order.totalPrice).toFixed(2)}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                  {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-2"
                  >
                    <FaEye /> Detay
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredOrders.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">Sipariş bulunamadı</div>
        )}
      </div>

      {/* Sipariş Detayları Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-50">Sipariş #{selectedOrder.id} Detayları</h3>
            
            {/* Sipariş Bilgileri */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Alıcı</p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">{selectedOrder.buyer.username}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{selectedOrder.buyer.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Sipariş Tarihi</p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">{new Date(selectedOrder.createdAt).toLocaleDateString('tr-TR')}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{new Date(selectedOrder.createdAt).toLocaleTimeString('tr-TR')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Toplam Tutar</p>
                <p className="font-semibold text-lg text-gray-900 dark:text-gray-100">₺{Number(selectedOrder.totalPrice).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Durum</p>
                <span className={`px-3 py-1 rounded text-sm ${getStatusColor(selectedOrder.status)}`}>
                  {selectedOrder.status}
                </span>
              </div>
            </div>

            {/* Sipariş Öğeleri */}
            <div className="mb-6">
              <h4 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">Ürünler</h4>
              <div className="space-y-3">
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-start bg-gray-50 dark:bg-gray-700 p-3 rounded">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{item.product.title}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{item.product.game.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Tip: {item.product.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Miktar: {item.quantity}</p>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">₺{Number(item.price).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Durum Güncelleme */}
            {isAdmin && (
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">Durum Güncelle</label>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value as OrderStatus)}
                  className="input-field"
                >
                  <option value="PENDING">Beklemede</option>
                  <option value="PAID">Ödendi</option>
                  <option value="COMPLETED">Tamamlandı</option>
                  <option value="CANCELLED">İptal</option>
                </select>
              </div>
            )}

            <button
              onClick={() => setSelectedOrder(null)}
              className="w-full bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-100 font-medium py-2 rounded"
            >
              Kapat
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
