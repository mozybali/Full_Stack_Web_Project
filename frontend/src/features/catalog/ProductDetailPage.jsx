import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProduct } from '../../api/productsApi';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetchProduct(id).then((res) => setProduct(res.data));
  }, [id]);

  if (!product) return <p>Yükleniyor...</p>;

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-semibold mb-2">{product.title}</h1>
      <p className="text-sm text-slate-400 mb-2">
        {product.game?.name} · {product.type === 'ACCOUNT' ? 'Hesap' : 'Key'}
      </p>
      <p className="text-sm text-slate-200 mb-4">{product.description}</p>
      <p className="text-xl font-semibold text-indigo-400 mb-6">
        {Number(product.price).toFixed(2)} {product.currency}
      </p>
      <button className="px-4 py-2 rounded-md bg-indigo-500 hover:bg-indigo-600 text-sm font-medium">
        Sepete Ekle (örnek)
      </button>
    </div>
  );
}
