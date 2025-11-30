import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

import HomePage from './features/catalog/HomePage';
import ProductDetailPage from './features/catalog/ProductDetailPage';
import LoginPage from './features/auth/LoginPage';
import RegisterPage from './features/auth/RegisterPage';
import CartPage from './features/orders/CartPage';
import OrdersPage from './features/orders/OrdersPage';

import AdminDashboard from './features/admin/AdminDashboard';
import UserManagementPage from './features/admin/UserManagementPage';
import ProductManagementPage from './features/admin/ProductManagementPage';
import ProtectedRoute from './components/ProtectedRoute';

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          }
        />
      </Route>

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
    </Routes>
  );
}
