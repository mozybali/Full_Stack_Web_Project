import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '../services/product.service';
import { useCart } from '../context/CartContext';
import type { Product } from '../types';
import { FaShoppingCart, FaArrowLeft } from 'react-icons/fa';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) {
      loadProduct(Number(id));
    }
  }, [id]);

  const loadProduct = async (productId: number) => {
    try {
      const data = await productService.getById(productId);
      setProduct(data);
    } catch (error) {
      console.error('Ürün yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      navigate('/cart');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ürün bulunamadı</h2>
          <button onClick={() => navigate('/products')} className="btn-primary">
            Ürünlere Dön
          </button>
        </div>
      </div>
    );
  }

  // imageUrl'i düzgün şekilde işle
  const getImageUrl = () => {
    if (!product.imageUrl) {
      return 'https://via.placeholder.com/600x400?text=No+Image';
    }
    
    if (product.imageUrl.startsWith('http://') || product.imageUrl.startsWith('https://')) {
      return product.imageUrl;
    }
    
    return `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}${product.imageUrl}`;
  };

  const imageUrl = getImageUrl();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <FaArrowLeft />
          <span>Geri Dön</span>
        </button>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            <div>
              <img
                src={imageUrl}
                alt={product.title}
                className="w-full rounded-lg"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/600x400?text=No+Image';
                }}
              />
            </div>

            <div>
              <div className="mb-4">
                <span className="inline-block bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-semibold">
                  {product.type === 'ACCOUNT' ? 'Hesap' : 'Key'}
                </span>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.title}</h1>

              <div className="mb-6">
                <p className="text-gray-600 mb-2">
                  <span className="font-semibold">Oyun:</span> {product.game.name}
                </p>
                <p className="text-gray-600 mb-2">
                  <span className="font-semibold">Platform:</span> {product.game.platform}
                </p>
                {product.game.genre && (
                  <p className="text-gray-600 mb-2">
                    <span className="font-semibold">Tür:</span> {product.game.genre}
                  </p>
                )}
                <p className="text-gray-600">
                  <span className="font-semibold">Satıcı:</span> {product.seller.username}
                </p>
              </div>

              {product.description && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Açıklama</h3>
                  <p className="text-gray-600">{product.description}</p>
                </div>
              )}

              <div className="border-t pt-6">
                <div className="mb-4">
                  <span className="text-4xl font-bold text-primary-600">
                    ₺{Number(product.price).toFixed(2)}
                  </span>
                </div>

                <p className="text-gray-600 mb-4">
                  Stok: <span className="font-semibold">{product.stock}</span> adet
                </p>

                {product.stock > 0 ? (
                  <>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Miktar
                      </label>
                      <input
                        type="number"
                        min="1"
                        max={product.stock}
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, Number(e.target.value))))}
                        className="input-field w-32"
                      />
                    </div>

                    <button
                      onClick={handleAddToCart}
                      className="w-full btn-primary flex items-center justify-center space-x-2"
                    >
                      <FaShoppingCart />
                      <span>Sepete Ekle</span>
                    </button>
                  </>
                ) : (
                  <div className="bg-red-100 text-red-700 px-4 py-3 rounded">
                    Bu ürün şu anda stokta bulunmamaktadır.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
