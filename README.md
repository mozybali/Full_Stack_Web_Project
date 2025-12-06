# 🎮 GamerMarkt - Oyun Hesabı ve Lisans Satış Platformu

GamerMarkt, oyun hesapları ve oyun lisans anahtarlarının güvenli bir şekilde alınıp satılabildiği modern bir e-ticaret platformudur. React ve TypeScript tabanlı frontend ile NestJS framework'ü ile geliştirilmiş RESTful API backend'ine sahiptir.

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

### Backend
- **NestJS** (v11.x) - Progressive Node.js framework
- **TypeScript** (v5.4+) - Tip güvenli JavaScript
- **PostgreSQL** - İlişkisel veritabanı
- **TypeORM** (v0.3.x) - ORM kütüphanesi
- **Passport & JWT** - Kimlik doğrulama
- **bcrypt** - Şifre hashleme
- **Multer** - Dosya yükleme
- **Sharp** - Görsel işleme ve optimizasyon
- **Swagger/OpenAPI** - API dokümantasyonu

### Frontend
- **React** (v19.2+) - UI framework
- **TypeScript** (v5.9+) - Tip güvenli JavaScript
- **Vite** (v7.2+) - Build tool
- **React Router** (v7.10+) - Routing
- **Axios** - HTTP client
- **Tailwind CSS** (v3.4+) - Styling
- **React Icons** - Icon library

## 📦 Kurulum

### Gereksinimler

- Node.js (v18.x veya üzeri)
- npm veya yarn
- PostgreSQL (v14.x veya üzeri)

### Backend Kurulumu

1. **Backend dizinine gidin**
```bash
cd web_proje/backend
```

2. **Bağımlılıkları yükleyin**
```bash
npm install
```

3. **Ortam değişkenlerini yapılandırın** (aşağıdaki Yapılandırma bölümüne bakın)

4. **Veritabanını oluşturun**
```bash
# PostgreSQL'e bağlanıp veritabanı oluşturun
createdb gamevault_db
```

5. **Uygulamayı başlatın**
```bash
# Development modu (hot reload aktif)
npm run start:dev

# Production build
npm run build
npm run start
```

Backend varsayılan olarak `http://localhost:3000` adresinde çalışır.

### Frontend Kurulumu

1. **Frontend dizinine gidin**
```bash
cd web_proje/frontend
```

2. **Bağımlılıkları yükleyin**
```bash
npm install
```

3. **Geliştirme sunucusunu başlatın**
```bash
npm run dev
```

Frontend varsayılan olarak `http://localhost:5173` adresinde çalışır.

## ⚙️ Yapılandırma

Backend `.env` dosyası oluşturun:

```env
# Sunucu
PORT=3000
NODE_ENV=development

# Veritabanı
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=your_password
DB_NAME=your_db_name

# JWT
JWT_SECRET=your_secret_key_min_32_chars
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:5173

# Database
DB_LOGGING=false
```

### Önemli Notlar

- `JWT_SECRET`: En az 32 karakter uzunluğunda güçlü bir şifre kullanın
- `NODE_ENV`: Production ortamında `production` olarak ayarlayın
- `CORS_ORIGIN`: Frontend uygulamanızın URL'ini belirtin
- `.env` dosyasını **asla** git repository'sine commit etmeyin

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

### Migration Yönetimi

Veritabanı değişiklikleri TypeORM migration'ları ile yönetilir:

```bash
# Migration oluştur
npm run migration:generate -- -n MigrationName

# Migration'ları çalıştır
npm run migration:run

# Migration'ları geri al
npm run migration:revert

# Mevcut migration'ları göster
npm run migration:show
```

### Seed Data

