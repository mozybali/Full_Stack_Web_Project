# 🎮 GamerMarkt Frontend

Modern bir oyun hesabı ve key marketplace frontend uygulaması. React 19, TypeScript, Tailwind CSS ve Vite ile geliştirilmiştir.

## 📋 İçindekiler

- [Özellikler](#-özellikler)
- [Teknolojiler](#-teknolojiler)
- [Gereksinimler](#-gereksinimler)
- [Kurulum](#-kurulum)
- [Yapılandırma](#-yapılandırma)
- [Proje Yapısı](#-proje-yapısı)
- [Geliştirme](#-geliştirme)
- [Build ve Deploy](#-build-ve-deploy)
- [Kullanılan Kütüphaneler](#-kullanılan-kütüphaneler)

## ✨ Özellikler

### Kullanıcı Yönetimi
- 👤 Kullanıcı kaydı ve girişi
- 🔐 JWT tabanlı authentication
- 👥 Kullanıcı profil yönetimi
- 🚪 Güvenli logout

### Ürün Katalogu
- 🎮 Oyun hesapları ve key'leri listeleme
- 🔍 Ürün filtreleme ve arama
- 🖼️ Ürün detay sayfası
- ⭐ Ürün bilgileri ve açıklaması

### Alışveriş Sepeti
- 🛒 Sepete ürün ekleme
- 📊 Miktar güncelleme
- 🗑️ Sepetten ürün kaldırma
- 💰 Toplam fiyat hesaplaması

### Sipariş Sistemi
- 📝 Sipariş oluşturma
- 📊 Sipariş geçmişi görüntüleme
- 📈 Sipariş durumu takibi

### Admin Paneli
- 📦 Ürün yönetimi (Ekle, Düzenle, Sil)
- 🎮 Oyun kataloğu yönetimi
- 👥 Kullanıcı yönetimi
- 🎭 Rol yönetimi
- 📋 Sipariş yönetimi ve durum güncellemeleri
- 📊 Dashboard ve istatistikler

### Kullanıcı Arayüzü
- 📱 Responsive tasarım (Mobil, Tablet, Masaüstü)
- 🎨 Modern ve kullanıcı dostu arayüz
- ⚡ Hızlı yükleme (Vite optimize edilmiş)
- 🌓 Tema desteği (Light/Dark mode)
- 🔄 Loading state'leri
- ⚠️ Hata yönetimi ve bildirimleri

## 🛠 Teknolojiler

### Temel Framework'ler
- **React** (v19.2+) - UI framework
- **TypeScript** (v5.9+) - Tip güvenli JavaScript
- **Vite** (v7.2+) - Build tool ve dev server

### Routing ve State Management
- **React Router** (v7.10+) - Client-side routing
- **React Context API** - State management
  - `AuthContext` - Kimlik doğrulama state'i
  - `CartContext` - Alışveriş sepeti state'i

### HTTP ve API
- **Axios** (v1.13+) - HTTP client
- **Base URL**: `http://localhost:3000` (Development)

### Styling
- **Tailwind CSS** (v3.4+) - Utility-first CSS framework
- **PostCSS** (v8.5+) - CSS işleme
- **Autoprefixer** - Vendor prefix'ler

### UI Components
- **React Icons** (v5.5+) - Icon library (FontAwesome, Feather, etc.)

### Geliştirme Araçları
- **ESLint** (v9.39+) - Kod linting
- **TypeScript ESLint** - TypeScript linting
- **Vite** - HMR (Hot Module Replacement)

## 📦 Gereksinimler

- Node.js (v18.x veya üzeri)
- npm veya yarn
- Backend API çalışır durumda (`http://localhost:3000`)

## 🔧 Kurulum

### 1. Bağımlılıkları Yükleyin
```bash
npm install
```

### 2. Ortam Değişkenlerini Yapılandırın

`.env.local` dosyası oluşturun:

```env
# API Base URL
VITE_API_URL=http://localhost:3000

# App Config
VITE_APP_NAME=GamerMarkt
```

> **Not**: Backend API'nin `http://localhost:3000` adresinde çalışıyor olması gerekir.

### 3. Geliştirme Sunucusunu Başlatın
```bash
npm run dev
```

Uygulama `http://localhost:5173` adresinde çalışacaktır.
```bash
npm run build
npm run preview
```

## ⚙️ Yapılandırma

### Environment Değişkenleri

| Değişken | Açıklama | Örnek |
|----------|---------|--------|
| `VITE_API_URL` | Backend API URL | `http://localhost:3000` |
| `VITE_APP_NAME` | Uygulama adı | `GamerMarkt` |

### Vite Konfigürasyonu

- **Dev Server Port**: `5173` (varsayılan)
- **Build Output**: `dist/`
- **HMR**: Otomatik Sıcak Modül Değiştirme

### Tailwind CSS

- **Varsayılan Tema**: Tailwind default
- **Dark Mode**: CSS değişkenleri ile desteklenebilir
- **JIT Mode**: Tüm sınıflar JIT derlenmiş

## 📁 Proje Yapısı

```
frontend/
├── src/
│   ├── components/                 # React Bileşenleri
│   │   ├── ui/                    # Genel UI bileşenleri
│   │   ├── admin/                 # Admin panel bileşenleri
│   │   │   ├── Dashboard.tsx     # Admin dashboard
│   │   │   ├── AdminUsers.tsx    # Kullanıcı yönetimi
│   │   │   ├── AdminRoles.tsx    # Rol yönetimi
│   │   │   ├── AdminGames.tsx    # Oyun yönetimi
│   │   │   ├── AdminProducts.tsx # Ürün yönetimi
│   │   │   └── AdminOrders.tsx   # Sipariş yönetimi
│   │   ├── Footer.tsx
│   │   ├── Navbar.tsx
│   │   ├── ProductCard.tsx
│   │   ├── LoadingScreen.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── index.ts
│   │
│   ├── pages/                     # Sayfa Bileşenleri
│   │   ├── Home.tsx              # Ana sayfa
│   │   ├── Products.tsx          # Ürün listesi
│   │   ├── ProductDetail.tsx     # Ürün detay
│   │   ├── Cart.tsx              # Sepet
│   │   ├── Orders.tsx            # Sipariş geçmişi
│   │   ├── Admin.tsx             # Admin paneli
│   │   ├── Login.tsx             # Giriş sayfası
│   │   ├── Register.tsx          # Kayıt sayfası
│   │   ├── NotFound.tsx          # 404 sayfası
│   │   └── index.ts
│   │
│   ├── services/                  # API Servis Katmanı
│   │   ├── axios.ts              # Axios instance & interceptor'lar
│   │   ├── auth.service.ts       # Authentication API
│   │   ├── user.service.ts       # User CRUD API
│   │   ├── product.service.ts    # Product CRUD API
│   │   ├── order.service.ts      # Order API
│   │   ├── game.service.ts       # Game API
│   │   └── index.ts
│   │
│   ├── hooks/                     # Custom React Hook'ları
│   │   ├── useProducts.ts        # Ürün yönetimi hook
│   │   ├── useOrders.ts          # Sipariş yönetimi hook
│   │   ├── useGames.ts           # Oyun listesi hook
│   │   ├── useFilter.ts          # Filtreleme hook
│   │   └── index.ts
│   │
│   ├── context/                   # React Context API
│   │   ├── AuthContext.tsx       # Kullanıcı auth state
│   │   ├── CartContext.tsx       # Sepet state yönetimi
│   │   └── ThemeContext.tsx      # Tema yönetimi
│   │
│   ├── layouts/                   # Layout Bileşenleri
│   │   ├── MainLayout.tsx        # Ana layout (navbar + footer)
│   │   ├── PageContainer.tsx     # Sayfa wrapper
│   │   └── index.ts
│   │
│   ├── features/                  # Feature Modülleri
│   │   └── products/             # Ürün özel modülleri
│   │
│   ├── config/                    # Frontend Konfigürasyonu
│   │   ├── constants.ts          # Sabitler (API URL, vs.)
│   │   └── index.ts
│   │
│   ├── types/                     # TypeScript Type Tanımları
│   │   └── index.ts              # Global type'lar (User, Product, Order, vs.)
│   │
│   ├── assets/                    # Statik Varlıklar
│   ├── App.tsx                    # Ana App bileşeni
│   ├── App.css
│   ├── index.css                  # Global stiller
│   └── main.tsx                   # React giriş noktası
│
├── public/                         # Public Statik Dosyalar
├── package.json
├── vite.config.ts                 # Vite yapılandırması
├── tailwind.config.js             # Tailwind CSS config
├── postcss.config.js              # PostCSS config
├── tsconfig.json                  # TypeScript config (base)
├── tsconfig.app.json              # TypeScript config (app)
├── tsconfig.node.json             # TypeScript config (node)
├── eslint.config.js               # ESLint config
├── index.html                     # HTML template
└── README.md
```

### Klasör Yapısı Açıklaması

- **components/**: Yeniden kullanılabilir React bileşenleri
- **pages/**: Route bazlı sayfa bileşenleri
- **services/**: Backend API ile iletişim katmanı
- **hooks/**: Custom React Hook'ları (state ve side-effect yönetimi)
- **context/**: Global state yönetimi (Auth, Cart, Theme)
- **layouts/**: Sayfa düzenleri (header, footer, container)
- **types/**: TypeScript type ve interface tanımları

## 🚀 Geliştirme

### Npm Scripts

```bash
npm run dev                   # Development sunucusu başlat
npm run build                 # Production build oluştur
npm run preview               # Build'i preview et
npm run lint                  # ESLint check
```

### Yeni Sayfa Oluşturma

1. `src/pages/` içerisinde yeni component oluşturun
2. `src/App.tsx` içerisinde route ekleyin

```typescript
import NewPage from './pages/NewPage';

// App.tsx içerisinde
<Route path="/new-page" element={<NewPage />} />
```

### Yeni Service Oluşturma

1. `src/services/` içerisinde yeni service dosyası oluşturun
2. Axios instance'ını kullanarak API çağrıları yapın

```typescript
// src/services/example.service.ts
import axios from './axios';

export const exampleService = {
  getAll: () => axios.get('/endpoint'),
  getById: (id: string) => axios.get(`/endpoint/${id}`),
};
```

### Custom Hook Oluşturma

1. `src/hooks/` içerisinde yeni hook dosyası oluşturun
2. React Hook'larını kullanarak veri fetch'leyin

```typescript
// src/hooks/useExample.ts
import { useState, useEffect } from 'react';
import { exampleService } from '../services';

export const useExample = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await exampleService.getAll();
        setData(result.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { data, loading, error };
};
```

## 🏗️ Build ve Deploy

### Production Build

```bash
npm run build
```

Build sonucu `dist/` klasöründe oluşturulur.

### Önerilen Deployment Seçenekleri

- **Vercel**: Vite projeler için optimize edilmiş
- **Netlify**: Statik site hosting
- **GitHub Pages**: Ücretsiz hosting
- **Cloudflare Pages**: Hızlı CDN

### Build Optimizasyonları

- ✅ Code splitting
- ✅ Minification
- ✅ CSS purging (Tailwind)
- ✅ Asset optimization
- ✅ Lazy loading support

## 🔐 Güvenlik

### Uygulanan Güvenlik Önlemleri

- ✅ **JWT Authentication**: Token'lar localStorage'da saklanır
- ✅ **Protected Routes**: Yetkisiz erişim otomatik olarak engellenir
- ✅ **CORS Policy**: Backend tarafından yönetilir
- ✅ **Hassas Bilgi Koruması**: Şifreler client-side'da saklanmaz
- ✅ **XSS Koruması**: React'ın built-in sanitization'ı
- ✅ **Input Validation**: Form validasyonları
- ✅ **Axios Interceptors**: Otomatik token ekleme ve hata yönetimi

### Best Practices

- Token'lar HTTP-only olmayan localStorage'da saklanır (istemci taraflı SPA için)
- Logout durumunda tüm auth bilgileri temizlenir
- API isteklerinde otomatik Authorization header eklenir
- Hatalı isteklerde kullanıcı bilgilendirilir

## 📚 Kullanılan Kütüphaneler

### Core Dependencies

| Kütüphane | Versiyon | Açıklama |
|-----------|----------|----------|
| `react` | 19.2.0 | UI framework |
| `react-dom` | 19.2.0 | DOM rendering |
| `react-router-dom` | 7.10.1 | Client-side routing |
| `axios` | 1.13.2 | HTTP client |
| `react-icons` | 5.5.0 | Icon library |

### Dev Dependencies

| Kütüphane | Versiyon | Açıklama |
|-----------|----------|----------|
| `vite` | 7.2.4 | Build tool ve dev server |
| `typescript` | 5.9.3 | Type system |
| `tailwindcss` | 3.4.18 | CSS framework |
| `eslint` | 9.39.1 | Code linting |
| `@vitejs/plugin-react` | 5.1.1 | React plugin for Vite |

## 🎯 Context API Kullanımı

### AuthContext

```typescript
const { user, login, logout, isAuthenticated } = useContext(AuthContext);

// Kullanıcı giriş durumunu kontrol et
if (isAuthenticated) {
  console.log('Kullanıcı:', user.username);
}
```

### CartContext

```typescript
const { cart, addToCart, removeFromCart, clearCart, totalPrice } = useContext(CartContext);

// Sepete ürün ekle
addToCart(product);

// Toplam fiyat
console.log('Toplam:', totalPrice);
```

### ThemeContext

```typescript
const { theme, toggleTheme } = useContext(ThemeContext);

// Temayı değiştir
toggleTheme(); // light <-> dark
```

## 🔗 Backend Bağlantısı

Frontend, Backend API'ye şu URL'de bağlanır:

- **Development**: `http://localhost:3000`
- **Production**: Environment variable ile belirlenir (`VITE_API_URL`)

### API Endpoints

Tüm API endpoint'leri için:
- **Swagger UI**: `http://localhost:3000/api`
- **API Base URL**: `http://localhost:3000`

### Axios Configuration

Axios instance otomatik olarak:
- Authorization header'ı ekler (JWT token)
- Error handling yapar
- Request/Response interceptor'ları çalıştırır

---

**Son Güncelleme**: Aralık 2025
