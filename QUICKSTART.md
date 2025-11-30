# 🚀 Hızlı Başlangıç Rehberi (Quick Start)

5 dakika içinde projeyı ayağa kaldırın!

---

## 📋 Ön Gereksinimler

Sisteminizde yüklü olmalıdır:
- [ ] Node.js 18+ ([İndir](https://nodejs.org/))
- [ ] PostgreSQL 12+ ([İndir](https://www.postgresql.org/))
- [ ] Git

Versiyonları kontrol edin:
```bash
node --version    # v18.0.0 veya daha yüksek
npm --version     # 9.0.0 veya daha yüksek
psql --version    # PostgreSQL 12+ or higher
```

---

## 🗄️ Adım 1: Database Kurulumu (2 dakika)

### PostgreSQL'i Başlatın

```bash
# macOS (Homebrew ile kurulu ise)
brew services start postgresql

# Linux
sudo service postgresql start

# Windows
# PostgreSQL installer başlatılmışsa otomatik çalışır
```

### Database Oluşturun

```bash
# PostgreSQL CLI'ye bağlanın
psql -U postgres

# Database oluşturun
CREATE DATABASE gamevault;

# Çıkış
\q
```

✅ Database hazır!

---

## 🔧 Adım 2: Backend Kurulumu (2 dakika)

---

## 🧪 Hızlı Test

### 1. API Test Et

```bash
# Terminal açın ve test edin
curl http://localhost:3000/api
```

### 2. Yeni Kullanıcı Oluştur

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "Password123!"
  }'
```

Expected response:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "test@example.com",
    "username": "testuser",
    "roles": ["BUYER"]
  }
}
```

### 3. Backend'i Ziyaret Et

- [http://localhost:3000/api](http://localhost:3000/api) - Swagger API Dokümantasyonu

✅ Her şey çalışıyor!

---

## 🛑 Sorun Giderme

### Port 3000 Zaten Kullanımda

### Database Bağlantı Hatası
```bash
# PostgreSQL çalışıyor mu kontrol edin
psql -U postgres -d gamevault

# Çalışmıyorsa başlatın
brew services start postgresql

# Alternatif: psql server'ını başlatın
pg_ctl -D /usr/local/var/postgres start
```

### npm install Hatası
```bash
# Node modules'ü silin ve yeniden yükleyin
rm -rf node_modules package-lock.json
npm install
```

### Port 3000'e bağlanılamıyor
Backend'in gerçekten çalıştığını kontrol edin:
```bash
cd backend
npm run start:dev
```

---

## 📚 Sonraki Adımlar

Artık proje çalışıyor! Devamında:

1. **Temel Bilgileri Öğren**
   - [README.md](./README.md) - Proje hakkında
   - [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md) - Dokümantasyon indeksi

2. **API'yi Keşfet**
   - [http://localhost:3000/api](http://localhost:3000/api) - Swagger UI
   - [BACKEND_API.md](./BACKEND_API.md) - Detaylı API doc

3. **Database'i Araştır**
   - [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) - Veritabanı tasarımı
   - pgAdmin veya DBeaver ile tabloları inceleyin

---

## 💻 Genel Komutlar

### Backend

```bash
cd backend

# Development mode
npm run start:dev

# Production build
npm run build

# Production çalıştır
npm start

# Tests çalıştır
npm test

# Linting
npm run lint
```

### Frontend

```bash
cd frontend

# Development server
npm run dev

# Production build
npm run build

# Preview build
npm run preview

# Linting
npm run lint
```

### Database

```bash
# PostgreSQL CLI'ye bağlan
psql -U postgres -d gamevault

# Tabloleri listele
\dt

# Veritabanlarını listele
\l

# Çık
\q
```

---

## 🎯 Yaygın Görevler

### Yeni Ürün Ekle

```bash
# Token al
TOKEN=$(curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Password123!"}' \
  | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)

# Ürün ekle
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Steam Account",
    "description": "AAA games",
    "type": "ACCOUNT",
    "price": 100,
    "stock": 5,
    "gameId": 1
  }'
```

### Siparişleri Listele

```bash
# Token al
TOKEN=$(curl ... # login endpoint'i kullanın)

# Kendi siparişlerinizi listeleyin
curl -X GET http://localhost:3000/orders/my \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🚀 Production'a Hazırlık

Üretime gitmeden:

1. **Environment Variables'ı Güncelle**
   ```bash
   # backend/.env
   NODE_ENV=production
   JWT_SECRET=use-secure-random-key
   DB_HOST=production-db-host
   ```

2. **Build Et**
   ```bash
   cd backend && npm run build
   cd frontend && npm run build
   ```

3. **Tests Çalıştır**
   ```bash
   npm test
   ```

4. **Deployment Yapılandırmasını Hazırla**
   - Docker Compose
   - Heroku / Vercel / AWS

---

## 📞 Yardım Alma

- **Swagger UI**: http://localhost:3000/api
- **Dokümantasyon**: Bkz. [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md)
- **API Doc**: [BACKEND_API.md](./BACKEND_API.md)
- **Frontend Doc**: [FRONTEND_GUIDE.md](./FRONTEND_GUIDE.md)

---

## ✅ Başlangıç Kontrol Listesi

Projeyi ayağa kaldırmak için:

- [ ] Node.js, npm, PostgreSQL kurulu
- [ ] `psql` ile veritabanı bağlantısı test edildi
- [ ] Backend kuruldu ve `npm run start:dev` çalışıyor
- [ ] Frontend kuruldu ve `npm run dev` çalışıyor
- [ ] http://localhost:3000/api erişilebiliyor
- [ ] http://localhost:5173 erişilebiliyor
- [ ] Yeni kullanıcı kaydolabiliyorsunuz
- [ ] Giriş yapabiliyorsunuz

---

**Tebrikler! 🎉 Projeniz tamamen çalışır durumda!**

Sorularınız varsa [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md) dosyasını kontrol edin.

**Son Güncelleme**: 30 Kasım 2025

