import { useState, useEffect } from 'react';
import { productService } from '../services/product.service';
import type { Product } from '../types';

/**
 * Ürünleri yönetmek için custom hook
 * 
 * Kullanım:
 * const { activeProducts, loading, error, refetch } = useProducts();
 * 
 * @returns {Object} Ürün verileri ve durumları
 * @returns {Product[]} products - Tüm ürünler
 * @returns {Product[]} activeProducts - Sadece aktif ürünler
 * @returns {boolean} loading - Yükleme durumu
 * @returns {string|null} error - Hata mesajı
 * @returns {Function} refetch - Verileri yeniden yükle
 */
export const useProducts = () => {
  // State tanımlamaları
  const [products, setProducts] = useState<Product[]>([]); // Tüm ürünler
  const [loading, setLoading] = useState(true); // Yükleme durumu
  const [error, setError] = useState<string | null>(null); // Hata durumu

  // Ürünleri API'den yükle
  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getAll();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ürünler yüklenirken hata oluştu');
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Sadece aktif ürünleri filtrele
  const activeProducts = products.filter(p => p.isActive);

  return {
    products,
    activeProducts,
    loading,
    error,
    refetch: loadProducts,
  };
};

/**
 * Tek bir ürünü ID'ye göre getiren hook
 * 
 * Kullanım:
 * const { product, loading, error } = useProduct(productId);
 * 
 * @param {number} id - Ürün ID'si
 * @returns {Object} Ürün verisi ve durumları
 */
export const useProduct = (id: number) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await productService.getById(id);
        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ürün yüklenirken hata oluştu');
        console.error('Error loading product:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  return { product, loading, error };
};
