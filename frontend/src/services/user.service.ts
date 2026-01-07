import axiosInstance from './axios';
import type { User } from '../types';

export const userService = {
  // Tüm kullanıcıları getir (Admin)
  async getAll(): Promise<User[]> {
    const response = await axiosInstance.get<User[]>('/users');
    return response.data;
  },

  // ID'ye göre kullanıcı getir
  async getById(id: number): Promise<User> {
    const response = await axiosInstance.get<User>(`/users/${id}`);
    return response.data;
  },

  // Kullanıcı güncelle
  async update(id: number, data: Partial<User>): Promise<User> {
    const response = await axiosInstance.put<User>(`/users/${id}`, data);
    return response.data;
  },

  // Kullanıcı sil (Admin)
  async delete(id: number): Promise<void> {
    await axiosInstance.delete(`/users/${id}`);
  },

  // Kullanıcıya rolleri ata (Admin)
  async updateRoles(id: number, roleIds: number[]): Promise<User> {
    const response = await axiosInstance.put<User>(`/users/${id}/roles`, { roleIds });
    return response.data;
  },
};
