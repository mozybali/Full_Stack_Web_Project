# Game Market Backend

Game account ve key satış platformu backend API.

## Teknolojiler

- **NestJS** - TypeScript framework
- **TypeORM** - ORM ve migration sistemi
- **PostgreSQL** - Veritabanı
- **JWT** - Authentication
- **Swagger** - API dokümantasyonu

## Kurulum

```bash
# Bağımlılıkları yükle
npm install

# .env dosyasını oluştur
cp .env.example .env

# Veritabanını oluştur
createdb game_market

# Migration'ları çalıştır
npm run migration:run

# Development modunda başlat
npm run start:dev
```

## Scriptler

### Development
- `npm run start:dev` - Development modunda başlat (watch mode)
- `npm run start` - Production modunda başlat
- `npm run build` - Projeyi build et

### Migration Komutları
- `npm run migration:generate src/migrations/MigrationName` - Yeni migration oluştur (otomatik)
- `npm run migration:create src/migrations/MigrationName` - Boş migration oluştur
- `npm run migration:run` - Bekleyen migration'ları çalıştır
- `npm run migration:revert` - Son migration'ı geri al
- `npm run migration:show` - Migration durumunu göster

## API Dokümantasyonu

Uygulama başladığında Swagger dokümantasyonuna şu adresten erişilebilir:
```
http://localhost:3000/api
```

## Proje Yapısı

```
src/
├── auth/           # Authentication (login, register)
├── users/          # Kullanıcı yönetimi
├── roles/          # Rol sistemi
├── games/          # Oyun bilgileri
├── products/       # Ürün yönetimi (account & key)
├── orders/         # Sipariş sistemi
├── upload/         # Dosya yükleme
├── seeding/        # Veritabanı seeding
├── common/         # Ortak utility'ler
├── config/         # Konfigürasyon
└── migrations/     # TypeORM migration dosyaları
```

## Ortam Değişkenleri

`.env.example` dosyasına bakın. Önemli değişkenler:

- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` - PostgreSQL bağlantı bilgileri
- `JWT_SECRET` - JWT şifreleme anahtarı
- `PORT` - Sunucu portu (varsayılan: 3000)
- `FRONTEND_URL` - CORS için frontend URL'i

## Migration Sistemi

Proje TypeORM migration sistemi kullanmaktadır:

1. Entity'de değişiklik yap
2. `npm run migration:generate src/migrations/DescriptiveName` ile migration oluştur
3. `npm run migration:run` ile veritabanına uygula

⚠️ **Önemli:** `synchronize: false` - Sadece migration'lar kullanılıyor!
