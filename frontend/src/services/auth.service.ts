import axiosInstance from './axios';
import type { AuthResponse, LoginDto, RegisterDto, User } from '../types';

export const authService = {
  // Kullanıcı kaydı
  async register(data: RegisterDto): Promise<AuthResponse> {
    const response = await axiosInstance.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  // Kullanıcı girişi
  async login(data: LoginDto): Promise<AuthResponse> {
    const response = await axiosInstance.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  // Mevcut kullanıcıyı token'dan al
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Token'ı al
  getToken(): string | null {
    return localStorage.getItem('access_token');
  },

  // Token'ı kaydet
  setToken(token: string): void {
    localStorage.setItem('access_token', token);
  },

  // Kullanıcıyı kaydet
  setUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  },

  // Çıkış yap
  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  },

  // Token var mı kontrol et
  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  },
};
