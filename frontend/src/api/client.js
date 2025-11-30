import axios from 'axios';
import useAuthStore from '../features/auth/useAuthStore';
import useUIStore from '../common/stores/useUIStore';

/**
 * Axios API client'i
 * Tüm API çağrıları için temel konfigürasyon ve interceptor'lar
 */
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * İstek Interceptor'u
 * Her API çağrısına JWT token ekler
 */
api.interceptors.request.use(
  (config) => {
    // Auth store'dan token'ı al
    const { token } = useAuthStore.getState();
    if (token) {
      // Authorization header'ına Bearer token ekle
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Yanıt Interceptor'u
 * Hataları işler ve özel durumları yönetir
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { status, data } = error.response || {};
    const { logout } = useAuthStore.getState();
    const { addNotification } = useUIStore.getState();

    // 401: Yetkisiz - oturumu kapat
    if (status === 401) {
      logout();
      addNotification('Oturum sonlandırıldı. Lütfen tekrar giriş yapın.', 'warning');
      window.location.href = '/login';
    } 
    // 403: Yasak
    else if (status === 403) {
      addNotification('Bu işlemi yapmaya yetkiniz yok.', 'error');
    } 
    // 404: Bulunamadı
    else if (status === 404) {
      addNotification('Kaynak bulunamadı.', 'error');
    } 
    // 400/422: Doğrulama hatası
    else if (status === 422 || status === 400) {
      const message = data?.message || 'Lütfen girişinizi kontrol edin ve tekrar deneyin.';
      addNotification(message, 'error');
    } 
    // 500+: Sunucu hatası
    else if (status >= 500) {
      addNotification('Sunucu hatası. Lütfen daha sonra tekrar deneyin.', 'error');
    }

    return Promise.reject(error);
  }
);

export default api;
