/**
 * Ortam (Environment) Konfigürasyonu
 * Tüm ortam değişkenlerini tanımlar ve varsayılan değerleri ayarlar
 */
export const env = () => ({
  // Sunucu portu (varsayılan: 3000)
  port: parseInt(process.env.PORT ?? '3000', 10),
  
  // JWT gizli anahtarı (UYARI: Production'da güvenli bir değer kullanın!)
  jwtSecret: process.env.JWT_SECRET || 'dev-secret',
  
  // JWT token expiration (varsayılan: 24 saat)
  jwtExpiration: process.env.JWT_EXPIRATION || '1d',
  
  // Veritabanı konfigürasyonu
  db: {
    // PostgreSQL sunucu host'u (varsayılan: localhost)
    host: process.env.DB_HOST || 'localhost',
    // PostgreSQL sunucu portu (varsayılan: 5432)
    port: parseInt(process.env.DB_PORT ?? '5432', 10),
    // Veritabanı kullanıcı adı (varsayılan: postgres)
    user: process.env.DB_USER || 'postgres',
    // Veritabanı şifresi (varsayılan: postgres)
    pass: process.env.DB_PASSWORD || 'postgres',
    // Veritabanı adı (varsayılan: gamevault)
    name: process.env.DB_NAME || 'gamevault'
  }
});
