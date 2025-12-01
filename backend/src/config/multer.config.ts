import { diskStorage } from 'multer';
import { extname } from 'path';
import { BadRequestException } from '@nestjs/common';

/**
 * Multer konfigürasyonu
 * Dosya yükleme ayarları
 */

// İzin verilen dosya tipleri
const allowedMimeTypes = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

// Maksimum dosya boyutu (5MB)
const maxFileSize = 5 * 1024 * 1024;

/**
 * Dosya filtresi
 * Sadece resim dosyalarına izin ver
 */
export const imageFileFilter = (req: any, file: any, callback: any) => {
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return callback(
      new BadRequestException(
        'Geçersiz dosya tipi. Sadece JPEG, PNG ve WebP formatları desteklenmektedir.',
      ),
      false,
    );
  }
  callback(null, true);
};

/**
 * Dosya adı düzenleyici
 * Benzersiz dosya adı oluştur
 */
export const editFileName = (req: any, file: any, callback: any) => {
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  const randomName = Array(16)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  callback(null, `${name}-${randomName}${fileExtName}`);
};

/**
 * Multer options
 */
export const multerOptions = {
  fileFilter: imageFileFilter,
  limits: {
    fileSize: maxFileSize,
  },
  storage: diskStorage({
    destination: './uploads/products',
    filename: editFileName,
  }),
};

/**
 * Memory storage (Sharp için buffer'da tutmak üzere)
 */
export const multerMemoryOptions = {
  fileFilter: imageFileFilter,
  limits: {
    fileSize: maxFileSize,
  },
};
