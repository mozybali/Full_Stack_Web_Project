/**
 * Alışveriş Sepeti Sayfası (Cart Page)
 * 
 * Uygulamanın sepet sayfası.
 * Kullanıcı tarafından seçilen ürünleri, miktarlarını ve siparişi gösterir.
 * 
 * Özellikler:
 * - Sepetteki ürünleri listeleme
 * - Ürün miktarını artırma/azaltma
 * - Ürün kaldırma
 * - Siparış özeti (ara toplam, KDV, genel toplam)
 * - Siparişi tamamlama
 * - Sepeti temizleme
 * - Giriş yapılmamışsa login sayfasına yönlendirme
 * 
 * Kullanılan Context'ler:
 * - useCart: Sepet yönetimi (ürünler, miktar, işlemler)
 * - useAuth: Kullanıcı kimlik doğrulaması
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/order.service';
import { useToast } from '../components/ui/ToastContainer';
import { FaTrash, FaMinus, FaPlus, FaShoppingCart } from 'react-icons/fa';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  // Context'lerden sepet ve auth verilerini al
  const { items, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useCart();
  const { isAuthenticated } = useAuth();
  // Sipariş oluşturma sırasında yükleme durumu
  const [loading, setLoading] = React.useState(false);

  /**
   * Siparış oluşturma ve tamamlama işlemi
   * 1. Giriş kontrolü - giriş yapılmamışsa login'e yönlendir
   * 2. Sepet kontrolü - boş sepet kontrolü
   * 3. Sipariş verilerini hazırla
   * 4. API'ye sipariş gönder
   * 5. Sepeti temizle ve sipariş sayfasına yönlendir
   */
  const handleCheckout = async () => {
    // Giriş yapılmamışsa login sayfasına yönlendir
    if (!isAuthenticated) {
      toast.warning('Sipariş vermek için giriş yapmalısınız');
      navigate('/login');
      return;
    }

    // Sepet boşsa işlem yapma
    if (items.length === 0) {
      toast.error('Sepetiniz boş');
      return;
    }

    setLoading(true);
    try {
      // Sipariş için gerekli veri yapısını oluştur
      const orderData = {
        items: items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      };

      // Sipariş oluştur
      await orderService.create(orderData);
      // Sepeti temizle
      clearCart();
      // Başarı mesajı göster
      toast.success('Siparişiniz başarıyla oluşturuldu!');
      // Kısa bir gecikme sonra siparişler sayfasına yönlendir
      setTimeout(() => {
        navigate('/orders');
      }, 500);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Sipariş oluşturulurken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Resim URL'sini API base URL'sine göre oluştur
   * Eğer resim yoksa placeholder kullan
   * @param imageUrlPath - Veritabanındaki resim yolu
   * @returns Tam URL
   */
  const imageUrl = (imageUrlPath: string | undefined) => {
    return imageUrlPath 
      ? `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}${imageUrlPath}`
      : 'https://via.placeholder.com/100x100?text=No+Image';
  };

  // Sepet boşsa boş durum göster
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

        {/* Sepet grid layout: Sol taraf ürün listesi, sağ taraf sipariş özeti */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Ürün Listesi (2 sütun) */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md">
              {/* Sepetteki her ürün için başlı başına satır */}
              {items.map((item) => (
                <div key={item.product.id} className="flex items-center p-6 border-b last:border-b-0">
                  {/* Ürün Resmi */}
                  <img
                    src={imageUrl(item.product.imageUrl)}
                    alt={item.product.title}
                    className="w-24 h-24 object-cover rounded"
                    onError={(e) => {
                      // Resim yüklenemezse placeholder göster
                      e.currentTarget.src = 'https://via.placeholder.com/100x100?text=No+Image';
                    }}
                  />

                  {/* Ürün Bilgileri */}
                  <div className="flex-1 ml-6">
                    <h3 className="text-lg font-semibold text-gray-900">{item.product.title}</h3>
                    <p className="text-sm text-gray-600">{item.product.game.name}</p>
                    <p className="text-sm text-gray-500">
                      {item.product.type === 'ACCOUNT' ? 'Hesap' : 'Key'}
                    </p>
                  </div>

                  {/* Miktar Kontrolü ve Fiyat */}
                  <div className="flex items-center space-x-4">
                    {/* Miktar Artırma/Azaltma */}
                    <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-2">
                      {/* Miktar Azalt */}
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <FaMinus size={12} />
                      </button>
                      {/* Miktar Göster */}
                      <span className="w-8 text-center font-semibold">{item.quantity}</span>
                      {/* Miktar Artır (mevcut stok'tan fazla olamaz) */}
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock}
                        className="p-1 hover:bg-gray-200 rounded disabled:opacity-50"
                      >
                        <FaPlus size={12} />
                      </button>
                    </div>

                    {/* Satır Toplam Fiyatı */}
                    <div className="w-24 text-right">
                      <p className="text-lg font-bold text-primary-600">
                        ₺{(Number(item.product.price) * item.quantity).toFixed(2)}
                      </p>
                    </div>

                    {/* Ürünü Sepetten Kaldır */}
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

          {/* Sipariş Özeti (1 sütun) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Sipariş Özeti</h2>

              {/* Fiyat Hesaplamalar */}
              <div className="space-y-3 mb-6">
                {/* Ara Toplam */}
                <div className="flex justify-between text-gray-600">
                  <span>Ara Toplam</span>
                  <span>₺{getTotalPrice().toFixed(2)}</span>
                </div>
                {/* KDV (%18) */}
                <div className="flex justify-between text-gray-600">
                  <span>KDV (%18)</span>
                  <span>₺{(getTotalPrice() * 0.18).toFixed(2)}</span>
                </div>
                {/* Genel Toplam */}
                <div className="border-t pt-3">
                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Toplam</span>
                    <span>₺{(getTotalPrice() * 1.18).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Siparışı Tamamla Butonu */}
              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'İşleniyor...' : 'Siparişi Tamamla'}
              </button>

              {/* Giriş Yapılmamışsa Uyarı */}
              {!isAuthenticated && (
                <p className="text-sm text-gray-600 mt-4 text-center">
                  Sipariş vermek için giriş yapmalısınız
                </p>
              )}

              {/* Sepeti Temizle Butonu */}
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
