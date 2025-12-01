# 🎮 GameVault - Oyun Hesabı ve Lisans Satış Platformu

GameVault, oyun hesapları ve oyun lisans anahtarlarının güvenli bir şekilde alınıp satılabildiği modern bir e-ticaret platformudur. NestJS framework'ü ile geliştirilmiş RESTful API backend'i içerir.

## 📋 İçindekiler

- [Özellikler](#-özellikler)
- [Teknolojiler](#-teknolojiler)
- [Kurulum](#-kurulum)
- [Yapılandırma](#-yapılandırma)
- [Veritabanı](#-veritabanı)
- [API Kullanımı](#-api-kullanımı)
- [Proje Yapısı](#-proje-yapısı)
- [Geliştirme](#-geliştirme)
- [Güvenlik](#-güvenlik)

## ✨ Özellikler

### Kullanıcı Yönetimi
- 👤 Kullanıcı kaydı ve girişi
- 🔐 JWT tabanlı kimlik doğrulama
- 🎭 Rol tabanlı yetkilendirme (Admin, Moderator, User)
- 👥 Kullanıcı profil yönetimi

### Ürün Yönetimi
- 🎮 Oyun hesapları ve lisans anahtarları satışı
- 📦 Ürün CRUD işlemleri
- 🖼️ Ürün görseli yükleme
- 💰 Fiyatlandırma ve stok takibi
- 🔍 Ürün filtreleme ve arama

### Sipariş Sistemi
- 🛒 Sepet ve sipariş oluşturma
- 📊 Sipariş durumu takibi (Pending, Completed, Cancelled)
- 💳 Sipariş geçmişi
- 📈 Satıcı için sipariş yönetimi

### Oyun Katalog
- 🎯 Oyun listesi yönetimi
- 🎨 Platform ve tür bilgileri
- 📚 Oyun bazlı ürün organizasyonu

### Dosya Yönetimi
- 📤 Güvenli dosya yükleme (Multer)
- 🖼️ Görsel optimizasyonu (Sharp)
- 📁 Organize dosya depolama

## 🛠 Teknolojiler

### Backend Framework ve Dil
- **NestJS** (v11.x) - Progressive Node.js framework
- **TypeScript** (v5.x) - Tip güvenli JavaScript

### Veritabanı
- **PostgreSQL** - İlişkisel veritabanı
- **TypeORM** (v0.3.x) - ORM kütüphanesi

### Kimlik Doğrulama ve Güvenlik
- **Passport** & **Passport-JWT** - Authentication middleware
- **bcrypt** - Şifre hashleme
- **JWT** - Token tabanlı authentication

### Validasyon ve Dönüşüm
- **class-validator** - DTO validasyonu
- **class-transformer** - Object transformation

### Dosya İşleme
- **Multer** - Dosya yükleme middleware
- **Sharp** - Görsel işleme ve optimizasyon

### API Dokümantasyonu
- **Swagger / OpenAPI** - Otomatik API dokümantasyonu

## 📦 Kurulum

### Gereksinimler

- Node.js (v18.x veya üzeri)
- npm veya yarn
- PostgreSQL (v14.x veya üzeri)

### Adımlar

1. **Projeyi klonlayın**
```bash
git clone <repository-url>
cd web_proje/backend
```

2. **Bağımlılıkları yükleyin**
```bash
npm install
```

3. **Ortam değişkenlerini yapılandırın**

`.env` dosyası oluşturun (aşağıdaki Yapılandırma bölümüne bakın)

4. **Veritabanını oluşturun**
```bash
# PostgreSQL'e bağlanın
psql -U postgres

# Veritabanını oluşturun
CREATE DATABASE gamevault_db;
```

5. **Uygulamayı başlatın**
```bash
# Development modu
npm run start:dev

# Production build
npm run build
npm run start
```

Uygulama varsayılan olarak `http://localhost:3000` adresinde çalışacaktır.

## ⚙️ Yapılandırma

Aşağıdaki ortam değişkenlerini `.env` dosyasında tanımlayın:

```env
# Sunucu Ayarları
PORT=3000
NODE_ENV=development

# Veritabanı Ayarları
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_db_username
DB_PASS=your_db_password
DB_NAME=gamevault_db

# JWT Ayarları
JWT_SECRET=your_very_secure_random_secret_key_here
JWT_EXPIRES_IN=7d

# CORS Ayarları
CORS_ORIGIN=http://localhost:3001

# Opsiyonel: Veritabanı Logging
DB_LOGGING=false
```

### Önemli Notlar

- `JWT_SECRET`: Güçlü, rastgele bir string kullanın (en az 32 karakter önerilir)
- `NODE_ENV`: Production'da mutlaka `production` olarak ayarlayın
- `CORS_ORIGIN`: Frontend uygulamanızın URL'ini belirtin

## 🗄️ Veritabanı

### Entity İlişkileri

```
User (Kullanıcılar)
├── roles (ManyToMany) → Role
├── products (OneToMany) → Product (satıcı olarak)
└── orders (OneToMany) → Order (alıcı olarak)

Game (Oyunlar)
└── products (OneToMany) → Product

Product (Ürünler)
├── seller (ManyToOne) → User
├── game (ManyToOne) → Game
└── orderItems (OneToMany) → OrderItem

Order (Siparişler)
├── buyer (ManyToOne) → User
└── items (OneToMany) → OrderItem

OrderItem (Sipariş Kalemleri)
├── order (ManyToOne) → Order
└── product (ManyToOne) → Product
```

### Otomatik Seed Data

Uygulama ilk başlatıldığında otomatik olarak şu veriler oluşturulur:

- **Roller**: Admin, Moderator, User
- Varsayılan admin hesabı (opsiyonel)

### Migration Notları

⚠️ **Önemli**: `synchronize: true` sadece development ortamında kullanılır. Production'da TypeORM migration'ları kullanılmalıdır.

## 🚀 API Kullanımı

### API Dokümantasyonu

Swagger UI ile interaktif API dokümantasyonuna erişin:
```
http://localhost:3000/api
```

### Ana Endpoint'ler

#### 🔐 Authentication
```
POST   /auth/register     - Yeni kullanıcı kaydı
POST   /auth/login        - Kullanıcı girişi
```

#### 👤 Users
```
GET    /users             - Tüm kullanıcıları listele (Admin)
GET    /users/:id         - Kullanıcı detayı
PATCH  /users/:id         - Kullanıcı güncelle
DELETE /users/:id         - Kullanıcı sil (Admin)
```

#### 🎭 Roles
```
GET    /roles             - Tüm rolleri listele
POST   /roles             - Yeni rol oluştur (Admin)
GET    /roles/:id         - Rol detayı
DELETE /roles/:id         - Rol sil (Admin)
```

#### 🎮 Games
```
GET    /games             - Tüm oyunları listele
POST   /games             - Yeni oyun ekle (Admin/Moderator)
GET    /games/:id         - Oyun detayı
PATCH  /games/:id         - Oyun güncelle (Admin/Moderator)
DELETE /games/:id         - Oyun sil (Admin)
```

#### 📦 Products
```
GET    /products          - Tüm ürünleri listele
POST   /products          - Yeni ürün ekle
GET    /products/:id      - Ürün detayı
PATCH  /products/:id      - Ürün güncelle
DELETE /products/:id      - Ürün sil
POST   /products/:id/upload-image - Ürün görseli yükle
```

#### 🛒 Orders
```
GET    /orders            - Siparişleri listele
POST   /orders            - Yeni sipariş oluştur
GET    /orders/:id        - Sipariş detayı
PATCH  /orders/:id/status - Sipariş durumunu güncelle
```

### Kimlik Doğrulama

API'ye erişim için JWT token kullanın:

1. `/auth/login` endpoint'ine email ve şifre gönderin
2. Dönen `accessToken`'ı alın
3. Sonraki isteklerde Authorization header'ı ekleyin:

```
Authorization: Bearer <your_access_token>
```

## 📁 Proje Yapısı

```
backend/
├── src/
│   ├── auth/                    # Kimlik doğrulama modülü
│   │   ├── guards/             # JWT guard'ları
│   │   ├── strategies/         # Passport stratejileri
│   │   └── dto/                # Login/Register DTO'ları
│   │
│   ├── users/                   # Kullanıcı yönetimi
│   │   ├── user.entity.ts      # User entity
│   │   └── dto/                # User DTO'ları
│   │
│   ├── roles/                   # Rol yönetimi
│   │   ├── role.entity.ts      # Role entity
│   │   └── dto/
│   │
│   ├── games/                   # Oyun yönetimi
│   │   ├── game.entity.ts      # Game entity
│   │   └── dto/
│   │
│   ├── products/                # Ürün yönetimi
│   │   ├── product.entity.ts   # Product entity
│   │   └── dto/
│   │
│   ├── orders/                  # Sipariş yönetimi
│   │   ├── order.entity.ts     # Order entity
│   │   ├── order-item.entity.ts
│   │   └── dto/
│   │
│   ├── common/                  # Paylaşılan modüller
│   │   ├── decorators/         # Custom decorator'lar
│   │   ├── guards/             # Custom guard'lar (RolesGuard)
│   │   ├── interceptors/       # Global interceptor'lar
│   │   ├── filters/            # Exception filter'ları
│   │   ├── enums/              # Enum tanımları
│   │   └── utils/              # Yardımcı fonksiyonlar
│   │
│   ├── config/                  # Yapılandırma dosyaları
│   │   ├── env.config.ts       # Ortam değişkenleri
│   │   └── multer.config.ts    # Dosya yükleme config
│   │
│   ├── seeding/                 # Database seeding
│   │   └── seeding.service.ts  # Seed servisi
│   │
│   ├── upload/                  # Dosya yükleme servisi
│   │
│   ├── app.module.ts            # Ana uygulama modülü
│   └── main.ts                  # Uygulama giriş noktası
│
├── uploads/                     # Yüklenen dosyalar (gitignore)
│   └── products/               # Ürün görselleri
│
├── package.json
├── tsconfig.json
├── nest-cli.json
└── .env                        # Ortam değişkenleri (gitignore)
```

## 🔧 Geliştirme

### Yeni Modül Ekleme

```bash
# NestJS CLI ile modül oluşturma
nest generate module <module-name>
nest generate controller <module-name>
nest generate service <module-name>
```
## 🔒 Güvenlik

### Uygulanan Güvenlik Önlemleri

- ✅ **Şifre Hashleme**: bcrypt ile güvenli şifre saklama
- ✅ **JWT Authentication**: Token tabanlı oturum yönetimi
- ✅ **Role-Based Access Control**: Rol bazlı yetkilendirme
- ✅ **Input Validation**: class-validator ile giriş doğrulama
- ✅ **CORS Yapılandırması**: Cross-origin güvenliği
- ✅ **Global Exception Handling**: Hata yönetimi
- ✅ **SQL Injection Koruması**: TypeORM parametreli sorgular
- ✅ **File Upload Güvenliği**: Dosya tipi ve boyut kontrolü

## 📝 Lisans

Bu proje eğitim amaçlı geliştirilmiştir.

## 👨‍💻 Geliştirici

Herhangi bir soru veya öneriniz için lütfen issue açın.

---

