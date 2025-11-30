import React from 'react';
import useUIStore from '../../stores/useUIStore';

/**
 * Bildirim Merkezi Bileşeni
 * Tüm toast mesajlarını sağ üst köşede gösterir
 * (başarı, hata, uyarı, bilgi vb.)
 */
export default function NotificationCenter() {
  const { notifications, removeNotification } = useUIStore();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {/* Tüm bildirimleri göster */}
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`px-4 py-3 rounded-lg shadow-lg animate-slideIn text-white font-medium flex items-center justify-between ${
            // Bildirim tipine göre renk
            notification.type === 'success'
              ? 'bg-green-500'
              : notification.type === 'error'
              ? 'bg-red-500'
              : notification.type === 'warning'
              ? 'bg-yellow-500'
              : 'bg-blue-500'
          }`}
        >
          <span>{notification.message}</span>
          {/* Kapatma butonu */}
          <button
            onClick={() => removeNotification(notification.id)}
            className="ml-4 hover:opacity-75 transition"
            title="Kapat"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
