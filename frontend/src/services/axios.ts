/**
 * Axios Instance ve Interceptor Konfigürasyonu
 *
 * API istekleri için merkezi axios instance'ı ve interceptor'ları.
 * - JWT token otomatik yönetimi
 * - Response data normalizasyonu
 * - Global error handling
 */

import axios from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Axios instance oluştur
 */
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor - Token ekleme
 */
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor - Data normalizasyonu ve error handling
 */
axiosInstance.interceptors.response.use(
  (response) => {
    // Backend yanıtı {statusCode, data, message, timestamp} formatında geliyor
    // response.data.data varsa onu kullan, yoksa response.data kullan
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      response.data = response.data.data;
    }
    return response;
  },
  (error: AxiosError) => {
    console.error('Response Error:', {
      message: error.message,
      status: error.response?.status,
      url: error.config?.url,
      data: error.response?.data
    });

    // 401 Unauthorized - Token geçersiz veya expire olmuş
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('logout'));
    }

    // 403 Forbidden - Yetki yok
    if (error.response?.status === 403) {
      console.error('Erişim reddedildi');
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
