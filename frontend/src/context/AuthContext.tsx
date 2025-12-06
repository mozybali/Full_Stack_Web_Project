import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/auth.service';
import type { User, LoginDto, RegisterDto, AuthResponse } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginDto) => Promise<void>;
  register: (data: RegisterDto) => Promise<void>;
  logout: () => void;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Sayfa yüklendiğinde localStorage'dan kullanıcıyı yükle
    const storedUser = authService.getCurrentUser();
    if (storedUser && authService.isAuthenticated()) {
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (data: LoginDto): Promise<void> => {
    try {
      const response: AuthResponse = await authService.login(data);
      authService.setToken(response.access_token);
      authService.setUser(response.user);
      setUser(response.user);
    } catch (error) {
      throw error;
    }
  };

  const register = async (data: RegisterDto): Promise<void> => {
    try {
      const response: AuthResponse = await authService.register(data);
      authService.setToken(response.access_token);
      authService.setUser(response.user);
      setUser(response.user);
    } catch (error) {
      throw error;
    }
  };

  const logout = (): void => {
    authService.logout();
    setUser(null);
  };

  const hasRole = (role: string): boolean => {
    return user?.roles?.some((r) => r.name === role) || false;
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
