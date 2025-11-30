import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

// Rol yönetimi ile ilgili tüm endpoint'ler
@ApiTags('Roller')
@ApiBearerAuth('JWT')
@Controller('roles')
@UseGuards(JwtAuthGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  /**
   * Tüm rolleri getir (Admin)
   */
  @Get()
  @ApiOperation({ summary: 'Tüm rolleri getir' })
  @ApiResponse({
    status: 200,
    description: 'Tüm rollerin listesi',
  })
  findAll() {
    return this.rolesService.findAll();
  }
}
