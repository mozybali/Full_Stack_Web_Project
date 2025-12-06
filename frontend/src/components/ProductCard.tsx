import React from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../types';
import { useCart } from '../context/CartContext';
import { FaShoppingCart } from 'react-icons/fa';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
  };

  const imageUrl = product.imageUrl 
    ? `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}${product.imageUrl}`
    : 'https://via.placeholder.com/300x200?text=No+Image';

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
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {product.title}
          </h3>
          
          <p className="text-sm text-gray-600 mb-2">
            {product.game.name} - {product.game.platform}
          </p>
          
          {product.description && (
            <p className="text-sm text-gray-500 mb-3 line-clamp-2">
              {product.description}
            </p>
          )}
          
          <div className="flex items-center justify-between mt-4">
            <div>
              <span className="text-2xl font-bold text-primary-600">
                ₺{product.price.toFixed(2)}
              </span>
              <p className="text-xs text-gray-500">Stok: {product.stock}</p>
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
