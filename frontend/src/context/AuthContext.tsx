/**
 * Kimlik Doğrulama (Authentication) Context'i
 * 
 * Uygulamanın her yerinden erişilebilen global kimlik doğrulama sistemi.
 * localStorage'da token ve kullanıcı bilgilerini depolanır, sayfa yenilemelerinde kalıcı olur.
 * 
 * Fonksiyonlar:
 * - login: Email ve şifre ile oturum aç
 * - register: Yeni hesap oluştur
 * - logout: Oturumu kapat
 * - hasRole: Kullanıcının belirli bir role sahip olup olmadığını kontrol et
 * 
 * Kullanım:
 * const { user, login, logout, isAuthenticated } = useAuth();
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/auth.service';
import type { User, LoginDto, RegisterDto, AuthResponse } from '../types';

/**
 * Auth Context Type tanımı
 * Kimlik doğrulama fonksiyonlarını ve state'leri belirtir
 */
interface AuthContextType {
  user: User | null; // Giriş yapmış kullanıcı veya null
  isAuthenticated: boolean; // Giriş yapılmış mı?
  isLoading: boolean; // Sayfa yükleniyor mu?
  login: (data: LoginDto) => Promise<void>; // Oturum aç
  register: (data: RegisterDto) => Promise<void>; // Yeni hesap oluştur
  logout: () => void; // Oturumu kapat
  hasRole: (role: string) => boolean; // Kullanıcının rolü var mı?
}

// Context oluştur
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Auth Provider Component
 * Uygulamanın herhangi bir yerinde <AuthProvider> ile kullanılmalı
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Giriş yapmış kullanıcı
  const [user, setUser] = useState<User | null>(null);
  // Sayfa yüklenirken auth kontrol ediliyor mu?
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Component mount olduğunda localStorage'dan kullanıcıyı yükle
   * Sayfa yenilenirse de oturum devam etsin
   */
  useEffect(() => {
    // Sayfa yüklendiğinde kullanıcı bilgilerini kontrol et
    const initAuth = async () => {
      try {
        // localStorage'dan kullanıcı ve token bilgilerini al
        const storedUser = authService.getCurrentUser();
        const token = authService.getToken();
        
        // Hem token hem user varsa kullanıcıyı state'e koy
        if (storedUser && token) {
          setUser(storedUser);
        } else {
          // Token veya user yoksa auth temizle
          authService.logout();
        }
      } catch (error) {
        // Hata varsa log ve temizle
        console.error('Auth initialization error:', error);
        authService.logout();
      } finally {
        // Yükleme bitti
        setIsLoading(false);
      }
    };

    initAuth();

    // 401 hatası durumunda logout event'i dinle (axios interceptor'dan gelir)
    const handleLogout = () => {
      setUser(null);
    };

    // Logout event'i dinlemeye başla
    window.addEventListener('logout', handleLogout);

    // Cleanup: Event listener'ı kaldır
    return () => {
      window.removeEventListener('logout', handleLogout);
    };
  }, []);

  /**
   * Oturum aç
   * @param data - Email ve şifre
   * @throws Geçersiz kimlik bilgileri
   */
  const login = async (data: LoginDto): Promise<void> => {
    try {
      // Oturum aç ve token + user al
      const response: AuthResponse = await authService.login(data);
      // Token'ı localStorage'a kaydet
      authService.setToken(response.access_token);
      // Kullanıcı bilgilerini localStorage'a kaydet
      authService.setUser(response.user);
      // State'e de koy
      setUser(response.user);
    } catch (error) {
      // Hata varsa prop et
      throw error;
    }
  };

  /**
   * Yeni hesap oluştur
   * @param data - Email, kullanıcı adı ve şifre
   * @throws Email veya kullanıcı adı zaten mevcut
   */
  const register = async (data: RegisterDto): Promise<void> => {
    try {
      // Yeni hesap oluştur ve token + user al
      const response: AuthResponse = await authService.register(data);
      // Token'ı localStorage'a kaydet
      authService.setToken(response.access_token);
      // Kullanıcı bilgilerini localStorage'a kaydet
      authService.setUser(response.user);
      // State'e de koy
      setUser(response.user);
    } catch (error) {
      // Hata varsa prop et
      throw error;
    }
  };

  /**
   * Oturumu kapat
   * localStorage'dan token ve user bilgilerini sil
   */
  const logout = (): void => {
    // localStorage'dan temizle
    authService.logout();
    // State'ten de sil
    setUser(null);
  };

  /**
   * Kullanıcının belirli bir role sahip olup olmadığını kontrol et
   * @param role - Kontrol edilecek rol adı
   * @returns Role sahip mi?
   */
  const hasRole = (role: string): boolean => {
    return user?.roles?.some((r) => r.name === role) || false;
  };

  // Context value'sini oluştur
  const value: AuthContextType = {
    user,
    isAuthenticated: !!user, // user null değilse true
    isLoading,
    login,
    register,
    logout,
    hasRole,
  };

  // Provider ile wrap et
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Kimlik doğrulama context'ine erişmek için custom hook
 * Provider içinde kullanılmalı, yoksa error fırlatır
 * @returns Auth context value'su
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
