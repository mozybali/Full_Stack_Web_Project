/**
 * API Servis Export'ları
 * 
 * Tüm API servisleri buradan export edilir.
 * Backend ile iletişim için kullanılan servisler:
 * - productService: Ürün API'leri
 * - gameService: Oyun API'leri
 * - orderService: Sipariş API'leri
 * - userService: Kullanıcı API'leri
 * - authService: Kimlik doğrulama API'leri
 * - axiosInstance: Konfigüre edilmiş axios instance
 * 
 * Kullanım:
 * import { productService, authService } from '@/services';
 */

export { productService } from './product.service';
export { gameService } from './game.service';
export { orderService } from './order.service';
export { userService } from './user.service';
export { authService } from './auth.service';
export { default as axiosInstance } from './axios';