Uygulama ilk başlatıldığında varsayılan roller otomatik olarak oluşturulur:
- **Admin** - Tam yönetim yetkisi
- **Moderator** - Moderation işlemleri
- **User** - Standart kullanıcı

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
web_proje/
│
├── backend/                     # NestJS Backend
│   ├── src/
│   │   ├── auth/                # Kimlik doğrulama modülü
│   │   │   ├── guards/         # JWT, Roles guard'ları
│   │   │   ├── strategies/     # Passport stratejileri
│   │   │   ├── dto/            # Login/Register DTO'ları
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   └── auth.module.ts
│   │   │
│   │   ├── users/               # Kullanıcı yönetimi
│   │   │   ├── user.entity.ts
│   │   │   ├── dto/
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   └── users.module.ts
│   │   │
│   │   ├── roles/               # Rol yönetimi
│   │   │   ├── role.entity.ts
│   │   │   ├── dto/
│   │   │   ├── roles.controller.ts
│   │   │   ├── roles.service.ts
│   │   │   └── roles.module.ts
│   │   │
│   │   ├── games/               # Oyun yönetimi
│   │   │   ├── game.entity.ts
│   │   │   ├── dto/
│   │   │   ├── games.controller.ts
│   │   │   ├── games.service.ts
│   │   │   └── games.module.ts
│   │   │
│   │   ├── products/            # Ürün yönetimi
│   │   │   ├── product.entity.ts
│   │   │   ├── dto/
│   │   │   ├── products.controller.ts
│   │   │   ├── products.service.ts
│   │   │   └── products.module.ts
│   │   │
│   │   ├── orders/              # Sipariş yönetimi
│   │   │   ├── order.entity.ts
│   │   │   ├── order-item.entity.ts
│   │   │   ├── dto/
│   │   │   ├── orders.controller.ts
│   │   │   ├── orders.service.ts
│   │   │   └── orders.module.ts
│   │   │
│   │   ├── common/              # Paylaşılan modüller
│   │   │   ├── decorators/     # Custom decorator'lar
│   │   │   ├── guards/         # Custom guard'lar
│   │   │   ├── interceptors/   # Global interceptor'lar
│   │   │   ├── filters/        # Exception handler'ları
│   │   │   ├── enums/          # Enum tanımları
│   │   │   └── utils/          # Yardımcı fonksiyonlar
│   │   │
│   │   ├── config/              # Yapılandırma
│   │   │   ├── env.config.ts
│   │   │   └── multer.config.ts
│   │   │
│   │   ├── upload/              # Dosya yükleme servisi
│   │   ├── migrations/          # Database migration'ları
│   │   ├── app.module.ts        # Ana modül
│   │   ├── data-source.ts       # TypeORM config
│   │   └── main.ts              # Giriş noktası
│   │
│   ├── uploads/                 # Yüklenen dosyalar
│   ├── package.json
│   ├── tsconfig.json
│   └── nest-cli.json
│
└── frontend/                    # React Frontend
    ├── src/
    │   ├── components/          # React komponenti
    │   │   ├── ui/             # UI komponenti
    │   │   ├── admin/          # Admin paneli
    │   │   ├── Footer.tsx
    │   │   ├── Navbar.tsx
    │   │   ├── ProductCard.tsx
    │   │   ├── LoadingScreen.tsx
    │   │   └── ProtectedRoute.tsx
    │   │
    │   ├── pages/              # Sayfalar
    │   │   ├── Home.tsx
    │   │   ├── Products.tsx
    │   │   ├── ProductDetail.tsx
    │   │   ├── Cart.tsx
    │   │   ├── Orders.tsx
    │   │   ├── Admin.tsx
    │   │   ├── Login.tsx
    │   │   ├── Register.tsx
    │   │   └── NotFound.tsx
    │   │
    │   ├── services/           # API servisleri
    │   │   ├── auth.service.ts
    │   │   ├── product.service.ts
    │   │   ├── order.service.ts
    │   │   ├── game.service.ts
    │   │   ├── user.service.ts
    │   │   ├── axios.ts        # Axios config
    │   │   └── index.ts
    │   │
    │   ├── hooks/              # Custom React hook'ları
    │   │   ├── useProducts.ts
    │   │   ├── useOrders.ts
    │   │   ├── useGames.ts
    │   │   ├── useFilter.ts
    │   │   └── index.ts
    │   │
    │   ├── context/            # React Context
    │   │   ├── AuthContext.tsx
    │   │   └── CartContext.tsx
    │   │
    │   ├── layouts/            # Layout komponenti
    │   │   ├── MainLayout.tsx
    │   │   ├── PageContainer.tsx
    │   │   └── index.ts
    │   │
    │   ├── config/             # Konfigürasyon
    │   │   ├── constants.ts
    │   │   └── index.ts
    │   │
    │   ├── types/              # TypeScript type'ları
    │   │   └── index.ts
    │   │
    │   ├── assets/             # Statik dosyalar
    │   ├── App.tsx
    │   ├── App.css
    │   ├── index.css
    │   └── main.tsx
    │
    ├── public/                 # Statik public dosyalar
    ├── package.json
    ├── vite.config.ts
    ├── tailwind.config.js
    ├── tsconfig.json
    ├── eslint.config.js
    └── postcss.config.js
