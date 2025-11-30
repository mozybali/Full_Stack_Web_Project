# 📚 Dokümantasyon İndeksi

Projede bulunan tüm dokümantasyon dosyalarının organize bir indeksi.

---

## 🎯 Başlangıç İçin Oku

Yeni başlayanlar için önerilen okuma sırası:

1. **[README.md](./README.md)** ⭐
   - Proje hakkında genel bilgi
   - Kurulum adımları
   - Temel özellikler
   - Teknoloji stack'i

2. **[BACKEND_API.md](./BACKEND_API.md)**
   - Tüm API endpoint'leri
   - Request/Response örnekleri
   - Error kodları
   - Authentication

3. **[FRONTEND_GUIDE.md](./FRONTEND_GUIDE.md)**
   - Frontend yapısı
   - Custom hooks kullanımı
   - State management (Zustand)
   - Component geliştirme

4. **[DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)**
   - Veritabanı tasarımı
   - Entity relationships
   - SQL queries

5. **[DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md)**
   - Coding standards
   - Git workflow
   - Testing stratejisi
   - Security best practices

---

## 📖 Dosya Açıklamaları

### 1. README.md
**Amaç**: Projeye giriş ve kurulum rehberi

**İçerir**:
- ✅ Proje açıklaması
- ✅ Teknoloji stack'i
- ✅ Kurulum talimatları
- ✅ Proje dosya yapısı
- ✅ API endpoints özeti
- ✅ Başlangıç komutları

**Okuma Süresi**: 10 dakika

---

### 2. BACKEND_API.md
**Amaç**: Backend API'nin eksiksiz dokümantasyonu

**İçerir**:
- ✅ Genel API bilgileri (base URL, authentication)
- ✅ 6 ana modül için endpoint'ler:
  - Kimlik Doğrulama (Auth)
  - Kullanıcı Yönetimi (Users)
  - Ürün Yönetimi (Products)
  - Sipariş Yönetimi (Orders)
  - Oyun Yönetimi (Games)
  - Rol Yönetimi (Roles)
- ✅ Her endpoint için:
  - Method ve URL
  - Protected/Public bilgisi
  - Request/Response örnekleri
  - Validation kuralları
  - Error cases
- ✅ Error kodları ve açıklamaları
- ✅ JWT token yapısı

**Okuma Süresi**: 30 dakika
**Referans Olarak Kullanılır**

---

### 3. FRONTEND_GUIDE.md
**Amaç**: Frontend geliştirme rehberi

**İçerir**:
- ✅ Kurulum ve başlangıç
- ✅ Proje klasör yapısı
- ✅ Zustand state management
  - useAuthStore
  - useUIStore
- ✅ Custom hooks:
  - useAsync
  - useForm
  - useFetch
  - usePagination
- ✅ API client kullanımı
- ✅ React Router konfigürasyonu
- ✅ Component geliştirme patterns
- ✅ Tailwind CSS styling
- ✅ Best practices ve optimizasyon

**Okuma Süresi**: 40 dakika

---

### 4. DATABASE_SCHEMA.md
**Amaç**: Veritabanı tasarımı ve dokümantasyonu

**İçerir**:
- ✅ 7 ana tablo:
  - users
  - roles
  - user_roles (junction table)
  - games
  - products
  - orders
  - order_items
- ✅ Her tablo için:
  - Kolon tanımı
  - Veri tipleri
  - Constraints
  - İndeksler
  - Örnek queries
- ✅ Entity Relationship Diagram (ERD)
- ✅ İlişki türleri (1:1, 1:N, M:N)
- ✅ Enum tanımları
- ✅ Kompleks SQL örnekleri
- ✅ Migration talimatları

**Okuma Süresi**: 40 dakika
**Referans Olarak Kullanılır**

---

### 5. DEVELOPMENT_GUIDE.md
**Amaç**: Geliştirme standartları ve best practices

**İçerir**:
- ✅ Coding standards:
  - Backend (TypeScript)
  - Frontend (JavaScript/React)
  - Naming conventions
  - File organization
  - Class structure
  - Error handling
- ✅ Project conventions
  - Folder structure
  - Import aliases
- ✅ Git workflow
  - Branch naming
  - Commit messages
  - Pull request process
- ✅ Testing strategy
  - Backend unit tests
  - Frontend component tests
  - Test examples
- ✅ Security best practices
  - Backend security
  - Frontend security
  - Password hashing
  - Input sanitization
- ✅ Performance tips
  - Database optimization
  - Frontend performance
  - Caching strategies
- ✅ Debugging techniques
- ✅ Deployment process

**Okuma Süresi**: 50 dakika

---

### 6. .env.example (Backend)
**Amaç**: Backend environment variables template

**İçerir**:
- Server configuration
- JWT settings
- Database credentials
- Email configuration
- Frontend URL
- API settings
- Logging
- Rate limiting
- File upload
- AWS configuration

**Kullanım**: 
```bash
cp backend/.env.example backend/.env
# Then edit .env with actual values
```

---

### 7. .env.example (Frontend)
**Amaç**: Frontend environment variables template

**İçerir**:
- API URL
- Application info
- Feature flags
- Logging settings
- Analytics
- Third-party services
- Build configuration

