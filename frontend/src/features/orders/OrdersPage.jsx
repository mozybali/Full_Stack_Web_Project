import React from 'react';

export default function OrdersPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Siparişler</h1>
      <p className="text-sm text-slate-300">
        Backend'deki /orders/my endpoint'ine bağlanıp listeleme yapılabilir.
      </p>
    </div>
  );
}
