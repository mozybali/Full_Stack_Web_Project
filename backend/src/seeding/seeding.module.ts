import { Module } from '@nestjs/common';
import { SeedingService } from './seeding.service';
import { RolesModule } from '../roles/roles.module';

/**
 * Seeding Module
 * Veritabanı başlangıç verilerini yönetir
 */
@Module({
  imports: [RolesModule],
  providers: [SeedingService],
  exports: [SeedingService],
})
export class SeedingModule {}