**Kullanım**:
```bash
cp frontend/.env.example frontend/.env.local
# Then edit .env.local with actual values
```

---

## 🔍 Hızlı Referans

### Belirli Bir Sorunu Çözmek İçin

| Soru | Dosya | Bölüm |
|------|-------|-------|
| API endpoint'i nasıl kullanırım? | BACKEND_API.md | Relevant endpoint section |
| Yeni component nasıl oluşturum? | FRONTEND_GUIDE.md | Component Geliştirme |
| State yönetimini nasıl yaparım? | FRONTEND_GUIDE.md | State Management |
| Tablo ilişkilerini anlamak istiyorum | DATABASE_SCHEMA.md | İlişkiler |
| Commit message nasıl yazarım? | DEVELOPMENT_GUIDE.md | Git Workflow |
| Security best practices | DEVELOPMENT_GUIDE.md | Security Best Practices |
| Proje nasıl başlatılır? | README.md | Kurulum |
| Hata kodları nelerdir? | BACKEND_API.md | Hata Kodları |

---

## 📊 Dokümantasyon Istatistikleri

| Dosya | Satır | Çizim/Diyagram | Kod Örneği |
|-------|-------|-----------------|-----------|
| README.md | ~300 | 1 | 10+ |
| BACKEND_API.md | ~800 | 1 | 20+ |
| FRONTEND_GUIDE.md | ~600 | - | 25+ |
| DATABASE_SCHEMA.md | ~700 | 1 ERD | 15+ |
| DEVELOPMENT_GUIDE.md | ~900 | - | 30+ |
| .env.example files | ~50 | - | - |
| **TOPLAM** | **~3,350** | **2 ERD** | **100+** |

---

## 🎓 Öğrenme Yolu

### 1. Hafta (Temel Bilgiler)
- [ ] README.md okuyun
- [ ] Projeyi kurun (backend + frontend)
- [ ] BACKEND_API.md'yi gözden geçirin
- [ ] Swagger UI'de birkaç endpoint'i test edin

### 2. Hafta (Frontend Geliştirme)
- [ ] FRONTEND_GUIDE.md'yi okuyun
- [ ] Basit component oluşturun
- [ ] Zustand store'ları anlamaya çalışın
- [ ] Custom hooks'ları kullanın

### 3. Hafta (Backend Geliştirme)
- [ ] DATABASE_SCHEMA.md'yi okuyun
- [ ] Mevcut entities'i inceleyin
- [ ] Yeni endpoint yazın
- [ ] DEVELOPMENT_GUIDE.md'de testing bölümünü okuyun

### 4. Hafta (Best Practices)
- [ ] DEVELOPMENT_GUIDE.md'yi tamamen okuyun
- [ ] Git workflow'ı uygulamaya başlayın
- [ ] Unit test yazın
- [ ] Security best practices'i implement edin

---

## 🔗 Dış Kaynaklar

### Backend
- [NestJS Dokumentasyonu](https://docs.nestjs.com/)
- [TypeORM Dokumentasyonu](https://typeorm.io/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [JWT.io](https://jwt.io/)

### Frontend
- [React Dokümantasyonu](https://react.dev/)
- [React Router v6](https://reactrouter.com/)
- [Zustand GitHub](https://github.com/pmndrs/zustand)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite Dokumentasyonu](https://vitejs.dev/)

### DevOps & Deployment
- [Docker Documentation](https://docs.docker.com/)
- [GitHub Actions](https://docs.github.com/en/actions)
- [Vercel Deployment](https://vercel.com/docs)
- [Heroku Deployment](https://devcenter.heroku.com/)

---

## 💡 İpuçları

✅ **Yapın:**
- Değişiklik yapmadan önce ilgili dokümantasyonu okuyun
- Yeni özellik eklerken bu dokümantasyonu güncelleyin
- Kod reviewleri sırasında standartları kontrol edin
- Problemleri çözmeden önce dokümantasyonu arayın

❌ **Yapmayın:**
- Dokümantasyonun dışında method isimleri kullanmayın
- Env variables'ı commit etmeyin
- Security best practices'i göz ardı etmeyin
- API endpoint'i değiştirirken dokümantasyonu güncellemeden bırakmayın

---

## 📝 Dokümantasyon Güncellemesi

Proje geliştikçe dokümantasyonu güncelleyin:

1. Yeni endpoint eklendi mi? → BACKEND_API.md'yi güncelleyin
2. Yeni hook oluşturdunuz mu? → FRONTEND_GUIDE.md'yi güncelleyin
3. Database şemasını değiştirdiniz mi? → DATABASE_SCHEMA.md'yi güncelleyin
4. Yeni kurallar belirlediniz mi? → DEVELOPMENT_GUIDE.md'yi güncelleyin
5. Yeni env variable'ı gerekli mi? → .env.example dosyalarını güncelleyin

---

## ✉️ Sorular ve Destek

Dokumentasyon ile ilgili sorular:
- 📧 Email: support@gamevault.com
- 💬 Team Chat: #documentation
- 📋 Issues: GitHub Issues

---

**Son Güncelleme**: 30 Kasım 2025
**Versiyon**: 1.0
**Durum**: Tamamlanmış ✅

