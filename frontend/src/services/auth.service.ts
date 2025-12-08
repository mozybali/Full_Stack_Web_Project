/**
 * Kimlik Doğrulama Servisi
 * 
 * Kullanıcı kaydı, girişi ve oturum yönetimi için API fonksiyonları.
 * localStorage ile token ve kullanıcı bilgilerini yönetir.
 */
import axiosInstance from './axios';
import type { AuthResponse, LoginDto, RegisterDto, User } from '../types';

export const authService = {
  /**
   * Yeni kullanıcı kaydı
   * @param data - Email, kullanıcı adı ve şifre bilgileri
   * @returns JWT token ve kullanıcı bilgileri
   */
  async register(data: RegisterDto): Promise<AuthResponse> {
    const response = await axiosInstance.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  /**
   * Kullanıcı girişi
   * @param data - Email ve şifre bilgileri
   * @returns JWT token ve kullanıcı bilgileri
   */
  async login(data: LoginDto): Promise<AuthResponse> {
    const response = await axiosInstance.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  /**
   * Mevcut kullanıcıyı localStorage'dan al
   * @returns Kullanıcı nesnesi veya null
   */
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  /**
   * JWT token'ı localStorage'dan al
   * @returns Token string veya null
   */
  getToken(): string | null {
    return localStorage.getItem('access_token');
  },

  /**
   * JWT token'ı localStorage'a kaydet
   * @param token - Kaydedilecek JWT token
   */
  setToken(token: string): void {
    localStorage.setItem('access_token', token);
  },

  /**
   * Kullanıcı bilgilerini localStorage'a kaydet
   * @param user - Kaydedilecek kullanıcı nesnesi
   */
  setUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  },

  /**
   * Oturumu kapat ve localStorage'ı temizle
   * Token ve kullanıcı bilgilerini siler
   */
  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  },

  /**
   * Kullanıcının oturum açıp açmadığını kontrol et
   * @returns Token varsa true, yoksa false
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  },
};
