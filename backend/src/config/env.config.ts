/**
 * Ortam (Environment) Konfigürasyonu
 * Tüm ortam değişkenlerini tanımlar ve varsayılan değerleri ayarlar
 */
export const env = () => {
  const isProduction = process.env.NODE_ENV === 'production';

  // Production ortamında zorunlu environment variables kontrol et
  if (isProduction) {
    const requiredVars = ['JWT_SECRET', 'DB_PASSWORD', 'DB_HOST', 'DB_USER'];
    const missing = requiredVars.filter(v => !process.env[v]);
    
    if (missing.length > 0) {
      throw new Error(
        `Production ortamında bu environment variables'ları ayarlamanız zorunludur: ${missing.join(', ')}`
      );
    }
  }

  return {
    // Sunucu portu (varsayılan: 3000)
    port: parseInt(process.env.PORT ?? '3000', 10),
    
    // JWT gizli anahtarı
    jwtSecret: isProduction 
      ? process.env.JWT_SECRET 
      : (process.env.JWT_SECRET || 'dev-secret-key'),
    
    // JWT token expiration (varsayılan: 24 saat)
    jwtExpiration: process.env.JWT_EXPIRATION || '1d',
    
    // CORS origin'i
    corsOrigin: process.env.FRONTEND_URL || 'http://localhost:5173',
    
    // Veritabanı konfigürasyonu
    db: {
      // PostgreSQL sunucu host'u
      host: isProduction 
        ? process.env.DB_HOST 
        : (process.env.DB_HOST || 'localhost'),
      
      // PostgreSQL sunucu portu
      port: parseInt(process.env.DB_PORT ?? '5432', 10),
      
      // Veritabanı kullanıcı adı
      user: isProduction 
        ? process.env.DB_USER 
        : (process.env.DB_USER || 'postgres'),
      
      // Veritabanı şifresi
      pass: isProduction 
        ? process.env.DB_PASSWORD 
        : (process.env.DB_PASSWORD || 'postgres'),
      
      // Veritabanı adı
      name: process.env.DB_NAME || 'gamevault'
    }
  };
};

/**
 * Environment variables validation
 * Startup sırasında ortam değişkenlerini doğrula
 */
export const validateEnv = () => {
  const config = env();
  return config;
};
