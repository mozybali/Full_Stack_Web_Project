import axiosInstance from './axios';
import type { Game, CreateGameDto } from '../types';

export const gameService = {
  // Tüm oyunları getir
  async getAll(): Promise<Game[]> {
    const response = await axiosInstance.get<Game[]>('/games');
    return response.data;
  },

  // ID'ye göre oyun getir
  async getById(id: number): Promise<Game> {
    const response = await axiosInstance.get<Game>(`/games/${id}`);
    return response.data;
  },

  // Yeni oyun oluştur (Admin)
  async create(data: CreateGameDto): Promise<Game> {
    const response = await axiosInstance.post<Game>('/games', data);
    return response.data;
  },

  // Oyun güncelle (Admin)
  async update(id: number, data: Partial<CreateGameDto>): Promise<Game> {
    const response = await axiosInstance.put<Game>(`/games/${id}`, data);
    return response.data;
  },

  // Oyun sil (Admin)
  async delete(id: number): Promise<void> {
    await axiosInstance.delete(`/games/${id}`);
  },
};
