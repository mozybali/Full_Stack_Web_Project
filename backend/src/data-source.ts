/**
 * TypeORM DataSource Yapılandırması
 * Migration komutları için kullanılır (migration:generate, migration:run, vb.)
 * 
 * Bu dosya TypeORM CLI tarafından kullanılır ve .env dosyasındaki değerleri okur.
 */
import { DataSource } from 'typeorm';
import { config } from 'dotenv';

// .env dosyasını yükle
config();

// TypeORM DataSource - Migration işlemleri için
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'justcan',
  database: process.env.DB_NAME || 'game_market',
  
  // Entity dosyaları - Tüm .entity.ts dosyaları
  entities: ['src/**/*.entity.ts'],
  
  // Migration dosyaları
  migrations: ['src/migrations/*.ts'],
  
  // Migration geçmişinin saklandığı tablo adı
  migrationsTableName: 'migrations',
  
  // SQL sorgularını konsola yazdır (development için)
  logging: process.env.DB_LOGGING === 'true',
  
  // Otomatik şema senkronizasyonu KAPALI (migration kullanılıyor)
  synchronize: false,
});
