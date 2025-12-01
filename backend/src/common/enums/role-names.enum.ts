/**
 * Rol Adları Enum'u
 * Sistem rollerini tanımlamak için merkezi enum
 * Tüm role string'leri bu enum'dan kullanılmalıdır
 */
export enum RoleNames {
  // Platform yöneticileri - tüm işlemleri yapabilir
  ADMIN = 'ADMIN',

  // Ürün satıcıları - ürün yönetimi yapabilir
  SELLER = 'SELLER',

  // Ürün alıcıları - varsayılan rol, siparış oluşturabilir
  BUYER = 'BUYER',
}
