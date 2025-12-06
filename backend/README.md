# 🎮 GamerMarkt Backend API

Oyun hesapları ve oyun lisans anahtarlarının satışı yapılan modern e-ticaret platformunun RESTful API backend'i. NestJS, TypeScript, PostgreSQL ve TypeORM ile geliştirilmiştir.

## 📋 İçindekiler

- [Özellikler](#-özellikler)
- [Teknolojiler](#-teknolojiler)
- [Gereksinimler](#-gereksinimler)
- [Kurulum](#-kurulum)
- [Yapılandırma](#-yapılandırma)
- [Proje Yapısı](#-proje-yapısı)
- [API Dokümantasyonu](#-api-dokümantasyonu)
- [Veritabanı](#-veritabanı)
- [Geliştirme](#-geliştirme)

## ✨ Özellikler

### Kimlik Doğrulama
- JWT tabanlı stateless authentication
- Kullanıcı kaydı ve girişi
- Şifre hashleme (bcrypt)

### Kullanıcı Yönetimi
- Rol tabanlı yetkilendirme (Admin, Seller, Buyer)
- Kullanıcı profil yönetimi
- Kullanıcı listesi ve detayları

### Ürün Yönetimi
- Ürün CRUD işlemleri
- Ürün görseli yükleme ve optimizasyonu
- Ürün filtreleme ve arama
- Stok takibi

### Sipariş Sistemi
- Sipariş oluşturma
- Sipariş durumu takibi (Pending, Completed, Cancelled)
- Sipariş geçmişi
- Satıcı yönetim paneli

### Oyun Katalogu
- Oyun listesi yönetimi
- Platform ve tür bilgileri

### Dosya Yönetimi
- Güvenli dosya yükleme (Multer)
- Görsel optimizasyonu (Sharp)

## 🛠 Teknolojiler

- **NestJS** (v11.x) - Progressive Node.js framework
- **TypeScript** (v5.4+) - Tip güvenli JavaScript
- **PostgreSQL** - İlişkisel veritabanı
- **TypeORM** (v0.3.x) - ORM ve migration sistemi
- **Passport & JWT** - Authentication middleware
- **bcrypt** - Şifre hashleme
- **Multer** - Dosya yükleme
- **Sharp** - Görsel işleme
- **Swagger/OpenAPI** - API dokümantasyonu
- **class-validator** - DTO validasyonu
- **class-transformer** - Object transformation

## 📦 Gereksinimler

- Node.js (v18.x veya üzeri)
- npm veya yarn
- PostgreSQL (v14.x veya üzeri)

## 🔧 Kurulum

### 1. Bağımlılıkları Yükleyin
```bash
npm install
```

### 2. Ortam Değişkenlerini Yapılandırın

`.env` dosyasında aşağıdaki değişkenleri tanımlayın:

```env
# Sunucu
PORT=3000
NODE_ENV=development

# Veritabanı
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=your_password
DB_NAME=gamevault_db

# JWT
JWT_SECRET=your_secret_key_min_32_chars
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:5173

# Database
DB_LOGGING=false
```

### 3. Veritabanını Oluşturun
```bash
createdb gamevault_db
```

### 4. Migration'ları Çalıştırın
```bash
npm run migration:run
```

### 5. Uygulamayı Başlatın
```bash
# Development modu (hot reload aktif)
npm run start:dev

# Production build
npm run build
npm run start
```

Uygulama `http://localhost:3000` adresinde çalışacaktır.

## ⚙️ Yapılandırma

### Önemli Ortam Değişkenleri

| Değişken | Açıklama | Örnek |
|----------|---------|--------|
| `PORT` | Sunucu portu | `3000` |
| `NODE_ENV` | Ortam (development/production) | `development` |
| `DB_HOST` | Veritabanı host | `localhost` |
| `DB_USER` | Veritabanı kullanıcısı | `postgres` |
| `DB_PASS` | Veritabanı şifresi | `secure_password` |
| `DB_NAME` | Veritabanı adı | `gamevault_db` |
| `JWT_SECRET` | JWT şifreleme anahtarı (min 32 char) | `your_secret...` |
| `JWT_EXPIRES_IN` | Token geçerlilik süresi | `7d` |
| `CORS_ORIGIN` | Frontend URL (CORS) | `http://localhost:5173` |

## 📁 Proje Yapısı

```
src/
├── auth/                 # Kimlik doğrulama
├── users/                # Kullanıcı yönetimi
├── roles/                # Rol yönetimi
├── games/                # Oyun yönetimi
├── products/             # Ürün yönetimi
├── orders/               # Sipariş yönetimi
├── upload/               # Dosya yükleme
├── common/               # Paylaşılan modüller
├── config/               # Yapılandırma
├── migrations/           # Database migration'ları
├── data-source.ts
├── app.module.ts
└── main.ts
```

## 🚀 API Dokümantasyonu

### Swagger UI

Swagger ile interaktif API dokümantasyonuna erişin:
```
http://localhost:3000/api
```

### Ana Endpoint'ler

#### Authentication
```
POST   /auth/register              # Yeni kullanıcı kaydı
POST   /auth/login                 # Kullanıcı girişi
```

#### Users
```
GET    /users                      # Tüm kullanıcıları listele (Admin)
GET    /users/:id                  # Kullanıcı detayı
PATCH  /users/:id                  # Kullanıcı güncelle
DELETE /users/:id                  # Kullanıcı sil (Admin)
```

#### Roles
```
GET    /roles                      # Tüm rolleri listele
POST   /roles                      # Yeni rol oluştur (Admin)
GET    /roles/:id                  # Rol detayı
DELETE /roles/:id                  # Rol sil (Admin)
```

#### Games
```
GET    /games                      # Tüm oyunları listele
POST   /games                      # Yeni oyun ekle (Admin)
GET    /games/:id                  # Oyun detayı
PATCH  /games/:id                  # Oyun güncelle (Admin)
DELETE /games/:id                  # Oyun sil (Admin)
```

#### Products
```
GET    /products                   # Tüm ürünleri listele
POST   /products                   # Yeni ürün ekle
GET    /products/:id               # Ürün detayı
PATCH  /products/:id               # Ürün güncelle
DELETE /products/:id               # Ürün sil
POST   /products/:id/upload-image  # Ürün görseli yükle
```

#### Orders
```
GET    /orders                     # Siparişleri listele
POST   /orders                     # Yeni sipariş oluştur
GET    /orders/:id                 # Sipariş detayı
PATCH  /orders/:id/status          # Sipariş durumunu güncelle
```

### Kimlik Doğrulama

API'ye erişim için JWT token kullanın:

1. `/auth/login` endpoint'ine email ve şifre gönderin
2. Dönen `accessToken`'ı alın
3. Sonraki isteklerde Authorization header'ı ekleyin:

```
Authorization: Bearer <your_access_token>
```

## 🗄️ Veritabanı

### Entity İlişkileri

```
User ← → Role (ManyToMany)
User → Product (OneToMany - satıcı)
User → Order (OneToMany - alıcı)
Game → Product (OneToMany)
Product ← OrderItem (OneToMany)
Order → OrderItem (OneToMany)
```

### Migration Yönetimi

```bash
# Migration oluştur (otomatik)
npm run migration:generate -- -n DescriptiveName

# Boş migration oluştur
npm run migration:create -- -n DescriptiveName

# Migration'ları çalıştır
npm run migration:run

# Bir önceki migration'ı geri al
npm run migration:revert

# Migration durumunu göster
npm run migration:show
```

## 🔧 Geliştirme

### Npm Scripts

```bash
npm run start:dev                  # Development modu
npm run start                      # Production modu
npm run build                      # Build oluştur
npm run migration:generate -n Name # Migration oluştur
npm run migration:run              # Migration'ları çalıştır
npm run migration:revert           # Son migration'ı geri al
```

### Yeni Modül Oluşturma

```bash
nest generate module module-name
nest generate controller module-name
nest generate service module-name
```

## 🔒 Güvenlik

- ✅ Şifreler bcrypt ile hashlenir
- ✅ JWT token'lar güvenli secret key ile şifrelenir
- ✅ Input validasyonu class-validator ile yapılır
- ✅ SQL injection'a karşı parametreli sorgular
- ✅ CORS sadece belirtilen frontend URL'ine izin verir
- ✅ Hassas veriler response'larından çıkarılır

---

**Son Güncelleme**: Aralık 2025
