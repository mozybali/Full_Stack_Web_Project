import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import sharp from 'sharp';

/**
 * Upload Service
 * Dosya yükleme, validasyon ve image işleme operasyonlarını yönetir
 */
@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);
  private readonly uploadPath: string;
  private readonly maxFileSize: number;
  private readonly allowedMimeTypes: string[];

  constructor(private configService: ConfigService) {
    // Upload klasörü path'i
    this.uploadPath = path.join(process.cwd(), 'uploads', 'products');
    
    // Maksimum dosya boyutu (5MB)
    this.maxFileSize = 5 * 1024 * 1024;
    
    // İzin verilen dosya tipleri
    this.allowedMimeTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
    ];

    // Upload klasörünü oluştur
    this.ensureUploadDir();
  }

  /**
   * Upload klasörünün var olduğundan emin ol
   */
  private ensureUploadDir(): void {
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  /**
   * Dosya tipini validate et
   */
  validateFileType(mimetype: string): boolean {
    return this.allowedMimeTypes.includes(mimetype);
  }

  /**
   * Dosya boyutunu validate et
   */
  validateFileSize(size: number): boolean {
    return size <= this.maxFileSize;
  }

  /**
   * Ürün resmi yükle ve optimize et
   * @param file Yüklenen dosya
   * @returns Kaydedilen dosyanın URL'i
   */
  async uploadProductImage(file: Express.Multer.File): Promise<string> {
    // Validasyon
    if (!this.validateFileType(file.mimetype)) {
      throw new BadRequestException(
        'Geçersiz dosya tipi. Sadece JPEG, PNG ve WebP formatları desteklenmektedir.',
      );
    }

    if (!this.validateFileSize(file.size)) {
      throw new BadRequestException(
        `Dosya boyutu çok büyük. Maksimum ${this.maxFileSize / 1024 / 1024}MB olmalıdır.`,
      );
    }

    try {
      // Benzersiz dosya adı oluştur
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const filename = `product-${timestamp}-${randomString}.webp`;
      const filepath = path.join(this.uploadPath, filename);

      // Image'i optimize et ve kaydet (Sharp ile)
      await sharp(file.buffer)
        .resize(800, 800, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({ quality: 85 })
        .toFile(filepath);

      // Public URL döndür
      return `/uploads/products/${filename}`;
    } catch (error) {
      throw new BadRequestException('Resim yüklenirken hata oluştu.');
    }
  }

  /**
   * Eski resmi sil
   * @param imageUrl Silinecek resmin URL'i
   */
  async deleteProductImage(imageUrl: string): Promise<void> {
    if (!imageUrl) return;

    try {
      // URL'den dosya adını çıkar
      const filename = path.basename(imageUrl);
      const filepath = path.join(this.uploadPath, filename);

      // Dosya varsa sil
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
    } catch (error) {
      // Silme hatası kritik değil, logla ve devam et
      this.logger.error(`Resim silinirken hata: ${error.message}`, error.stack);
    }
  }

  /**
   * Ürün resmini güncelle
   * Eski resmi siler ve yenisini yükler
   */
  async updateProductImage(
    oldImageUrl: string,
    newFile: Express.Multer.File,
  ): Promise<string> {
    // Önce yeni resmi yükle
    const newImageUrl = await this.uploadProductImage(newFile);

    // Başarılıysa eski resmi sil
    if (oldImageUrl) {
      await this.deleteProductImage(oldImageUrl);
    }

    return newImageUrl;
  }
}
