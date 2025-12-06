/**
 * Ana Uygulama Component'i
 * 
 * Tüm uygulamanın giriş noktası.
 * Router, Context Provider'lar ve Layout yapılandırması burada yapılır.
 * 
 * Yapı:
 * - Router: URL yönetimi için React Router
 * - AuthProvider: Kimlik doğrulama context'i
 * - CartProvider: Sepet yönetimi context'i
 * - MainLayout: Navbar ve Footer wrapper
 * - Routes: Tüm sayfa route'ları
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { MainLayout } from './layouts';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingScreen from './components/LoadingScreen';
import { ROUTES } from './config';

// Sayfa Component'leri
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Admin from './pages/Admin';

import { RoleNames } from './types';
import { useAuth } from './context/AuthContext';

function AppContent() {
  const { isLoading } = useAuth();

  // Auth yüklenirken loading ekranı göster
  if (isLoading) {
    return <LoadingScreen message="Oturum açılıyor..." />;
  }

  return (
    <MainLayout>
      <Routes>
              {/* Genel erişilebilir sayfalar */}
              <Route path={ROUTES.HOME} element={<Home />} />
              <Route path={ROUTES.LOGIN} element={<Login />} />
              <Route path={ROUTES.REGISTER} element={<Register />} />
              <Route path={ROUTES.PRODUCTS} element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path={ROUTES.CART} element={<Cart />} />
              
              {/* Korumalı sayfa - Sadece giriş yapmış kullanıcılar */}
              <Route
                path={ROUTES.ORDERS}
                element={
                  <ProtectedRoute>
                    <Orders />
                  </ProtectedRoute>
                }
              />
              
              {/* Korumalı sayfa - Sadece SELLER rolüne sahip kullanıcılar */}
              <Route
                path={ROUTES.ADMIN}
                element={
                  <ProtectedRoute requireRole={RoleNames.SELLER}>
                    <Admin />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </MainLayout>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
