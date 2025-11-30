import React from 'react';
import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  return (
    <article className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col">
      <h2 className="font-semibold text-lg mb-1">{product.title}</h2>
      <p className="text-xs text-slate-400 mb-2">
        {product.game?.name} · {product.type === 'ACCOUNT' ? 'Hesap' : 'Key'}
      </p>
      <p className="text-sm text-slate-300 line-clamp-2 mb-3">
        {product.description}
      </p>
      <div className="mt-auto flex items-center justify-between">
        <span className="font-semibold text-indigo-400">
          {Number(product.price).toFixed(2)} {product.currency}
        </span>
        <Link
          to={`/products/${product.id}`}
          className="text-xs px-3 py-1 rounded-md bg-indigo-500 hover:bg-indigo-600"
        >
          İncele
        </Link>
      </div>
    </article>
  );
}
