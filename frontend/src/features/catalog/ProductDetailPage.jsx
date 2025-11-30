import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProductStore } from './store';
import { useCartStore } from '../orders/cartStore';
import { Loading, Alert } from '../../common/ui';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentProduct, loading, error, fetchProductById, clearError } = useProductStore();
  const { addItem } = useCartStore();

  useEffect(() => {
    fetchProductById(parseInt(id));
  }, [id]);

  if (loading) return <Loading text="Ürün yükleniyor..." />;

  if (error) {
    return (
      <div>
        <Alert
          type="error"
          title="Hata"
          message={error}
          onClose={clearError}
        />
        <button
          onClick={() => navigate('/')}
          className="mt-4 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-md"
        >
          Mağazaya Dön
        </button>
      </div>
    );
  }

  if (!currentProduct) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400 mb-4">Ürün bulunamadı</p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-md"
        >
          Mağazaya Dön
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(currentProduct, 1);
    alert('Ürün sepete eklendi!');
  };

  return (
    <div className="max-w-4xl">
      <button
        onClick={() => navigate('/')}
        className="mb-6 px-3 py-1 text-sm text-indigo-400 hover:text-indigo-300"
      >
        ← Geri Dön
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 h-fit">
          <div className="aspect-square bg-slate-950 rounded-lg flex items-center justify-center mb-4">
            <span className="text-slate-600 text-sm">Ürün Görseli</span>
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-semibold mb-2">{currentProduct.title}</h1>
          <p className="text-sm text-slate-400 mb-6">
            {currentProduct.game?.name} · {currentProduct.type === 'ACCOUNT' ? 'Hesap' : 'Key'}
          </p>

          <p className="text-slate-300 mb-6">{currentProduct.description}</p>

          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 mb-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Fiyat:</span>
                <span className="text-3xl font-semibold text-indigo-400">
                  {Number(currentProduct.price).toFixed(2)} {currentProduct.currency}
                </span>
              </div>

              <div className="border-t border-slate-700 pt-4 flex justify-between">
                <span className="text-slate-400">Stok Durumu:</span>
                <span
                  className={`font-semibold ${
                    currentProduct.stock > 0 ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {currentProduct.stock > 0 ? `${currentProduct.stock} Adet` : 'Stok Yok'}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleAddToCart}
              disabled={currentProduct.stock === 0}
              className="w-full py-3 px-4 rounded-md bg-indigo-500 hover:bg-indigo-600 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-medium"
            >
              {currentProduct.stock > 0 ? 'Sepete Ekle' : 'Stokta Yok'}
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full py-3 px-4 rounded-md bg-slate-800 hover:bg-slate-700 text-white font-medium"
            >
              Alışverişe Devam Et
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-800 text-xs text-slate-500 space-y-1">
            <p>✓ Güvenli Ödeme</p>
            <p>✓ Hızlı Teslimat</p>
            <p>✓ Satış Sonrası Destek</p>
          </div>
        </div>
      </div>
    </div>
  );
}
