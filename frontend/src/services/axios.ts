/**
 * Axios Instance ve Interceptor Konfigürasyonu
 * 
 * API istekleri için merkezi axios instance'ı.
 * JWT token yönetimi ve error handling'i burada yapılır.
 * 
 * Özellikleri:
 * - JWT token otomatik ekleme (request interceptor)
 * - Response data yapısı normalize etme
 * - 401 Unauthorized hatası yönetimi
 * - Logout event'i tetikleme
 */

import axios from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

// API base URL - backend'in çalıştığı adres
// .env dosyasından VITE_API_URL okunur, yoksa localhost:3000 kullanılır
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Axios instance oluştur
 * Tüm API istekleri bu instance üzerinden yapılır
 */
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor
 * Her API isteğinden önce çalışır.
 * localStorage'dan JWT token'ını al ve Authorization header'ına ekle
 */
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // localStorage'dan token'ı al
    const token = localStorage.getItem('access_token');
    
    // Token varsa header'a ekle
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    // Request hazırlama sırasında hata varsa
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Her API yanıtından sonra çalışır.
 * 
 * 1. Response verilerini normalize et
 * 2. 401 Unauthorized hatası durumunda logout işlemi yap
 */
axiosInstance.interceptors.response.use(
  (response) => {
    // Backend response yapısı: { statusCode, data, message, timestamp }
    // Frontend'de sadece data alanını kullan
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      return {
        ...response,
        data: response.data.data, // İç data'yı üste çıkar
      };
    }
    
    return response;
  },
  (error) => {
    // 401 Unauthorized - Token geçersiz, expired veya mevcut değil
    if (error.response?.status === 401) {
      // localStorage'ı temizle
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      
      // Logout event'i tetikle (AuthContext bunu dinler)
      // Bu sayede kullanıcı otomatik olarak logout olur
      window.dispatchEvent(new Event('logout'));
    }
    
    // Hata'yı prop et (component'lerde try-catch ile yakala)
    return Promise.reject(error);
  }
);

export default axiosInstance;
