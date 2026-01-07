import React from 'react';
import ProductCard from '../../../components/ProductCard';
import type { Product } from '../../../types';

/**
 * Ürün grid props tipi
 */
interface ProductGridProps {
  products: Product[]; // Gösterilecek ürünler
  loading?: boolean; // Yükleme durumu
  emptyMessage?: string; // Boş durum mesajı
}

/**
 * Product Grid Component
 * 
 * Ürünleri responsive grid düzeninde gösterir.
 * 
 * Özellikler:
 * - Loading state (spinner)
 * - Empty state (boş mesaj)
 * - Responsive grid (1-2-4 kolon)
 * - ProductCard component'i kullanır
 * 
 * Grid yapısı:
 * - Mobil: 1 kolon
 * - Tablet: 2 kolon
 * - Desktop: 4 kolon
 * 
 * Kullanım:
 * <ProductGrid 
 *   products={filteredProducts}
 *   loading={loading}
 *   emptyMessage="Ürün bulunamadı"
 * />
 * 
 * @param {ProductGridProps} props - Grid özellikleri
 */
export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  loading = false,
  emptyMessage = 'Ürün bulunamadı.',
}) => {
  // Yükleme durumunda spinner göster
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Ürün yoksa boş durum mesajı göster
  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 dark:text-gray-400 text-lg">{emptyMessage}</p>
      </div>
    );
  }

  // Ürünleri grid düzeninde göster
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
