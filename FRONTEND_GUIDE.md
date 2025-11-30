# Frontend Geliştirme Rehberi

## 📋 İçindekiler

- [Kurulum](#kurulum)
- [Proje Yapısı](#proje-yapısı)
- [State Management](#state-management)
- [Custom Hooks](#custom-hooks)
- [API Client](#api-client)
- [Routing](#routing)
- [Component Geliştirme](#component-geliştirme)
- [Styling](#styling)
- [Best Practices](#best-practices)

## 🚀 Kurulum

### Ön Gereksinimler
- Node.js 18+
- npm 9+
- VS Code (recommended)

### Başlangıç

```bash
cd frontend
npm install
npm run dev
```

Uygulama `http://localhost:5173` adresinde açılır.

### Build Üretim

```bash
npm run build
npm run preview
```

---

## 📁 Proje Yapısı

```
src/
├── App.jsx                          # Root component
├── main.jsx                         # Entry point
├── index.css                        # Global styles
├── router.jsx                       # Route konfigürasyonu
│
├── api/                             # API communication
│   ├── client.js                    # Axios instance + interceptors
│   ├── authApi.js                   # Auth endpoints
│   ├── usersApi.js                  # User endpoints
│   ├── productsApi.js               # Product endpoints
│   ├── ordersApi.js                 # Order endpoints
│   ├── gamesApi.js                  # Game endpoints
│   ├── constants.js                 # API constants
│   └── index.js                     # Export barrel
│
├── common/                          # Paylaşılan utilities
│   ├── components/                  # Reusable components
│   │   ├── ErrorBoundary.jsx
│   │   ├── ErrorNotification.jsx
│   │   ├── GlobalLoader.jsx
│   │   └── NotificationCenter.jsx
│   ├── context/                     # Context providers
│   │   └── ErrorContext.jsx
│   ├── hooks/                       # Custom hooks
│   │   ├── useAsync.js
│   │   ├── useFetch.js
│   │   ├── useForm.js
│   │   ├── useValidation.js
│   │   ├── useOrders.js
│   │   ├── useProducts.js
│   │   ├── usePagination.js
│   │   └── index.js (barrel)
│   ├── stores/                      # Zustand state stores
│   │   ├── useAuthStore.js
│   │   ├── useUIStore.js
│   │   ├── storeUtils.js
│   │   └── index.js (barrel)
│   └── ui/                          # UI components
│       ├── Button.jsx
│       ├── Alert.jsx
│       ├── Modal.jsx
│       ├── Input.jsx
│       ├── Card.jsx
│       └── ... (diğer UI comps)
│
├── components/                      # Page-level components
│   ├── Navbar.jsx
│   ├── ProductCard.jsx
│   ├── ProtectedRoute.jsx
│   └── ...
│
├── features/                        # Feature modules
│   ├── auth/                        # Kimlik doğrulama
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── useAuthStore.js
│   │   └── ...
│   ├── catalog/                     # Ürün kataloğu
│   │   ├── HomePage.jsx
│   │   ├── ProductDetailPage.jsx
│   │   ├── ProductCard.jsx
│   │   └── ...
│   ├── orders/                      # Sipariş yönetimi
│   │   ├── CartPage.jsx
│   │   ├── OrdersPage.jsx
│   │   └── ...
│   └── admin/                       # Admin paneli
│       ├── AdminDashboard.jsx
│       ├── UserManagementPage.jsx
│       ├── ProductManagementPage.jsx
│       └── ...
│
└── layouts/                         # Layout components
    ├── MainLayout.jsx               # Normal kullanıcı layout
    └── DashboardLayout.jsx          # Admin dashboard layout
```

---

## 🏪 State Management (Zustand)

### useAuthStore.js

Kullanıcı authentication bilgilerini yönetir.

```javascript
// Store tanımı (features/auth/useAuthStore.js)
import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isLoading: false,
  
  // Actions
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  setLoading: (isLoading) => set({ isLoading }),
  
  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const response = await authApi.login(email, password);
      set({ 
        user: response.user, 
        token: response.accessToken,
        isLoading: false 
      });
      return response;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  
  logout: () => set({ 
    user: null, 
    token: null 
  }),
  
  register: async (email, username, password) => {
    set({ isLoading: true });
    try {
      const response = await authApi.register(email, username, password);
      set({ 
        user: response.user, 
        token: response.accessToken,
        isLoading: false 
      });
      return response;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
}));
```

### Kullanım

```jsx
import { useAuthStore } from '../common/stores/useAuthStore';

function MyComponent() {
  const { user, token, login, logout } = useAuthStore();
  
  return (
    <div>
      {user ? (
        <>
          <p>Welcome, {user.username}</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <button onClick={() => login('email@test.com', 'password')}>Login</button>
      )}
    </div>
  );
}
```

### useUIStore.js

UI state'ini ve notification'ları yönetir.

```javascript
export const useUIStore = create((set) => ({
  notifications: [],
  isLoading: false,
  
  addNotification: (message, type = 'info', duration = 3000) => 
    set((state) => ({
      notifications: [
        ...state.notifications,
        { id: Date.now(), message, type, duration }
      ]
    })),
  
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter(n => n.id !== id)
    })),
  
  setLoading: (isLoading) => set({ isLoading }),
}));
```

---

## 🎣 Custom Hooks

### useAsync.js

Async işlemler için state yönetimi.

```javascript
import { useAsync } from '../common/hooks/useAsync';
import { productsApi } from '../api/productsApi';

function ProductList() {
  const { value: products, status, error } = useAsync(
    () => productsApi.getAll(),
    true  // immediate execution
  );
  
  if (status === 'pending') return <div>Loading...</div>;
  if (status === 'error') return <div>Error: {error.message}</div>;
  
  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### useForm.js

Form state'ini ve validation'ı yönetir.

```javascript
import { useForm } from '../common/hooks/useForm';

function LoginPage() {
  const { values, errors, touched, handleChange, handleBlur, handleSubmit } = 
    useForm({
      initialValues: {
        email: '',
        password: '',
      },
      onSubmit: async (values) => {
        await authApi.login(values.email, values.password);
      },
      validate: (values) => {
        const errors = {};
        if (!values.email) errors.email = 'Email gerekli';
        if (!values.password) errors.password = 'Şifre gerekli';
        return errors;
      }
    });
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        name="email"
        value={values.email}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      {touched.email && errors.email && <span>{errors.email}</span>}
      
      <input
        name="password"
        type="password"
        value={values.password}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      {touched.password && errors.password && <span>{errors.password}</span>}
      
      <button type="submit">Login</button>
    </form>
  );
}
```

### useFetch.js

API çağrıları için hook.

```javascript
import { useFetch } from '../common/hooks/useFetch';

function ProductDetail({ productId }) {
  const { data: product, loading, error } = useFetch(
    `/products/${productId}`
  );
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return <div>{product.title}</div>;
}
```

### usePagination.js

Sayfalama için hook.

```javascript
import { usePagination } from '../common/hooks/usePagination';

function ProductList() {
  const { 
    items, 
    currentPage, 
    totalPages, 
    goToPage, 
    nextPage, 
    prevPage 
  } = usePagination(
    productsApi.getAll,
    10  // items per page
  );
  
  return (
    <>
      {items.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
      
      <button onClick={prevPage} disabled={currentPage === 1}>
        Previous
      </button>
      <span>Page {currentPage} of {totalPages}</span>
      <button onClick={nextPage} disabled={currentPage === totalPages}>
        Next
      </button>
    </>
  );
}
```

---

## 🔌 API Client

### Temel Kullanım

```javascript
// api/productsApi.js
import api from './client';

export const productsApi = {
  getAll: (filters = {}) => 
    api.get('/products', { params: filters })
      .then(res => res.data),
  
  getOne: (id) => 
    api.get(`/products/${id}`)
      .then(res => res.data),
  
  create: (data) => 
    api.post('/products', data)
      .then(res => res.data),
  
  update: (id, data) => 
    api.patch(`/products/${id}`, data)
      .then(res => res.data),
  
  delete: (id) => 
    api.delete(`/products/${id}`)
      .then(res => res.data),
};
```

### API Client Configuration

```javascript
// api/client.js
import axios from 'axios';
import { useAuthStore } from '../features/auth/useAuthStore';
import { useUIStore } from '../common/stores/useUIStore';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000',
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use((config) => {
  const { token } = useAuthStore.getState();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { status } = error.response || {};
    const { logout } = useAuthStore.getState();
    const { addNotification } = useUIStore.getState();
    
    if (status === 401) {
      logout();
      window.location.href = '/login';
    } else if (status >= 500) {
      addNotification('Server error', 'error');
    }
    
    return Promise.reject(error);
  }
);

export default api;
```

---

## 🛣️ Routing

### Route Yapısı

```javascript
// router.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';

export default function AppRouter() {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Protected routes */}
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Admin routes */}
      <Route
        element={
          <ProtectedRoute roles={['ADMIN']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<UserManagementPage />} />
        <Route path="/admin/products" element={<ProductManagementPage />} />
        <Route path="/orders" element={<OrdersPage />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
```

### ProtectedRoute Component

```jsx
// components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../features/auth/useAuthStore';

export default function ProtectedRoute({ children, roles = [] }) {
  const { user } = useAuthStore();
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (roles.length > 0 && !roles.some(role => user.roles.includes(role))) {
    return <Navigate to="/" />;
  }
  
  return children;
}
```

---

## 🎨 Component Geliştirme

### Functional Component Örneği

```jsx
import React, { useState } from 'react';
import Button from '../common/ui/Button';

export default function ProductCard({ product, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);
  
  const handleAddToCart = () => {
    onAddToCart(product.id, quantity);
    setQuantity(1);
  };
  
  return (
    <div className="p-4 border rounded-lg hover:shadow-lg transition">
      <img 
        src={product.image} 
        alt={product.title}
        className="w-full h-48 object-cover rounded"
      />
      
      <h3 className="mt-2 font-bold text-lg">{product.title}</h3>
      <p className="text-gray-600 text-sm">{product.description}</p>
      
      <div className="mt-4 flex items-center justify-between">
        <span className="text-xl font-bold text-green-600">
          ₺{product.price}
        </span>
        
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="1"
            max={product.stock}
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            className="w-12 px-2 py-1 border rounded"
          />
          <Button 
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
```

---

## 🎨 Styling (Tailwind CSS)

### Temel Sınıflar

```jsx
// Button
<button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
  Click me
</button>

// Card
<div className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition">
  Content
</div>

// Grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.map(item => <ProductCard key={item.id} {...item} />)}
</div>

// Responsive
<div className="w-full md:w-1/2 lg:w-1/3">
  Responsive width
</div>
```

### Tailwind Config

```javascript
// tailwind.config.js
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#10B981',
      }
    }
  },
  plugins: []
};
```

---

## ✅ Best Practices

### 1. Component Props Validation

```jsx
import PropTypes from 'prop-types';

function ProductCard({ product, onAddToCart }) {
  // ...
}

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.required,
    title: PropTypes.string.required,
    price: PropTypes.number.required,
  }).required,
  onAddToCart: PropTypes.func.required,
};
```

### 2. Error Handling

```jsx
import { useAsync } from '../common/hooks/useAsync';

function ProductList() {
  const { value: products, error, status } = useAsync(
    () => productsApi.getAll(),
    true
  );
  
  if (status === 'error') {
    return <ErrorNotification message={error.message} />;
  }
  
  // ...
}
```

### 3. Loading States

```jsx
import GlobalLoader from '../common/components/GlobalLoader';

function Page() {
  const { isLoading } = useUIStore();
  
  return (
    <>
      {isLoading && <GlobalLoader />}
      {/* Page content */}
    </>
  );
}
```

### 4. Performance Optimization

```jsx
import { memo, useMemo, useCallback } from 'react';

// Memo - Unnecessary re-renders'i önle
const ProductCard = memo(({ product, onAddToCart }) => {
  return <div>{product.title}</div>;
});

// useMemo - Expensive calculations
const filteredProducts = useMemo(() => {
  return products.filter(p => p.price < maxPrice);
}, [products, maxPrice]);

// useCallback - Function memoization
const handleAddToCart = useCallback((id, quantity) => {
  // ...
}, []);
```

### 5. Conditional Rendering

```jsx
{/* Good */}
{user && <UserProfile user={user} />}

{/* Good - with fallback */}
{user ? <UserProfile user={user} /> : <LoginPrompt />}

{/* Good - complex conditions */}
{(user && user.isAdmin) && <AdminPanel />}
```

### 6. File Organization

```
feature/
├── index.js           # Barrel export
├── Component.jsx
├── Component.module.css
├── useComponentHook.js
├── services/
│   └── api.js
└── utils/
    └── helpers.js
```

```javascript
// index.js - Barrel export
export { default as Component } from './Component';
export { useComponentHook } from './useComponentHook';
```

---

**Son Güncelleme**: 30 Kasım 2025

