import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';

/**
 * Upload Module
 * Dosya yükleme işlemlerini yöneten modül
 */
@Module({
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}
