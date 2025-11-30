/**
 * API Endpoint Referansları
 * Tüm API çağrıları otomatik token enjeksiyonu ile axios client'i üzerinden yapılır
 */

export const API_ENDPOINTS = {
  // Kimlik doğrulama
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
  },

  // Ürünler
  PRODUCTS: {
    LIST: '/products',
    GET: (id) => `/products/${id}`,
    CREATE: '/products',
    UPDATE: (id) => `/products/${id}`,
    DELETE: (id) => `/products/${id}`,
  },

  // Siparişler
  ORDERS: {
    LIST: '/orders',
    MY_ORDERS: '/orders/my',
    GET: (id) => `/orders/${id}`,
    CREATE: '/orders',
  },

  // Kullanıcılar
  USERS: {
    LIST: '/users',
    GET: (id) => `/users/${id}`,
    CREATE: '/users',
    UPDATE: (id) => `/users/${id}`,
    DELETE: (id) => `/users/${id}`,
  },

  // Roller
  ROLES: {
    LIST: '/roles',
    GET: (id) => `/roles/${id}`,
    CREATE: '/roles',
    UPDATE: (id) => `/roles/${id}`,
    DELETE: (id) => `/roles/${id}`,
  },

  // Oyunlar
  GAMES: {
    LIST: '/games',
    GET: (id) => `/games/${id}`,
    CREATE: '/games',
    UPDATE: (id) => `/games/${id}`,
    DELETE: (id) => `/games/${id}`,
  },
};

/**
 * Sorgu Parametreleri Varsayılan Değerleri
 */
export const QUERY_DEFAULTS = {
  LIMIT: 12,
  PAGE: 1,
  SORT_BY: 'latest',
  SORT_ORDER: 'desc',
};

/**
 * İstek Header'ları
 */
export const HEADERS = {
  JSON: { 'Content-Type': 'application/json' },
  FORM: { 'Content-Type': 'multipart/form-data' },
};

/**
 * HTTP Durum Kodları
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

/**
 * Hata Mesajları
 */
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Ağ hatası. Lütfen bağlantınızı kontrol edin.',
  UNAUTHORIZED: 'Devam etmek için lütfen giriş yapın.',
  FORBIDDEN: 'Bu işlemi yapmaya yetkiniz yok.',
  NOT_FOUND: 'Kaynak bulunamadı.',
  SERVER_ERROR: 'Sunucu hatası. Lütfen daha sonra tekrar deneyin.',
  VALIDATION_ERROR: 'Lütfen girişinizi kontrol edin ve tekrar deneyin.',
};
