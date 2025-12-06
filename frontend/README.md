# 🎮 GamerMarkt Frontend

Modern bir oyun hesabı ve key marketplace frontend uygulaması. React 19, TypeScript, Tailwind CSS, Vite ve React Router ile geliştirilmiştir.

## 📋 İçindekiler

- [Özellikler](#-özellikler)
- [Teknolojiler](#-teknolojiler)
- [Gereksinimler](#-gereksinimler)
- [Kurulum](#-kurulum)
- [Yapılandırma](#-yapılandırma)
- [Proje Yapısı](#-proje-yapısı)
- [Geliştirme](#-geliştirme)
- [Build ve Deploy](#-build-ve-deploy)

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
- 🎮 Oyun yönetimi
- 👥 Kullanıcı yönetimi
- 📋 Sipariş yönetimi

### Kullanıcı Arayüzü
- 📱 Responsive tasarım (Mobil, Tablet, Masaüstü)
- 🎨 Modern ve kullanıcı dostu interface
- ⚡ Hızlı yükleme (Vite optimize edilmiş)
- 🌓 Dinamik tema desteği

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

`.env.local` dosyası oluşturun (Development için):

```env
# API
VITE_API_URL=http://localhost:3000

# App
VITE_APP_NAME=GamerMarkt
```

### 3. Geliştirme Sunucusunu Başlatın
```bash
npm run dev
```

Uygulama `http://localhost:5173` adresinde çalışacaktır.

### 4. Production Build Oluşturun
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
src/
├── components/                 # React Komponenti
│   ├── ui/                    # Tekrar kullanılabilir UI komponenti
│   ├── admin/                 # Admin paneli komponenti
│   ├── Footer.tsx
│   ├── Navbar.tsx
│   ├── ProductCard.tsx
│   ├── LoadingScreen.tsx
│   └── ProtectedRoute.tsx
│
├── pages/                     # Sayfa komponenti
│   ├── Home.tsx
│   ├── Products.tsx
│   ├── ProductDetail.tsx
│   ├── Cart.tsx
│   ├── Orders.tsx
│   ├── Admin.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   └── NotFound.tsx
│
├── services/                  # API servisleri
│   ├── auth.service.ts       # Authentication API
│   ├── product.service.ts    # Product API
│   ├── order.service.ts      # Order API
│   ├── game.service.ts       # Game API
│   ├── user.service.ts       # User API
│   ├── axios.ts              # Axios konfigürasyonu
│   └── index.ts
│
├── hooks/                     # Custom React Hook'ları
│   ├── useProducts.ts        # Ürün fetch hook'u
│   ├── useOrders.ts          # Sipariş fetch hook'u
│   ├── useGames.ts           # Oyun fetch hook'u
│   ├── useFilter.ts          # Filtreleme hook'u
│   └── index.ts
│
├── context/                   # React Context
│   ├── AuthContext.tsx       # Kimlik doğrulama context
│   └── CartContext.tsx       # Sepet context
│
├── layouts/                   # Layout Komponenti
│   ├── MainLayout.tsx
│   ├── PageContainer.tsx
│   └── index.ts
│
├── config/                    # Yapılandırma
│   ├── constants.ts          # Sabit değerler
│   └── index.ts
│
├── types/                     # TypeScript Type Tanımları
│   └── index.ts
│
├── assets/                    # Statik Dosyalar
│   └── (resimler, fontlar, vb.)
│
├── App.tsx                   # Ana App Component
├── App.css                   # App stili
├── index.css                 # Global stili
└── main.tsx                  # React DOM mount noktası
```

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

- ✅ JWT token'lar localStorage'da güvenli şekilde saklanır
- ✅ Protected routes ile yetkisiz erişim engellenir
- ✅ CORS policy'si backend tarafından kontrol edilir
- ✅ Hassas bilgiler (şifre) asla client tarafında saklanmaz
- ✅ XSS koruması için React built-in sanitization

## 📚 Context API Kullanımı

### AuthContext

```typescript
const { user, login, logout, isAuthenticated } = useContext(AuthContext);
```

### CartContext

```typescript
const { cart, addToCart, removeFromCart, clearCart } = useContext(CartContext);
```

## 🔗 Backend Bağlantısı

Frontend, Backend API'ye şu URL'de bağlanır:

- **Development**: `http://localhost:3000`
- **Production**: Backend sunucunuzun domain'i

API documentation: `http://localhost:3000/api` (Swagger)

---

**Son Güncelleme**: Aralık 2025
