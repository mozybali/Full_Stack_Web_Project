/**
 * API Yapılandırması ve Sabit Değerler
 * 
 * Bu dosya tüm uygulama genelinde kullanılan sabit değerleri içerir:
 * - API endpoint'leri
 * - Route path'leri
 * - Local storage key'leri
 * - Uygulama konfigürasyonları
 */

// API Base URL - Environment variable'dan alınır, yoksa localhost kullanılır
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// API Endpoints - Tüm backend endpoint'lerinin merkezi tanımları
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    PROFILE: '/auth/profile',
  },
  PRODUCTS: {
    BASE: '/products',
    BY_ID: (id: number) => `/products/${id}`,
  },
  GAMES: {
    BASE: '/games',
    BY_ID: (id: number) => `/games/${id}`,
  },
  ORDERS: {
    BASE: '/orders',
    BY_ID: (id: number) => `/orders/${id}`,
    MY_ORDERS: '/orders/my-orders',
  },
  USERS: {
    BASE: '/users',
    BY_ID: (id: number) => `/users/${id}`,
  },
  UPLOAD: {
    PRODUCT_IMAGE: '/upload/product-image',
  },
} as const;

// Uygulama Route'ları - React Router için path tanımları
// ROUTES.HOME, ROUTES.PRODUCTS gibi kullanılır
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: (id: string | number) => `/products/${id}`,
  CART: '/cart',
  ORDERS: '/orders',
  ADMIN: '/admin',
} as const;

// Local Storage Anahtarları - Browser storage'da kullanılan key'ler
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  CART_ITEMS: 'cart_items',
} as const;

// Sayfalama Ayarları - Liste görünümlerinde kullanılan sayfa başına öğe sayıları
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
  ADMIN_PAGE_SIZE: 10,
} as const;

// Product Types
export const PRODUCT_TYPES = {
  ALL: 'ALL',
  ACCOUNT: 'ACCOUNT',
  KEY: 'KEY',
} as const;

// Order Status
export const ORDER_STATUS = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;

// Status Labels (Turkish)
export const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING: 'Beklemede',
  PAID: 'Ödendi',
  COMPLETED: 'Tamamlandı',
  CANCELLED: 'İptal Edildi',
} as const;

// Status Colors
export const ORDER_STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PAID: 'bg-blue-100 text-blue-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
} as const;

// Product Type Labels
export const PRODUCT_TYPE_LABELS: Record<string, string> = {
  ACCOUNT: 'Hesap',
  KEY: 'Key',
} as const;

// Role Names
export const ROLE_NAMES = {
  ADMIN: 'ADMIN',
  SELLER: 'SELLER',
  BUYER: 'BUYER',
} as const;
