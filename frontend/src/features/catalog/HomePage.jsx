import React, { useEffect } from 'react';
import { useProductStore } from './store';
import { Loading, Alert } from '../../common/ui';
import ProductCard from '../../components/ProductCard';

export default function HomePage() {
  const { products, loading, error, fetchProducts, clearError } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) return <Loading text="Ürünler yükleniyor..." />;

  return (
    <section>
      <h1 className="text-2xl font-semibold mb-6">Popüler Oyun Hesapları & Keyler</h1>

      {error && (
        <Alert
          type="error"
          title="Hata"
          message={error}
          onClose={clearError}
        />
      )}

      {products.length === 0 ? (
        <div className="text-center py-12 bg-slate-900 border border-slate-800 rounded-lg">
          <p className="text-slate-400">Ürün bulunamadı</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}
