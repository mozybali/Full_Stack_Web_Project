/**
 * Sipariş Servisi
 * 
 * Sipariş oluşturma ve yönetimi için API fonksiyonları.
 * Kullanıcılar kendi siparişlerini görüntüleyebilir, adminler tüm siparişleri yönetebilir.
 */
import axiosInstance from './axios';
import type { Order, CreateOrderDto, UpdateOrderDto } from '../types';

export const orderService = {
  /**
   * Yeni sipariş oluştur
   * Sepetteki ürünlerden sipariş oluşturur ve stokları günceller
   * @param data - Sipariş edilecek ürünler ve miktarları
   * @returns Oluşturulan sipariş
   */
  async create(data: CreateOrderDto): Promise<Order> {
    const response = await axiosInstance.post<Order>('/orders', data);
    return response.data;
  },

  /**
   * Giriş yapmış kullanıcının kendi siparişlerini getir
   * @returns Kullanıcının siparişleri listesi
   */
  async getMy(): Promise<Order[]> {
    const response = await axiosInstance.get<Order[]>('/orders/my');
    return response.data;
  },

  /**
   * Satıcının ürünlerine ait siparişleri getir
   * @returns Satıcının ürünlerine ait siparişler
   */
  async getSellerOrders(): Promise<Order[]> {
    const response = await axiosInstance.get<Order[]>('/orders/seller/my');
    return response.data;
  },

  /**
   * Tüm siparişleri getir (Admin yetkisi gerekli)
   * Sayfalama desteği ile tüm kullanıcıların siparişlerini getirir
   * @param skip - Atlanacak sipariş sayısı (pagination için)
   * @param take - Getirilecek sipariş sayısı (varsayılan 20)
   * @returns Siparişler listesi
   */
  async getAll(skip = 0, take = 20): Promise<Order[]> {
    const response = await axiosInstance.get<Order[]>('/orders', {
      params: { skip, take },
    });
    return response.data;
  },

  /**
   * ID'ye göre sipariş detaylarını getir
   * @param id - Sipariş ID'si
   * @returns Sipariş detayları
   */
  async getById(id: number): Promise<Order> {
    const response = await axiosInstance.get<Order>(`/orders/${id}`);
    return response.data;
  },

  /**
   * Sipariş durumunu güncelle (Admin yetkisi gerekli)
   * PENDING, COMPLETED, CANCELLED gibi durumlar arasında geçiş yapar
   * @param id - Güncellenecek sipariş ID'si
   * @param data - Yeni sipariş durumu
   * @returns Güncellenen sipariş
   */
  async updateStatus(id: number, data: UpdateOrderDto): Promise<Order> {
    const response = await axiosInstance.patch<Order>(`/orders/${id}`, data);
    return response.data;
  },
};
