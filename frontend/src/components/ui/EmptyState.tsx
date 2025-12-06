import React from 'react';

/**
 * Empty state props tipi
 */
interface EmptyStateProps {
  message: string; // Gösterilecek mesaj
  icon?: React.ReactNode; // Opsiyonel ikon (emoji veya React element)
  action?: { // Opsiyonel aksiyon butonu
    label: string; // Buton etiketi
    onClick: () => void; // Buton tıklama fonksiyonu
  };
}

/**
 * Empty State Component
 * 
 * Veri olmadığında gösterilecek boş durum ekranı.
 * 
 * Özellikler:
 * - Özelleştirilebilir mesaj
 * - Opsiyonel ikon
 * - Opsiyonel aksiyon butonu
 * 
 * Kullanım:
 * <EmptyState 
 *   message="Henüz ürün yok"
 *   icon="📦"
 *   action={{
 *     label: "Ürün Ekle",
 *     onClick: () => navigate('/add-product')
 *   }}
 * />
 * 
 * @param {EmptyStateProps} props - Empty state özellikleri
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  message,
  icon,
  action,
}) => {
  return (
    <div className="text-center py-20">
      {icon && <div className="text-6xl mb-4">{icon}</div>}
      <p className="text-gray-500 text-lg mb-4">{message}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};
