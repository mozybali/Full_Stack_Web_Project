import axiosInstance from './axios';
import type { Role } from '../types';

interface CreateRoleDto {
  name: string;
  description?: string;
}

interface UpdateRoleDto {
  description?: string;
}

export const roleService = {
  // Tüm rolleri getir (Admin)
  async getAll(): Promise<Role[]> {
    const response = await axiosInstance.get<Role[]>('/roles');
    return response.data;
  },

  // ID'ye göre rol getir
  async getById(id: number): Promise<Role> {
    const response = await axiosInstance.get<Role>(`/roles/${id}`);
    return response.data;
  },

  // Yeni rol oluştur (Admin)
  async create(data: CreateRoleDto): Promise<Role> {
    const response = await axiosInstance.post<Role>('/roles', data);
    return response.data;
  },

  // Rol güncelle (Admin)
  async update(id: number, data: UpdateRoleDto): Promise<Role> {
    const response = await axiosInstance.put<Role>(`/roles/${id}`, data);
    return response.data;
  },

  // Rol sil (Admin)
  async delete(id: number): Promise<void> {
    await axiosInstance.delete(`/roles/${id}`);
  },
};
