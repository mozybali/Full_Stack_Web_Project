import { Injectable, Logger } from '@nestjs/common';
import { RolesService } from '../roles/roles.service';

/**
 * Seeding Service
 * Veritabanını varsayılan verilerle başlatır
 */
@Injectable()
export class SeedingService {
  private readonly logger = new Logger(SeedingService.name);

  constructor(private readonly rolesService: RolesService) {}

  /**
   * Varsayılan rolleri ve diğer temel verileri seed et
   */
  async seed() {
    try {
      this.logger.log('Veritabanı seeding başladı...');
      await this.rolesService.seedDefaults();
      this.logger.log('Veritabanı seeding tamamlandı ✓');
    } catch (error) {
      this.logger.error('Seeding sırasında hata oluştu:', error);
    }
  }
}
