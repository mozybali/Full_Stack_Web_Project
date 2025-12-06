/**
 * Ortam (Environment) Konfigürasyonu
 * Tüm ortam değişkenlerini tanımlar ve varsayılan değerleri ayarlar
 */
export const env = () => {
  // Üretim ortamında mı çalışıyoruz kontrolü
  const isProduction = process.env.NODE_ENV === 'production';

  // Production ortamında zorunlu environment variables kontrol et
  if (isProduction) {
    // Üretim ortamında mutlaka tanımlanması gereken değişkenler
    const requiredVars = ['JWT_SECRET', 'DB_PASSWORD', 'DB_HOST', 'DB_USER'];
    // Eksik olan değişkenleri filtrele
    // Eksik olan değişkenleri filtrele
    const missing = requiredVars.filter(v => !process.env[v]);
    
    // Eğer eksik değişken varsa hata fırlat
    if (missing.length > 0) {
      throw new Error(
        `Production ortamında bu environment variables'ları ayarlamanız zorunludur: ${missing.join(', ')}`
      );
    }
  }

  return {
    // Sunucu portu (varsayılan: 3000)
    port: parseInt(process.env.PORT ?? '3000', 10),
    
    // JWT gizli anahtarı (production'da zorunlu, development'ta varsayılan değer kullanılabilir)
    jwtSecret: isProduction 
      ? (process.env.JWT_SECRET || (() => {
          throw new Error('🚨 CRITICAL: JWT_SECRET environment variable zorunludur (production)');
        })())
      : (process.env.JWT_SECRET || 'dev-secret-key'),
    
    // JWT token geçerlilik süresi (varsayılan: 15 dakika - güvenlik için kısa tutuldu)
    jwtExpiration: process.env.JWT_EXPIRATION || '15m',
    
    // CORS için izin verilen frontend adresi
    corsOrigin: isProduction
      ? (process.env.FRONTEND_URL || (() => {
          throw new Error('🚨 CRITICAL: FRONTEND_URL environment variable zorunludur (production)');
        })())
      : (process.env.FRONTEND_URL || true),
    
    // Veritabanı konfigürasyonu
    db: {
      // PostgreSQL sunucu host adresi
      host: isProduction 
        ? process.env.DB_HOST 
        : (process.env.DB_HOST || 'localhost'),
      
      // PostgreSQL sunucu port numarası (varsayılan: 5432)
      port: parseInt(process.env.DB_PORT ?? '5432', 10),
      
      // Veritabanı kullanıcı adı
      user: isProduction 
        ? process.env.DB_USER 
        : (process.env.DB_USER || 'postgres'),
      
      // Veritabanı kullanıcı şifresi
      pass: isProduction 
        ? process.env.DB_PASSWORD 
        : (process.env.DB_PASSWORD || 'justcan'),
      
      // Bağlanılacak veritabanının adı (varsayılan: game_market)
      name: process.env.DB_NAME || 'game_market'
    }
  };
};

/**
 * Environment variables validation
 * Uygulama başlangıcında ortam değişkenlerini doğrula ve konfigürasyonu döndür
 */
export const validateEnv = () => {
  const config = env();
  return config;
};
