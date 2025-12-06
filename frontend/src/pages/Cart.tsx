import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/order.service';
import { FaTrash, FaMinus, FaPlus, FaShoppingCart } from 'react-icons/fa';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { items, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useCart();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = React.useState(false);

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (items.length === 0) return;

    setLoading(true);
    try {
      const orderData = {
        items: items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      };

      await orderService.create(orderData);
      clearCart();
      navigate('/orders');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Sipariş oluşturulurken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const imageUrl = (imageUrlPath: string | undefined) => {
    return imageUrlPath 
      ? `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}${imageUrlPath}`
      : 'https://via.placeholder.com/100x100?text=No+Image';
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <FaShoppingCart size={64} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Sepetiniz Boş</h2>
            <p className="text-gray-600 mb-8">Sepetinizde henüz ürün bulunmamaktadır.</p>
            <button onClick={() => navigate('/products')} className="btn-primary">
              Alışverişe Başla
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Alışveriş Sepeti</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md">
              {items.map((item) => (
                <div key={item.product.id} className="flex items-center p-6 border-b last:border-b-0">
                  <img
                    src={imageUrl(item.product.imageUrl)}
                    alt={item.product.title}
                    className="w-24 h-24 object-cover rounded"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/100x100?text=No+Image';
                    }}
                  />

                  <div className="flex-1 ml-6">
                    <h3 className="text-lg font-semibold text-gray-900">{item.product.title}</h3>
                    <p className="text-sm text-gray-600">{item.product.game.name}</p>
                    <p className="text-sm text-gray-500">
                      {item.product.type === 'ACCOUNT' ? 'Hesap' : 'Key'}
                    </p>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-2">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <FaMinus size={12} />
                      </button>
                      <span className="w-8 text-center font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock}
                        className="p-1 hover:bg-gray-200 rounded disabled:opacity-50"
                      >
                        <FaPlus size={12} />
                      </button>
                    </div>

                    <div className="w-24 text-right">
                      <p className="text-lg font-bold text-primary-600">
                        ₺{(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Sipariş Özeti</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Ara Toplam</span>
                  <span>₺{getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>KDV (%18)</span>
                  <span>₺{(getTotalPrice() * 0.18).toFixed(2)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Toplam</span>
                    <span>₺{(getTotalPrice() * 1.18).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'İşleniyor...' : 'Siparişi Tamamla'}
              </button>

              {!isAuthenticated && (
                <p className="text-sm text-gray-600 mt-4 text-center">
                  Sipariş vermek için giriş yapmalısınız
                </p>
              )}

              <button
                onClick={clearCart}
                className="w-full mt-3 btn-secondary"
              >
                Sepeti Temizle
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
