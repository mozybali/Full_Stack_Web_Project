/**
 * Yanıt Utility Fonksiyonları
 * API yanıtlarını standardlaştırmak için kullanılır
 */

/**
 * Standart API yanıtı oluştur
 * @param statusCode - HTTP durum kodu
 * @param message - Yanıt mesajı
 * @param data - Yanıtla gönderilecek veri
 * @returns Standardlaştırılmış yanıt nesnesi
 */
export const createResponse = (statusCode: number, message: string, data?: any) => {
  return {
    statusCode,
    message,
    ...(data && { data }),
  };
};

/**
 * Hata yanıtı oluştur
 * @param statusCode - HTTP hata kodu
 * @param message - Hata mesajı
 * @returns Hata yanıt nesnesi
 */
export const createErrorResponse = (statusCode: number, message: string) => {
  return createResponse(statusCode, message);
};

/**
 * Başarılı yanıt oluştur
 * @param statusCode - HTTP durum kodu (2xx)
 * @param data - Yanıtla gönderilecek veri
 * @returns Başarılı yanıt nesnesi
 */
export const createSuccessResponse = (statusCode: number, data?: any) => {
  return createResponse(statusCode, 'Başarılı', data);
};
