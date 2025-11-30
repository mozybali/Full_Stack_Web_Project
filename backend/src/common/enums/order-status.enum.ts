/**
 * Sipariş Durumu Enum'u
 * Sipariş yaşam döngüsündeki tüm durumları temsil eder
 */
export enum OrderStatus {
  // Ödeme bekleniyor
  PENDING = 'PENDING',
  // Ödeme alındı
  PAID = 'PAID',
  // Sipariş tamamlandı
  COMPLETED = 'COMPLETED',
  // Sipariş iptal edildi
  CANCELLED = 'CANCELLED',
}
