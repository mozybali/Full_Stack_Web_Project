/**
 * Siparişlerim Sayfası (Orders Page)
 * 
 * Kullanıcının kendi siparışlarını gösteren sayfa.
 * Sipariş geçmişi, durumları ve detaylarını içerir.
 * 
 * Özellikler:
 * - Kullanıcının tüm siparişlerini listeleme
 * - Sipariş durumu gösterimi (Beklemede, Ödendi, Tamamlandı, İptal Edildi)
 * - Sipariş detayları (ürünler, miktarlar, fiyatlar)
 * - Renk kodlanmış durum göstergeleri
 * - Tarih bilgisi (Türkçe formatında)
 * - Boş sipariş listesi mesajı
 * - Yükleme durumu göstergesi
 */

import React, { useState, useEffect } from 'react';
import { orderService } from '../services/order.service';
import type { Order, OrderStatus } from '../types';
import { FaBox, FaCheckCircle, FaClock, FaTimesCircle } from 'react-icons/fa';

const Orders: React.FC = () => {
  // Kullanıcının siparişleri
  const [orders, setOrders] = useState<Order[]>([]);
  // Siparişler yükleniyor mu?
  const [loading, setLoading] = useState(true);

  // Component mount olduğunda siparişleri yükle
  useEffect(() => {
    loadOrders();
  }, []);

  /**
   * Kullanıcının siparişlerini API'den yükle
   */
  const loadOrders = async () => {
    try {
      const data = await orderService.getMy();
      setOrders(data);
    } catch (error) {
      console.error('Siparişler yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Sipariş durumasına göre renkli badge rengi döndür
   * @param status - Sipariş durumu
   * @returns CSS class'ları
   */
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'; // Sarı - Beklemede
      case 'PAID':
        return 'bg-blue-100 text-blue-800'; // Mavi - Ödendi
      case 'COMPLETED':
        return 'bg-green-100 text-green-800'; // Yeşil - Tamamlandı
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'; // Kırmızı - İptal
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  /**
   * Sipariş durumasına göre ikon döndür
   * @param status - Sipariş durumu
   * @returns React icon component'i
   */
  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING':
        return <FaClock />; // Saat ikonu - Beklemede
      case 'PAID':
        return <FaBox />; // Kutu ikonu - Ödendi
      case 'COMPLETED':
        return <FaCheckCircle />; // Tick ikonu - Tamamlandı
      case 'CANCELLED':
        return <FaTimesCircle />; // X ikonu - İptal
      default:
        return <FaBox />;
    }
  };

  /**
   * Sipariş durumasını Türkçe metne çevir
   * @param status - Sipariş durumu
   * @returns Türkçe durum metni
   */
  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING':
        return 'Beklemede';
      case 'PAID':
        return 'Ödendi';
      case 'COMPLETED':
        return 'Tamamlandı';
      case 'CANCELLED':
        return 'İptal Edildi';
      default:
        return status;
    }
  };

  // Yükleme durumunda loading göster
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Sipariş yoksa boş durum göster
  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <FaBox size={64} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Henüz Siparişiniz Yok</h2>
            <p className="text-gray-600">Sipariş geçmişiniz burada görünecektir.</p>
          </div>
        </div>
      </div>
    );
  }

  // Sipariş listesi
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Siparişlerim</h1>

        <div className="space-y-6">
          {/* Her sipariş için kart */}
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Sipariş Başlık Bölümü */}
              <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
                <div>
                  {/* Sipariş Numarası */}
                  <p className="text-sm text-gray-600">
                    Sipariş No: <span className="font-semibold">#{order.id}</span>
                  </p>
                  {/* Sipariş Tarihi */}
                  <p className="text-sm text-gray-600">
                    Tarih: {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                  </p>
                </div>
                {/* Sipariş Durumu Badge */}
                <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  <span className="font-semibold">{getStatusText(order.status)}</span>
                </div>
              </div>

              {/* Sipariş Detayları */}
              <div className="p-6">
                {/* Siparişteki Ürünler */}
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      {/* Sol Taraf: Ürün Resmi ve Bilgisi */}
                      <div className="flex items-center space-x-4">
                        {/* Ürün Resmi */}
                        <img
                          src={
                            item.product.imageUrl
                              ? `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}${item.product.imageUrl}`
                              : 'https://via.placeholder.com/80x80?text=No+Image'
                          }
                          alt={item.product.title}
                          className="w-16 h-16 object-cover rounded"
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/80x80?text=No+Image';
                          }}
                        />
                        {/* Ürün Bilgileri */}
                        <div>
                          <h3 className="font-semibold text-gray-900">{item.product.title}</h3>
                          <p className="text-sm text-gray-600">{item.product.game.name}</p>
                          <p className="text-sm text-gray-500">Miktar: {item.quantity}</p>
                        </div>
                      </div>
                      {/* Sağ Taraf: Fiyat Bilgisi */}
                      <div className="text-right">
                        <p className="font-bold text-primary-600">₺{item.price.toFixed(2)}</p>
                        <p className="text-sm text-gray-500">
                          Birim: ₺{(item.price / item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Sipariş Toplamı */}
                <div className="border-t mt-6 pt-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Toplam Tutar</span>
                    <span className="text-2xl font-bold text-primary-600">
                      ₺{order.totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;
