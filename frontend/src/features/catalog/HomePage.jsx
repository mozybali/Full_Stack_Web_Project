import React, { useEffect, useState } from 'react';
import { fetchProducts } from '../../api/productsApi';
import ProductCard from '../../components/ProductCard';

export default function HomePage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts().then((res) => setProducts(res.data));
  }, []);

  return (
    <section>
      <h1 className="text-2xl font-semibold mb-4">
        Popüler Oyun Hesapları & Keyler
      </h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
