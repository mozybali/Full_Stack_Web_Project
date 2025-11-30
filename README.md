# 🎮 GameVault - Game Account & Key Marketplace

<div align="center">

[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-v11.0-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-v12+-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

**Oyun hesapları ve oyun anahtarları satın almak/satmak için eksiksiz bir marketplace platformu.**

---

**[🚀 Hızlı Başlangıç](#-hızlı-başlangıç) • [📖 Dokümantasyon](#-ek-kaynaklar) • [🔌 API](#-api-endpoints) • [🤝 Katkıda Bulunma](#-katkıda-bulunma)**

</div>

---

## 📋 İçindekiler

- [✨ Özellikler](#-özellikler)
- [🛠️ Teknoloji Stack](#️-teknoloji-stack)
- [🚀 Hızlı Başlangıç](#-hızlı-başlangıç)
- [📦 Kurulum](#-kurulum)
- [🔧 Konfigürasyon](#-konfigürasyon)
- [💻 Geliştirme](#-geliştirme)
- [🏗️ Proje Yapısı](#️-proje-yapısı)
- [🔌 API Endpoints](#-api-endpoints)
- [🗄️ Database Şeması](#️-database-şeması)
- [🐛 Hata Ayıklama](#-hata-ayıklama)
- [📚 Ek Kaynaklar](#-ek-kaynaklar)
- [🤝 Katkıda Bulunma](#-katkıda-bulunma)
- [📄 Lisans](#-lisans)

---

## ✨ Özellikler

### 👥 Kullanıcı Özellikleri
- ✅ **Kimlik Doğrulama** - JWT tabanlı güvenli kayıt ve oturum açma
- ✅ **Profil Yönetimi** - Kullanıcı bilgileri güncelleme
- ✅ **Alışveriş Sepeti** - Ürünleri sepete ekle/çıkar
- ✅ **Sipariş Yönetimi** - Siparişleri takip et ve yönet
- ✅ **Satıcı Paneli** - Ürün ekleme, düzenleme ve silme

### 🛡️ Admin Özellikleri
- ✅ **Kullanıcı Yönetimi** - Kullanıcıları yönet
- ✅ **Ürün Yönetimi** - Tüm ürünleri yönet
- ✅ **Oyun Kataloğu** - Oyun bilgileri ekle ve güncelle
- ✅ **Sipariş Takibi** - Tüm siparişleri izle
- ✅ **İstatistikler** - Platform istatistikleri ve raporlar

### 🔒 Platform Özellikleri
- ✅ **JWT Güvenliği** - Güvenli token tabanlı kimlik doğrulama
- ✅ **RBAC** - Role-Based Access Control (Rol Tabanlı Erişim)
- ✅ **Swagger API** - İnteraktif API dokumentasyonu
- ✅ **Global Hata Yönetimi** - Standardlaştırılmış hata yanıtları
- ✅ **Input Validasyonu** - DTO ve class-validator ile veri doğrulama


---

## 🛠️ Teknoloji Stack

### Backend
| Teknoloji | Versiyon | Kullanım |
|-----------|----------|---------|
| **Node.js** | 18+ | Runtime ortamı |
| **NestJS** | 11.0 | Web framework |
| **TypeScript** | 5.0+ | Statik tiplemeli dil |
| **TypeORM** | 0.3 | ORM ve database yönetim |
| **PostgreSQL** | 12+ | Veritabanı |
| **Passport.js** | - | Kimlik doğrulama stratejileri |
| **Swagger** | OpenAPI | API dokümantasyonu |

### DevOps
| Araç | Kullanım |
|------|---------|
| **Git** | Version control |
| **GitHub** | Repository ve collaboration |
| **npm/yarn** | Package management |

---

## 🚀 Hızlı Başlangıç

### Ön Gereksinimler
```
✓ Node.js 18+ (https://nodejs.org/)
✓ PostgreSQL 12+ (https://www.postgresql.org/)
✓ Git (https://git-scm.com/)
✓ npm veya yarn
```

### 1️⃣ Repository'yi Clone Et
```bash
git clone https://github.com/mozybali/Full_Stack_Web_Project.git
cd Full_Stack_Web_Project
```

### 2️⃣ Backend Kurulumu
```bash
cd backend

# Bağımlılıkları yükle
npm install

# .env dosyası oluştur
cp .env.example .env

# Development sunucusunu başlat
npm run start:dev
```
Backend şu adrese bağlanacak: **http://localhost:3000**
Swagger API dokümantasyonu: **http://localhost:3000/api**

### 3️⃣ Database Kurulumu

TypeORM otomatik olarak tüm tabloları oluşturacaktır. Detaylı veritabanı kurulumu için: [📖 DATABASE.md](./DATABASE.md)

```bash
# PostgreSQL'e bağlan ve database oluştur
psql -U postgres -c "CREATE DATABASE gamevault;"
```

✅ Uygulama başlatıldığında veritabanı senkronize edilecektir.

---

## 📦 Kurulum

### Adım Adım Kurulum

#### Backend Kurulumu
```bash
# Proje dizinine gidin
cd backend

# Bağımlılıkları yükleyin
npm install

# .env dosyası oluşturun
cp .env.example .env

# Development sunucusunu başlatın
npm run start:dev
```

**Mevcut Komutlar:**
```bash
npm run start:dev      # Development mode (hot reload ile)
npm run build          # Production build oluştur
npm start              # Production mode'de çalıştır
```

---

## 🔧 Konfigürasyon

### Backend Environment Variables

`.env.example` dosyasından `.env` dosyasını oluşturun:

```env
# ====================================
# Server Configuration
# ====================================
PORT=3000
NODE_ENV=development

# ====================================
# JWT Configuration
# ====================================
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRATION=86400

# ====================================
# Database Configuration
# ====================================
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=gamevault
DB_LOGGING=false
DB_SYNCHRONIZE=true
```

---

## 💻 Geliştirme

### Proje Başlatma

**Terminal 1 - Backend:**
```bash
cd backend
npm run start:dev
# Swagger: http://localhost:3000/api
```

### Kullanıcı Rolleri

| Rol | İzinler |
|-----|---------|
| **BUYER** | Ürün görüntüleme, sepete ekleme, sipariş oluşturma |
| **SELLER** | Ürün yönetimi (CRUD), kendi siparişlerini görüntüleme |
| **ADMIN** | Tüm yönetim işlemleri, sistem ayarları |

### Geliştirme Yaparken İpuçları

1. **Backend değişiklikleri otomatik yüklenir** (`npm run start:dev` kullanıyorsanız)
2. **API dokümantasyonunu kontrol et**: http://localhost:3000/api
3. **Hata mesajlarını kontrol et**: Server logs

---

## 🏗️ Proje Yapısı

```
web_proje/
│
├── backend/                          # NestJS Backend
│   ├── src/
│   │   ├── app.module.ts             # Root module
│   │   ├── main.ts                   # Bootstrap
│   │   │
│   │   ├── auth/                     # Authentication Module
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── guards/
│   │   │   ├── strategies/
│   │   │   └── dto/
│   │   │
│   │   ├── users/                    # Users Module
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   ├── user.entity.ts
│   │   │   └── dto/
│   │   │
│   │   ├── products/                 # Products Module
│   │   │   ├── products.controller.ts
│   │   │   ├── products.service.ts
│   │   │   ├── product.entity.ts
│   │   │   └── dto/
│   │   │
│   │   ├── orders/                   # Orders Module
│   │   │   ├── orders.controller.ts
│   │   │   ├── orders.service.ts
│   │   │   ├── order.entity.ts
│   │   │   ├── order-item.entity.ts
│   │   │   └── dto/
│   │   │
│   │   ├── games/                    # Games Module
│   │   │   ├── games.controller.ts
│   │   │   ├── games.service.ts
│   │   │   ├── game.entity.ts
│   │   │   └── dto/
│   │   │
│   │   ├── roles/                    # Roles Module
│   │   │   ├── roles.controller.ts
│   │   │   ├── roles.service.ts
│   │   │   ├── role.entity.ts
│   │   │   └── dto/
│   │   │
│   │   ├── common/                   # Shared Module
│   │   │   ├── decorators/           # Custom decorators
│   │   │   ├── guards/               # Authentication guards
│   │   │   ├── filters/              # Exception filters
│   │   │   ├── enums/                # Enums (OrderStatus, ProductType)
│   │   │   └── utils/                # Utility functions
│   │   │
│   │   └── config/                   # Configuration
│   │       └── env.config.ts
│   │
│   ├── package.json
│   ├── tsconfig.json
│   ├── nest-cli.json
│   └── .env.example
│
├── README.md                         # 📘 Bu dosya
├── BACKEND_API.md                    # 📖 Backend API dokümantasyonu
├── DATABASE.md                       # 🗄️ Database kurulumu ve şeması
├── .env.local                        # Environment variables (local)
├── .gitignore                        # Git ignore kuralları
└── .git/                             # Git repository
```

---

## 🔌 API Endpoints

### 🔐 Kimlik Doğrulama (Auth)
```
POST   /auth/register          # Yeni kullanıcı kaydı
POST   /auth/login             # Oturum açma
```

### 👥 Kullanıcılar (Users)
```
GET    /users                  # Tüm kullanıcıları listele [Admin]
GET    /users/:id              # Kullanıcı detayı
DELETE /users/:id              # Kullanıcı sil [Admin]
```

### 🛍️ Ürünler (Products)
```
GET    /products               # Tüm ürünleri listele
GET    /products/:id           # Ürün detayı
POST   /products               # Yeni ürün oluştur [Seller/Admin]
PUT    /products/:id           # Ürün güncelle [Seller/Admin]
DELETE /products/:id           # Ürün sil [Seller/Admin]
```

### 📦 Siparişler (Orders)
```
POST   /orders                 # Sipariş oluştur
GET    /orders/my              # Kendi siparişlerimi getir
GET    /orders                 # Tüm siparişleri getir [Admin]
GET    /orders/:id             # Sipariş detayı
```

### 🎮 Oyunlar (Games)
```
GET    /games                  # Oyun listesi
GET    /games/:id              # Oyun detayı
POST   /games                  # Oyun oluştur [Admin]
PUT    /games/:id              # Oyun güncelle [Admin]
DELETE /games/:id              # Oyun sil [Admin]
```

### 🔑 Roller (Roles)
```
GET    /roles                  # Rol listesi [Admin]
POST   /roles                  # Rol oluştur [Admin]
PUT    /roles/:id              # Rol güncelle [Admin]
DELETE /roles/:id              # Rol sil [Admin]
```

📖 **Detaylı API Dokümantasyonu**: http://localhost:3000/api (Swagger UI)

---

## 🗄️ Database Şeması

Veritabanı tasarımı, tabloları, ilişkileri ve örnek SQL queries için: **[🗄️ DATABASE.md](./DATABASE.md)**

### Hızlı Özet

**7 Ana Tablo:**
- `users` - Kullanıcılar
- `roles` - Roller (BUYER, SELLER, ADMIN)
- `user_roles` - Kullanıcı-Rol ilişkisi (M:N)
- `games` - Oyunlar
- `products` - Satılan ürünler (hesaplar & anahtarlar)
- `orders` - Siparişler
- `order_items` - Sipariş satırları

**3 Enum Tipi:**
- `ProductType` - ACCOUNT, KEY
- `OrderStatus` - PENDING, COMPLETED, CANCELLED

---

## 🧪 Test Etme

### Swagger UI ile API Test
1. **http://localhost:3000/api** adresine gidin
2. Endpoint'i genişletin
3. **"Try it out"** butonuna tıklayın
4. Parametreleri doldurun
5. **"Execute"** yapın

### cURL ile API Test

```bash
# 1. Kullanıcı Kaydı
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "testuser",
    "password": "SecurePass123!"
  }'

# 2. Oturum Açma
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'

# 3. Ürünleri Getir
curl -X GET http://localhost:3000/products \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# 4. Sipariş Oluştur
curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "items": [
      {"productId": 1, "quantity": 1}
    ]
  }'
```

---

## 🐛 Hata Ayıklama

### Yaygın Sorunlar ve Çözümleri

| Problem | Çözüm |
|---------|-------|
| **Port 3000 kullanımda** | `lsof -ti:3000 \| xargs kill -9` |

| **PostgreSQL bağlantısı başarısız** | `psql -U postgres` ile kontrol edin |
| **JWT Token hatası** | `.env` dosyasındaki `JWT_SECRET` kontrol edin |
| **CORS hatası** | `backend/src/main.ts` dosyasında CORS ayarını kontrol edin |
| **Modüller bulunamadı** | `npm install` komutu çalıştırın |

### Debugging İpuçları

1. **Server Logs**: Terminal çıktılarını kontrol edin
2. **Browser Console**: F12 → Console sekmesine bakın
3. **Swagger UI**: http://localhost:3000/api

---

## 📚 Ek Kaynaklar

### Resmi Dokümantasyon
- [NestJS Documentation](https://docs.nestjs.com/)
- [TypeORM Documentation](https://typeorm.io/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

### Proje Dökümentasyonu
- 📖 [BACKEND_API.md](./BACKEND_API.md) - Backend API detayları
- 🗄️ [DATABASE.md](./DATABASE.md) - Database kurulumu ve şeması
- 📖 [README.md](./README.md) - Bu dosya

### Öğrenme Kaynakları
- [JWT Nedir?](https://jwt.io/)
- [RESTful API Best Practices](https://restfulapi.net/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)


---

## 🤝 Katkıda Bulunma

Projeye katkıda bulunmak için:

### 1. Fork Yap
```bash
# GitHub'da "Fork" butonuna tıkla
```

### 2. Clone Et
```bash
git clone https://github.com/YOUR_USERNAME/Full_Stack_Web_Project.git
cd Full_Stack_Web_Project
```

### 3. Feature Branch Oluştur
```bash
git checkout -b feature/amazing-feature
```

### 4. Değişiklikleri Commit Et
```bash
git commit -m "feat: Add amazing feature"
git commit -m "fix: Fix bug in authentication"
git commit -m "docs: Update README"
```

### 5. Branch'i Push Et
```bash
git push origin feature/amazing-feature
```

### 6. Pull Request Aç
GitHub'da Pull Request oluşturun ve değişiklikleri açıklayın.

### Commit Message Convention
```
feat: Yeni özellik ekle
fix: Bug düzelt
docs: Dokümantasyon güncelle
style: Kod stili değiştir
refactor: Kodu yeniden düzenle
perf: Performansı iyileştir
test: Test ekle
chore: Build veya dependency güncelleme
```

---

## 📄 Lisans

Bu proje **MIT Lisansı** altında yayınlanmıştır.

Daha fazla bilgi için bkz: [LICENSE](./LICENSE)

---

## 👤 Yazar

**Hector** - Full Stack Developer

- 🔗 GitHub: [@mozybali](https://github.com/mozybali)
- 📧 Email: [İletişim bilgisi ekleyin]

---

## 🙏 Teşekkürler

Bu proje aşağıdaki harika projeler ve kütüphaneler tarafından güçlendirilmektedir:

- [NestJS](https://nestjs.com/) - Progressive Node.js framework
- [TypeORM](https://typeorm.io/) - ORM for TypeScript and JavaScript
- [PostgreSQL](https://www.postgresql.org/) - Advanced open source database

---

<div align="center">

### ⭐ Eğer bu proje beğendiysen, yıldız vermeyi unutma!

**[⬆ Başa Dön](#-gamevault---game-account--key-marketplace)**

</div>
