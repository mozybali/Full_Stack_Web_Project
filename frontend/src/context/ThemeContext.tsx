/**
 * Tema (Theme) Context'i
 * 
 * Uygulama genelinde açık/karanlık tema yönetimi sağlar.
 * localStorage'da tema tercihi saklanır, sayfa yenilemelerinde kalıcı olur.
 * 
 * Fonksiyonlar:
 * - toggleTheme: Tema değiştir (açık/karanlık)
 * - setTheme: Belirli bir tema ayarla ('light' veya 'dark')
 * 
 * Kullanım:
 * const { theme, toggleTheme } = useTheme();
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * Tema tipleri
 */
export type Theme = 'light' | 'dark';

/**
 * Theme Context Type tanımı
 */
interface ThemeContextType {
  theme: Theme; // Aktif tema
  toggleTheme: () => void; // Tema değiştir
  setTheme: (theme: Theme) => void; // Belirli bir tema ayarla
}

// Context oluştur
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * Theme Provider Component
 * App.tsx'te tüm uygulamayı sarmalamalı
 */
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Başlangıçta localStorage'dan tema tercihini al, yoksa 'light' kullan
  const [theme, setThemeState] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    return savedTheme || 'light';
  });

  /**
   * Tema değiştiğinde:
   * 1. localStorage'a kaydet
   * 2. HTML root element'ine class ekle/çıkar (Tailwind dark mode için)
   */
  useEffect(() => {
    localStorage.setItem('theme', theme);
    
    // HTML root element'ine dark class'ı ekle/çıkar
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  /**
   * Temayı değiştir (toggle)
   * Açık ise karanlık, karanlık ise açık yap
   */
  const toggleTheme = () => {
    setThemeState((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  /**
   * Belirli bir tema ayarla
   * @param newTheme - 'light' veya 'dark'
   */
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Theme Context Hook
 * Component'lerden tema yönetimi için kullanılır
 * 
 * @returns Theme context değerleri
 * @throws ThemeProvider dışında kullanılırsa hata fırlatır
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