```

## 🔧 Geliştirme

### Backend Geliştirme

#### NestJS CLI ile Modül Oluşturma

```bash
# Modül oluştur
nest generate module <module-name>

# Controller oluştur
nest generate controller <module-name>

# Service oluştur
nest generate service <module-name>
```

#### Veritabanı Migration'ları

```bash
# Değişiklikleri analiz ederek migration oluştur
npm run migration:generate -- -n MigrationName

# Yeni migration oluştur
npm run migration:create -- -n MigrationName

# Migration'ları çalıştır
npm run migration:run

# Bir önceki migration'ı geri al
npm run migration:revert
```

### Frontend Geliştirme

#### Yarn/NPM Scripts

```bash
# Geliştirme sunucusunu başlat
npm run dev

# Production build
npm run build

# Build'i preview et
npm run preview

# ESLint check
npm run lint
```

### Vite Build

Frontend, Vite ile optimize edilmiş build'ler oluşturur:
- Development: Hot Module Replacement (HMR) desteğiyle hızlı geliştirme
- Production: Minified ve optimized dosyalar
## 🔒 Güvenlik

### Uygulanan Güvenlik Önlemleri

- ✅ **Şifre Hashleme**: bcrypt ile güvenli şifre saklama
- ✅ **JWT Authentication**: Token tabanlı stateless oturum yönetimi
- ✅ **Role-Based Access Control (RBAC)**: Granüler yetkilendirme
- ✅ **Input Validation**: class-validator ile DTO validasyonu
- ✅ **CORS Yapılandırması**: Cross-origin güvenliği
- ✅ **Global Exception Handling**: Standardize hata yönetimi
- ✅ **SQL Injection Koruması**: TypeORM parametreli sorgular
- ✅ **File Upload Güvenliği**: Dosya tipi ve boyut kontrolü
- ✅ **Environment Variables**: Hassas bilgilerin ayrı yönetimi

### Best Practices

- Database sorguları parametreli hale getirilir (SQL injection önlemi)
- API responses'ında hassas bilgiler (şifre, token vb.) döndürülmez
- JWT secret key'i güçlü ve rastgele olmalıdır
- Production ortamında debug bilgileri devre dışı bırakılır

## 📝 Lisans

Bu proje **MIT Lisansı** altında yayımlanmıştır.

### MIT Lisansı Özeti

MIT Lisansı, açık kaynak yazılımlar için en permissif lisanslardan biridir. Temel haklarınız:

- ✅ **Ticari Kullanım**: Projeyi ticari amaçlar için kullanabilirsiniz
- ✅ **Değişiklik**: Kodu değiştirebilir ve kustomize edebilirsiniz
- ✅ **Dağıtım**: Projeyi başka kişilere veya kuruluşlara dağıtabilirsiniz
- ✅ **Özel Kullanım**: Kapalı kaynak olarak kullanabilirsiniz

### Şartlar

- ⚠️ **Lisans ve Copyright Notu**: MIT lisans metnini ve copyright bildirimi orijinal dağıtımda bulundurmalısınız
- ⚠️ **Sorumluluk Reddi**: Yazılım "olduğu gibi" sağlanır, herhangi bir garantisi yoktur

### Daha Fazla Bilgi

Tam lisans metni için: [MIT License](https://opensource.org/licenses/MIT)

## 👨‍💻 Katkıda Bulunma

Herhangi bir soru, hata raporlaması veya öneriniz için lütfen issue açın.

---

**Son Güncelleme**: Aralık 2025

