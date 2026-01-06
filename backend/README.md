# 🎮 GamerMarkt Backend API

Oyun hesapları ve oyun lisans anahtarlarının satışı yapılan modern e-ticaret platformunun RESTful API backend'i. NestJS 11, TypeScript 5.4, PostgreSQL ve TypeORM 0.3 ile geliştirilmiştir.

## 📋 İçindekiler

- [Özellikler](#-özellikler)
- [Teknolojiler](#-teknolojiler)
- [Gereksinimler](#-gereksinimler)
- [Kurulum](#-kurulum)
- [Yapılandırma](#-yapılandırma)
- [Veritabanı](#-veritabanı)
- [Proje Yapısı](#-proje-yapısı)
- [API Dokümantasyonu](#-api-dokümantasyonu)
- [Geliştirme](#-geliştirme)
- [Güvenlik](#-güvenlik)

## ✨ Özellikler

### Kimlik Doğrulama & Yetkilendirme
- JWT tabanlı stateless authentication
- Kullanıcı kaydı ve girişi
- Şifre hashleme (bcrypt)
- Rol tabanlı yetkilendirme (RBAC)
- Guard'lar ile endpoint koruması

### Kullanıcı Yönetimi
- Kullanıcı CRUD işlemleri
- Kullanıcı profil yönetimi
- Rol atama ve yönetimi
- Kullanıcı listesi ve detayları

### Ürün Yönetimi
- Ürün CRUD işlemleri
- Ürün görseli yükleme ve optimizasyonu
- Ürün filtreleme ve arama
- Stok takibi

### Sipariş Sistemi
- Sipariş oluşturma ve yönetimi
- Sipariş durumu takibi (Pending, Completed, Cancelled)
- Sipariş geçmişi
- Sipariş detayları ve sipariş kalemleri
- Kullanıcı bazlı sipariş filtreleme

### Oyun Kataloğu
- Oyun listesi yönetimi (CRUD)
- Oyun bilgileri (platform, tür, açıklama)
- Oyun bazlı ürün organizasyonu

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
DB_USER=your_database_user
DB_PASS=your_secure_database_password
DB_NAME=your_database_name

# JWT
JWT_SECRET=your_secure_jwt_secret_key_minimum_32_characters
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:5173

# Database
DB_LOGGING=false
```

**Güvenlik Uyarısı**: `.env` dosyasını asla git repository'sine commit etmeyin!

### 3. Veritabanını Oluşturun
```bash
createdb your_database_name
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
| `DB_PORT` | Veritabanı port | `5432` |
| `DB_USER` | Veritabanı kullanıcısı | `your_db_user` |
| `DB_PASS` | Veritabanı şifresi | `your_secure_password` |
| `DB_NAME` | Veritabanı adı | `your_database_name` |
| `JWT_SECRET` | JWT şifreleme anahtarı (min 32 char) | `your_jwt_secret_min_32_chars` |
| `JWT_EXPIRES_IN` | Token geçerlilik süresi | `7d` |
| `CORS_ORIGIN` | Frontend URL (CORS) | `http://localhost:5173` |
| `DB_LOGGING` | SQL query logları | `false` |

## 📁 Proje Yapısı

```
backend/
├── src/
│   ├── auth/                      # Kimlik doğrulama modülü
│   │   ├── guards/               # JWT ve Roles guard'ları
│   │   ├── strategies/           # Passport JWT stratejisi
│   │   ├── dto/                  # Login/Register DTO'ları
│   │   ├── interfaces/           # Auth interface'leri
│   │   ├── auth.controller.ts    # Auth endpoint'leri
│   │   ├── auth.service.ts       # Auth business logic
│   │   └── auth.module.ts
│   │
│   ├── users/                     # Kullanıcı yönetimi
│   │   ├── dto/                  # User DTO'ları
│   │   ├── user.entity.ts        # User entity
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── users.module.ts
│   │
│   ├── roles/                     # Rol yönetimi
│   │   ├── dto/                  # Role DTO'ları
│   │   ├── role.entity.ts        # Role entity
│   │   ├── roles.controller.ts
│   │   ├── roles.service.ts
│   │   └── roles.module.ts
│   │
│   ├── games/                     # Oyun kataloğu
│   │   ├── dto/                  # Game DTO'ları
│   │   ├── game.entity.ts        # Game entity
│   │   ├── games.controller.ts
│   │   ├── games.service.ts
│   │   └── games.module.ts
│   │
│   ├── products/                  # Ürün yönetimi
│   │   ├── dto/                  # Product DTO'ları
│   │   ├── product.entity.ts     # Product entity
│   │   ├── products.controller.ts
│   │   ├── products.service.ts
│   │   └── products.module.ts
│   │
│   ├── orders/                    # Sipariş sistemi
│   │   ├── dto/                  # Order DTO'ları
│   │   ├── order.entity.ts       # Order entity
│   │   ├── order-item.entity.ts  # OrderItem entity
│   │   ├── orders.controller.ts
│   │   ├── orders.service.ts
│   │   └── orders.module.ts
│   │
│   ├── upload/                    # Dosya yükleme servisi
│   │   ├── upload.service.ts     # File upload logic
│   │   └── upload.module.ts
│   │
│   ├── common/                    # Paylaşılan modüller
│   │   ├── decorators/           # Custom decorator'lar (Roles, Public)
│   │   ├── guards/               # Custom guard'lar
│   │   ├── interceptors/         # Global interceptor'lar
│   │   ├── filters/              # Exception filter'ları
│   │   ├── enums/                # Enum tanımları (OrderStatus, etc.)
│   │   └── utils/                # Yardımcı fonksiyonlar
│   │
│   ├── config/                    # Yapılandırma
│   │   ├── env.config.ts         # Environment variable config
│   │   └── multer.config.ts      # File upload config
│   │
│   ├── migrations/                # TypeORM migration'ları
│   │   ├── 1765030683564-InitialSchema.ts
│   │   └── 1765216021828-AddCascadeDeleteConstraints.ts
│   │
│   ├── scripts/                   # Yardımcı script'ler
│   ├── data-source.ts            # TypeORM DataSource
│   ├── app.module.ts             # Ana uygulama modülü
│   └── main.ts                   # Uygulama giriş noktası
│
├── uploads/                       # Yüklenen dosyalar
│   └── products/                 # Ürün görselleri
├── package.json
├── tsconfig.json
├── tsconfig.build.json
├── nest-cli.json
└── README.md
```

### Modül Yapısı

Her feature modülü aşağıdaki yapıyı takip eder:
- **Entity**: TypeORM veritabanı entity'si
- **DTO**: Data Transfer Objects (validation ile)
- **Service**: Business logic ve veritabanı işlemleri
- **Controller**: HTTP endpoint'ler ve routing
- **Module**: Dependency injection container

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

### Uygulanan Güvenlik Önlemleri

- ✅ **Şifre Hashleme**: bcrypt ile güvenli şifre saklama
- ✅ **JWT Authentication**: Token tabanlı stateless oturum yönetimi
- ✅ **Role-Based Access Control**: Guard'lar ile endpoint koruması
- ✅ **Input Validation**: class-validator ile DTO validasyonu
- ✅ **SQL Injection Koruması**: TypeORM parametreli sorgular
- ✅ **CORS Yapılandırması**: Sadece belirtilen origin'e izin
- ✅ **Hassas Veri Koruması**: Response'lardan password gibi alanlar çıkarılır
- ✅ **File Upload Güvenliği**: Multer ile dosya tipi ve boyut kontrolü
- ✅ **Global Exception Handling**: Standardize hata yönetimi

### Best Practices

- JWT secret key minimum 32 karakter uzunluğunda, rastgele ve güçlü olmalıdır
- Veritabanı şifreleri güçlü olmalı ve düzenli olarak değiştirilmelidir
- Production ortamında DB_LOGGING kapatılmalıdır
- .env dosyası asla git'e commit edilmemelidir (`.gitignore`'a eklenmelidir)
- CORS_ORIGIN production URL'i ile değiştirilmelidir
- Production ortamında hassas bilgiler environment variables olarak yönetilmelidir

---

**Son Güncelleme**: Aralık 2025
