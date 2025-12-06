/**
 * Alışveriş Sepeti Context'i
 * 
 * Uygulamanın her yerinden erişilebilen global sepet yönetim sistemi.
 * localStorage'da depolanır, sayfa yenilemelerinde kalıcı olur.
 * 
 * Fonksiyonlar:
 * - addToCart: Sepete ürün ekle
 * - removeFromCart: Sepetten ürün çıkar
 * - updateQuantity: Ürün miktarını değiştir
 * - clearCart: Sepeti tamamen boşalt
 * - getTotalPrice: Toplam fiyatı hesapla
 * - getTotalItems: Toplam ürün sayısını hesapla
 * 
 * Kullanım:
 * const { items, addToCart, removeFromCart } = useCart();
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { CartItem, Product } from '../types';

/**
 * Cart Context Type tanımı
 * Sepet fonksiyonlarını ve state'leri belirtir
 */
interface CartContextType {
  items: CartItem[]; // Sepetteki ürünler
  addToCart: (product: Product, quantity?: number) => void; // Sepete ürün ekle
  removeFromCart: (productId: number) => void; // Sepetten ürün sil
  updateQuantity: (productId: number, quantity: number) => void; // Ürün miktarını güncelle
  clearCart: () => void; // Sepeti temizle
  getTotalPrice: () => number; // Toplam fiyat
  getTotalItems: () => number; // Toplam ürün sayısı
}

// Context oluştur
const CartContext = createContext<CartContextType | undefined>(undefined);

/**
 * Cart Provider Component
 * Uygulamanın herhangi bir yerinde <CartProvider> ile kullanılmalı
 */
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Sepetteki ürünlerin listesi
  const [items, setItems] = useState<CartItem[]>([]);

  // Component mount olduğunda localStorage'dan sepeti yükle
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error);
      }
    }
  }, []);

  // Sepet değiştiğinde (items güncellendiğinde) localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  /**
   * Sepete yeni ürün ekle veya varsa miktarını artır
   * @param product - Eklenecek ürün
   * @param quantity - Eklenecek miktar (varsayılan: 1)
   */
  const addToCart = (product: Product, quantity = 1): void => {
    setItems((prevItems) => {
      // Aynı ürün sepette var mı kontrol et
      const existingItem = prevItems.find((item) => item.product.id === product.id);
      
      if (existingItem) {
        // Varsa miktarını artır
        return prevItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      // Yoksa yeni ürün olarak ekle
      return [...prevItems, { product, quantity }];
    });
  };

  /**
   * Sepetten ürün kaldır
   * @param productId - Kaldırılacak ürün ID'si
   */
  const removeFromCart = (productId: number): void => {
    setItems((prevItems) => prevItems.filter((item) => item.product.id !== productId));
  };

  /**
   * Ürün miktarını güncelle
   * Miktar 0 veya negatif olursa ürünü sepetten kaldır
   * @param productId - Miktar güncellenecek ürün ID'si
   * @param quantity - Yeni miktar
   */
  const updateQuantity = (productId: number, quantity: number): void => {
    // Miktar 0 veya daha azsa ürünü kaldır
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    // Miktarı güncelle
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  /**
   * Sepeti tamamen boşalt
   */
  const clearCart = (): void => {
    setItems([]);
  };

  /**
   * Sepetteki tüm ürünlerin toplam fiyatını hesapla
   * @returns Toplam fiyat
   */
  const getTotalPrice = (): number => {
    return items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  /**
   * Sepetteki toplam ürün sayısını hesapla
   * (Miktarlar toplamı)
   * @returns Toplam ürün sayısı
   */
  const getTotalItems = (): number => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  // Context value'sini oluştur
  const value: CartContextType = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
  };

  // Provider ile wrap et
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

/**
 * Sepet context'ine erişmek için custom hook
 * Provider içinde kullanılmalı, yoksa error fırlatır
 * @returns Cart context value'su
 */
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
