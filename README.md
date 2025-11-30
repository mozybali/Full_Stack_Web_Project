# GameVault - Game Account & Key Marketplace

[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-v11.0-red.svg)](https://nestjs.com/)
[![React](https://img.shields.io/badge/React-v18.3-blue.svg)](https://react.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-v12+-336791.svg)](https://www.postgresql.org/)

Oyun hesapları ve oyun anahtarları satın almak/satmak için eksiksiz bir marketplace platformu.

## 📋 İçindekiler

- [Özellikler](#özellikler)
- [Teknoloji Stack](#teknoloji-stack)
- [Kurulum](#kurulum)
- [Konfigürasyon](#konfigürasyon)
- [Geliştirme](#geliştirme)
- [API Endpoints](#api-endpoints)
- [Proje Yapısı](#proje-yapısı)
- [Katkıda Bulunma](#katkıda-bulunma)

## 🎯 Özellikler

### Kullanıcı Özellikleri
- ✅ Kullanıcı kayıt ve oturum açma (JWT-based)
- ✅ Profil yönetimi
- ✅ Alışveriş sepeti
- ✅ Sipariş yönetimi
- ✅ Satıcı paneli (Ürün ekleme/düzenleme)

### Admin Özellikleri
- ✅ Kullanıcı yönetimi
- ✅ Ürün yönetimi
- ✅ Oyun katalog yönetimi
- ✅ Sipariş takibi
- ✅ İstatistikler ve raporlar

### Platform Özellikleri
- ✅ JWT tabanlı güvenli kimlik doğrulama
- ✅ Role-Based Access Control (RBAC)
- ✅ Swagger API dokumentasyonu
- ✅ Global hata yönetimi
- ✅ Input validasyonu ve sanitizasyonu

## 🛠️ Teknoloji Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: NestJS 11.0
- **ORM**: TypeORM 0.3
- **Database**: PostgreSQL 12+
- **Authentication**: JWT + Passport.js
- **Validation**: class-validator, class-transformer
- **API Docs**: Swagger/OpenAPI

### Frontend
- **Library**: React 18.3
- **Bundler**: Vite 5.0
- **Router**: React Router v6
- **State Management**: Zustand 4.5
- **HTTP Client**: Axios 1.7
- **Styling**: Tailwind CSS 3.4
- **CSS Processor**: PostCSS

### Database
- **Primary DB**: PostgreSQL 12+
- **ORM**: TypeORM with TypeScript

## 📦 Kurulum

### Ön Gereksinimler
- Node.js 18+ ([İndir](https://nodejs.org/))
- npm 9+ veya yarn
- PostgreSQL 12+ ([İndir](https://www.postgresql.org/))
- Git

### Backend Kurulumu

```bash
# Proje dizinine gidin
cd /Users/hector/Desktop/web_proje/backend

# Bağımlılıkları yükleyin
npm install

# .env dosyası oluşturun (aşağıdaki konfigürasyon bölümüne bakın)
cp .env.example .env

# Database'i başlatın
npm run start:dev
```

Backend varsayılan olarak `http://localhost:3000` adresinde çalışır.

### Frontend Kurulumu

```bash
# Frontend dizinine gidin
cd /Users/hector/Desktop/web_proje/frontend

# Bağımlılıkları yükleyin
npm install

# Development sunucusunu başlatın
npm run dev
```

Frontend varsayılan olarak `http://localhost:5173` adresinde çalışır.

## 🔧 Konfigürasyon

### Backend .env Dosyası

```env
# Server
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=gamevault
```

### PostgreSQL Database Kurulumu

```bash
# PostgreSQL CLI'ye bağlanın
psql -U postgres

# Database oluşturun
CREATE DATABASE gamevault;

# Çıkış yapın
\q
```

TypeORM tarafından tablolar otomatik olarak oluşturulacaktır (`synchronize: true`).

## 👨‍💻 Geliştirme

### Proje Başlatma (Her iki uç)

**Terminal 1 - Backend:**
```bash
cd backend
npm run start:dev
# Swagger docs: http://localhost:3000/api
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Uygulama: http://localhost:5173
```

### Kullanıcı Rolleri

| Rol | İzinler |
|-----|---------|
| **BUYER** | Ürün görüntüleme, sepete ekleme, sipariş oluşturma, profil yönetimi |
| **SELLER** | Ürün ekleme/düzenleme/silme, siparişleri kontrol etme |
| **ADMIN** | Tüm yönetim işlemleri, kullanıcı yönetimi, sistem ayarları |

### Proje Dosya Yapısı

```
web_proje/
├── backend/
│   ├── src/
│   │   ├── app.module.ts                 # Ana modül
│   │   ├── main.ts                       # Başlangıç noktası
│   │   ├── auth/                         # Kimlik doğrulama
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── guards/
│   │   │   ├── strategies/
│   │   │   └── dto/
│   │   ├── users/                        # Kullanıcı yönetimi
│   │   ├── products/                     # Ürün yönetimi
│   │   ├── orders/                       # Sipariş yönetimi
│   │   ├── games/                        # Oyun katalog
│   │   ├── roles/                        # Rol yönetimi
│   │   ├── common/                       # Paylaşılan utilities
│   │   │   ├── decorators/
│   │   │   ├── guards/
│   │   │   ├── filters/
│   │   │   ├── enums/
│   │   │   └── utils/
│   │   └── config/
│   ├── package.json
│   ├── tsconfig.json
│   └── nest-cli.json
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx                       # Root component
│   │   ├── main.jsx                      # Entry point
│   │   ├── router.jsx                    # Route konfigürasyonu
│   │   ├── api/                          # API client
│   │   ├── common/
│   │   │   ├── components/               # Reusable components
│   │   │   ├── context/                  # Context providers
│   │   │   ├── hooks/                    # Custom hooks
│   │   │   ├── stores/                   # Zustand stores
│   │   │   └── ui/                       # UI components
│   │   ├── components/                   # Page components
│   │   ├── features/                     # Feature modules
│   │   │   ├── auth/
│   │   │   ├── catalog/
│   │   │   ├── orders/
│   │   │   └── admin/
│   │   └── layouts/                      # Layout components
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
└── README.md
```

## 🔌 API Endpoints

### Kimlik Doğrulama
- `POST /auth/register` - Yeni hesap oluştur
- `POST /auth/login` - Oturum aç

### Kullanıcılar
- `GET /users` - Tüm kullanıcıları listele (Admin)
- `GET /users/:id` - Kullanıcı detayı
- `DELETE /users/:id` - Kullanıcı sil (Admin)

### Ürünler
- `GET /products` - Ürün listesi
- `GET /products/:id` - Ürün detayı
- `POST /products` - Ürün ekle (Seller)
- `PATCH /products/:id` - Ürün güncelle (Seller/Admin)
- `DELETE /products/:id` - Ürün sil (Seller/Admin)

### Siparişler
- `POST /orders` - Sipariş oluştur
- `GET /orders/my` - Kendi siparişlerim
- `GET /orders` - Tüm siparişler (Admin)
- `GET /orders/:id` - Sipariş detayı

### Oyunlar
- `GET /games` - Oyun listesi
- `POST /games` - Oyun ekle (Admin)

### Roller
- `GET /roles` - Rol listesi (Admin)
- `POST /roles` - Rol oluştur (Admin)

Detaylı API dokumentasyonu: `http://localhost:3000/api`

## 📊 Database Şeması

### Ana Tablolar

#### users
- `id` (PK): Kullanıcı ID
- `email`: Benzersiz email adresi
- `username`: Benzersiz kullanıcı adı
- `passwordHash`: Şifrelenmiş şifre
- `createdAt`, `updatedAt`: Tarih bilgileri

#### products
- `id` (PK): Ürün ID
- `title`: Ürün adı
- `description`: Açıklama
- `type`: ENUM (ACCOUNT, KEY)
- `price`: Fiyat
- `stock`: Stok miktarı
- `seller_id` (FK): Satıcı
- `game_id` (FK): İlgili oyun

#### orders
- `id` (PK): Sipariş ID
- `buyer_id` (FK): Alıcı
- `status`: ENUM (PENDING, COMPLETED, CANCELLED)
- `totalPrice`: Toplam fiyat
- `createdAt`: Sipariş tarihi

#### order_items
- `id` (PK): Satır ID
- `order_id` (FK): Sipariş
- `product_id` (FK): Ürün
- `quantity`: Miktar
- `unitPrice`: Birim fiyat

#### games
- `id` (PK): Oyun ID
- `name`: Oyun adı
- `platform`: Platform
- `genre`: Tür

#### roles
- `id` (PK): Rol ID
- `name`: Rol adı (BUYER, SELLER, ADMIN)
- `description`: Açıklama

#### user_roles (Junction Table)
- `user_id` (FK): Kullanıcı
- `role_id` (FK): Rol

## 🧪 Test Etme

### Manual API Testing (Swagger)
1. `http://localhost:3000/api` adresine gidin
2. "Try it out" butonuna tıklayın
3. Parametreleri doldurun ve "Execute" yapın

### Örnek API Çağrıları

```bash
# Register
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "user123",
    "password": "SecurePass123!"
  }'

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'

# Get Products (Bearer token ile)
curl -X GET http://localhost:3000/products \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

## 🐛 Hata Ayıklama

### Yaygın Sorunlar

**Bağlantı hatası: `Cannot connect to database`**
```bash
# PostgreSQL çalışıyor mu kontrol edin
psql -U postgres -d gamevault
```

**Port zaten kullanımda: `EADDRINUSE: address already in use :::3000`**
```bash
# Port 3000 kullanan işlemi sonlandırın (macOS)
lsof -ti:3000 | xargs kill -9
```

**JWT Token hatası**
- Token expired: Yeniden login yapın
- Invalid token: .env dosyasındaki JWT_SECRET'i kontrol edin

**CORS hatası**
- Frontend ve backend CORS ayarlarını kontrol edin
- `.env` dosyasında doğru frontend URL'si yazılı olduğundan emin olun

## 📚 Ek Kaynaklar

- [NestJS Dokumentasyonu](https://docs.nestjs.com/)
- [React Dokumentasyonu](https://react.dev/)
- [TypeORM Dokumentasyonu](https://typeorm.io/)
- [JWT Hakkında](https://jwt.io/)
- [Tailwind CSS](https://tailwindcss.com/)

## 🤝 Katkıda Bulunma

1. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
2. Değişiklikleri commit edin (`git commit -m 'Add some amazing feature'`)
3. Branch'i push edin (`git push origin feature/amazing-feature`)
4. Pull request açın

## 📄 Lisans

Bu proje MIT Lisansı altında yayınlanmıştır.

## 👤 Yazar

**Hector** - Full Stack Developer

---

**Son Güncelleme**: 30 Kasım 2025

