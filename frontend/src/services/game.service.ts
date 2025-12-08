/**
 * Oyun Servisi
 * 
 * Oyun kataloğu CRUD işlemleri için API fonksiyonları.
 * Admin kullanıcılar tarafından yönetilir.
 */
import axiosInstance from './axios';
import type { Game, CreateGameDto } from '../types';

export const gameService = {
  /**
   * Tüm oyunları getir
   * @returns Oyunlar listesi
   */
  async getAll(): Promise<Game[]> {
    const response = await axiosInstance.get<Game[]>('/games');
    return response.data;
  },

  /**
   * ID'ye göre oyun getir
   * @param id - Oyun ID'si
   * @returns Oyun detayları
   */
  async getById(id: number): Promise<Game> {
    const response = await axiosInstance.get<Game>(`/games/${id}`);
    return response.data;
  },

  /**
   * Yeni oyun oluştur (Admin yetkisi gerekli)
   * @param data - Oyun bilgileri (ad, platform, tür)
   * @returns Oluşturulan oyun
   */
  async create(data: CreateGameDto): Promise<Game> {
    const response = await axiosInstance.post<Game>('/games', data);
    return response.data;
  },

  /**
   * Oyun güncelle (Admin yetkisi gerekli)
   * @param id - Güncellenecek oyun ID'si
   * @param data - Güncellenmiş oyun bilgileri
   * @returns Güncellenen oyun
   */
  async update(id: number, data: Partial<CreateGameDto>): Promise<Game> {
    const response = await axiosInstance.put<Game>(`/games/${id}`, data);
    return response.data;
  },

  /**
   * Oyunu sil (Admin yetkisi gerekli)
   * @param id - Silinecek oyun ID'si
   */
  async delete(id: number): Promise<void> {
    await axiosInstance.delete(`/games/${id}`);
  },
};
