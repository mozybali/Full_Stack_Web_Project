import { useState, useEffect } from 'react';
import { orderService } from '../services/order.service';
import type { Order } from '../types';

/**
 * Kullanıcının kendi siparişlerini yönetmek için custom hook
 * 
 * Kullanım:
 * const { orders, loading, error, refetch } = useOrders();
 * 
 * @returns {Object} Sipariş verileri ve durumları
 * @returns {Order[]} orders - Kullanıcının siparişleri
 * @returns {boolean} loading - Yükleme durumu
 * @returns {string|null} error - Hata mesajı
 * @returns {Function} refetch - Verileri yeniden yükle
 */
export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await orderService.getMy();
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Siparişler yüklenirken hata oluştu');
      console.error('Error loading orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  return {
    orders,
    loading,
    error,
    refetch: loadOrders,
  };
};

/**
 * Tüm siparişleri getiren hook (Admin kullanımı için)
 * 
 * Kullanım:
 * const { orders, loading, error, refetch } = useAllOrders();
 * 
 * Not: Bu hook sadece admin yetkisine sahip kullanıcılar tarafından kullanılmalıdır
 * 
 * @returns {Object} Tüm sipariş verileri ve durumları
 */
export const useAllOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await orderService.getAll();
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Siparişler yüklenirken hata oluştu');
      console.error('Error loading orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  return {
    orders,
    loading,
    error,
    refetch: loadOrders,
  };
};
