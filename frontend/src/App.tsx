/**
 * Ana Uygulama Component'i
 *
 * Uygulamanın giriş noktası - Router, Provider'lar ve Route yapılandırması.
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './components/ui/ToastContainer';
import { MainLayout } from './layouts';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingScreen from './components/LoadingScreen';
import { ROUTES } from './config';
import { RoleNames } from './types';

// Sayfa Imports
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';

/**
 * AppContent - İç content yapısı
 */
function AppContent() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen message="Yükleniyor..." />;
  }

  return (
    <MainLayout>
      <Routes>
        {/* Herkese Açık Routes */}
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.REGISTER} element={<Register />} />
        <Route path={ROUTES.PRODUCTS} element={<Products />} />
        <Route path={`${ROUTES.PRODUCTS}/:id`} element={<ProductDetail />} />
        <Route path={ROUTES.CART} element={<Cart />} />

        {/* Giriş Yapan Kullanıcılar İçin */}
        <Route
          path={ROUTES.ORDERS}
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />

        {/* Admin/Seller Routes */}
        <Route
          path={ROUTES.ADMIN}
          element={
            <ProtectedRoute
              requireRole={[RoleNames.ADMIN, RoleNames.SELLER]}
            >
              <Admin />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </MainLayout>
  );
}

/**
 * App - Root Component
 */
function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <ToastProvider>
              <AppContent />
            </ToastProvider>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
