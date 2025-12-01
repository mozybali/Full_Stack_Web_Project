import {
  BadRequestException,
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';

/**
 * File Upload Interceptor
 * Dosya yükleme işlemlerini validate eden interceptor
 */
@Injectable()
export class FileUploadInterceptor implements NestInterceptor {
  private readonly maxFileSize = 5 * 1024 * 1024; // 5MB
  private readonly allowedMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
  ];

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const file = request.file;

    if (file) {
      // Dosya tipi kontrolü
      if (!this.allowedMimeTypes.includes(file.mimetype)) {
        throw new BadRequestException(
          'Geçersiz dosya tipi. Sadece JPEG, PNG ve WebP formatları desteklenmektedir.',
        );
      }

      // Dosya boyutu kontrolü
      if (file.size > this.maxFileSize) {
        throw new BadRequestException(
          `Dosya boyutu çok büyük. Maksimum ${this.maxFileSize / 1024 / 1024}MB olmalıdır.`,
        );
      }
    }

    return next.handle();
  }
}
