/**
 * Product Card Component
 * 
 * Tek bir ürünü kart formatında gösteren component.
 * 
 * Özellikler:
 * - Ürün görseli
 * - Ürün başlığı ve açıklaması
 * - Oyun bilgisi ve platform
 * - Fiyat bilgisi
 * - Sepete ekle butonu
 * - Stok durumu göstergesi
 * - Ürün detay sayfasına link
 * 
 * Kullanım:
 * <ProductCard product={productData} />
 * 
 * @param {ProductCardProps} props - Product card özellikleri
 */

import React from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../types';
import { useCart } from '../context/CartContext';
import { FaShoppingCart } from 'react-icons/fa';

/**
 * ProductCard props tipi
 */
interface ProductCardProps {
  product: Product; // Gösterilecek ürün verisi
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  // Product validasyonu
  if (!product || !product.game) {
    return null;
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
  };

  // imageUrl'i düzgün şekilde işle
  // Eğer URL http veya https ile başlıyorsa, harici URL'dir, olduğu gibi kullan
  // Eğer / ile başlıyorsa, local dosyadır, API_URL ekle
  const getImageUrl = () => {
    if (!product.imageUrl) {
      return 'https://via.placeholder.com/300x200?text=No+Image';
    }
    
    if (product.imageUrl.startsWith('http://') || product.imageUrl.startsWith('https://')) {
      return product.imageUrl;
    }
    
    return `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}${product.imageUrl}`;
  };

  const imageUrl = getImageUrl();

  return (
    <div className="card">
      <Link to={`/products/${product.id}`}>
        <div className="relative">
          <img
            src={imageUrl}
            alt={product.title}
            className="w-full h-48 object-cover"
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/300x200?text=No+Image';
            }}
          />
          {product.stock <= 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-bold text-lg">Stokta Yok</span>
            </div>
          )}
          <div className="absolute top-2 right-2 bg-primary-600 text-white px-2 py-1 rounded text-sm font-semibold">
            {product.type === 'ACCOUNT' ? 'Hesap' : 'Key'}
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-2 line-clamp-2">
            {product.title}
          </h3>
          
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
            {product.game.name} - {product.game.platform}
          </p>
          
          {product.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
              {product.description}
            </p>
          )}
          
          <div className="flex items-center justify-between mt-4">
            <div>
              <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                ₺{Number(product.price).toFixed(2)}
              </span>
              <p className="text-xs text-gray-500 dark:text-gray-400">Stok: {product.stock}</p>
            </div>
            
            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
                product.stock > 0
                  ? 'bg-primary-600 hover:bg-primary-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <FaShoppingCart />
              <span>Sepete Ekle</span>
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
