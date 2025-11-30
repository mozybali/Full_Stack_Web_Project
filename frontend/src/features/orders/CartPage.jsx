import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from './cartStore';
import { Button } from '../../common/ui';

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, getTotalPrice } = useCartStore();
  const navigate = useNavigate();

  const total = getTotalPrice();

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Sepet</h1>
        <div className="text-center py-12 bg-slate-900 border border-slate-800 rounded-lg">
          <p className="text-slate-400 mb-4">Sepetiniz boş</p>
          <Button
            onClick={() => navigate('/')}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-md"
          >
            Alışverişe Devam Et
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Sepet</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex gap-4"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                  <p className="text-sm text-slate-400 mb-2">
                    {item.game?.name} · {item.type === 'ACCOUNT' ? 'Hesap' : 'Key'}
                  </p>
                  <p className="text-indigo-400 font-semibold">
                    {Number(item.price).toFixed(2)} {item.currency}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-slate-950 rounded-md px-2 py-1">
                    <button
                      onClick={() =>
                        updateQuantity(item.id, Math.max(1, item.quantity - 1))
                      }
                      className="px-2 py-1 text-slate-300 hover:text-white"
                    >
                      −
                    </button>
                    <span className="w-6 text-center text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-2 py-1 text-slate-300 hover:text-white"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="px-3 py-2 text-sm bg-red-500/10 text-red-400 rounded-md hover:bg-red-500/20"
                  >
                    Sil
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 sticky top-6">
            <h2 className="font-semibold text-lg mb-4">Özet</h2>

            <div className="space-y-2 mb-6 pb-6 border-b border-slate-800">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Ürünler:</span>
                <span>{items.length}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold">
                <span>Toplam:</span>
                <span className="text-indigo-400">{total.toFixed(2)} TRY</span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => navigate('/orders')}
                className="w-full py-2 px-4 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-md"
              >
                Siparişi Tamamla
              </button>
              <button
                onClick={clearCart}
                className="w-full py-2 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-md"
              >
                Sepeti Temizle
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
