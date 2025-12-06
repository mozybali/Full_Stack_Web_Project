import axiosInstance from './axios';
import type { Order, CreateOrderDto, UpdateOrderDto } from '../types';

export const orderService = {
  // Yeni sipariş oluştur
  async create(data: CreateOrderDto): Promise<Order> {
    const response = await axiosInstance.post<Order>('/orders', data);
    return response.data;
  },

  // Kendi siparişlerimi getir
  async getMy(): Promise<Order[]> {
    const response = await axiosInstance.get<Order[]>('/orders/my');
    return response.data;
  },

  // Tüm siparişleri getir (Admin)
  async getAll(skip = 0, take = 20): Promise<Order[]> {
    const response = await axiosInstance.get<Order[]>('/orders', {
      params: { skip, take },
    });
    return response.data;
  },

  // ID'ye göre sipariş getir
  async getById(id: number): Promise<Order> {
    const response = await axiosInstance.get<Order>(`/orders/${id}`);
    return response.data;
  },

  // Sipariş durumunu güncelle (Admin)
  async updateStatus(id: number, data: UpdateOrderDto): Promise<Order> {
    const response = await axiosInstance.patch<Order>(`/orders/${id}`, data);
    return response.data;
  },
};
