import axios from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

// API base URL - backend'in çalıştığı adres
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Axios instance oluştur
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - her istekte token ekle
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - hata yönetimi ve veri yapılandırması
axiosInstance.interceptors.response.use(
  (response) => {
    // Backend response yapısı: { statusCode, data, message }
    // Doğrudan data alanını return et
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      return {
        ...response,
        data: response.data.data,
      };
    }
    return response;
  },
  (error) => {
    // 401 Unauthorized - Token geçersiz veya expired
    if (error.response?.status === 401) {
      // localStorage'ı temizle
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      
      // Custom event emit et - AuthContext bunu dinlesin
      window.dispatchEvent(new Event('logout'));
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
