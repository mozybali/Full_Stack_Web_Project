/**
 * Korumalı Route Component'i
 * 
 * Sadece giriş yapmış ve/veya belirli rollere sahip kullanıcıların erişebildiği sayfalar için kullanılır.
 * 
 * Özellikler:
 * - Kimlik doğrulama kontrolü
 * - Rol bazlı yetkilendirme
 * - Yükleme sırasında loading ekranı
 * - Yetkisiz erişimlerde otomatik yönlendirme
 * 
 * Kullanım:
 * <ProtectedRoute>
 *   <AdminPage />
 * </ProtectedRoute>
 * 
 * <ProtectedRoute requireRole={[RoleNames.ADMIN, RoleNames.SELLER]}>
 *   <ManagementPage />
 * </ProtectedRoute>
 */
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingScreen from './LoadingScreen';

/**
 * ProtectedRoute props tipi
 */
interface ProtectedRouteProps {
  children: React.ReactNode; // Korunan içerik
  requireRole?: string | string[]; // Gerekli rol(ler) - opsiyonel
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireRole }) => {
  const { isAuthenticated, hasRole, isLoading } = useAuth();

  // Kimlik doğrulama kontrolü yüklenirken loading göster
  if (isLoading) {
    return <LoadingScreen message="Erişim kontrol ediliyor..." />;
  }

  // Giriş yapılmamışsa login sayfasına yönlendir
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Belirli bir rol gerekiyorsa kontrol et
  if (requireRole) {
    const requiredRoles = Array.isArray(requireRole) ? requireRole : [requireRole];
    const hasAnyRole = requiredRoles.some(role => hasRole(role));
    
    // Gerekli rollerden hiçbirine sahip değilse ana sayfaya yönlendir
    if (!hasAnyRole) {
      return <Navigate to="/" replace />;
    }
  }

  // Tüm kontroller geçildi, içeriği göster
  return <>{children}</>;
};

export default ProtectedRoute;

