import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { CreateRoleDto, UpdateRoleDto } from './dto/create-role.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleNames } from '../common/enums/role-names.enum';

// Rol yönetimi ile ilgili tüm endpoint'ler
@ApiTags('Roller')
@ApiBearerAuth('JWT')
@Controller('roles')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  /**
   * Tüm rolleri getir (Admin)
   */
  @Get()
  @Roles(RoleNames.ADMIN)
  @ApiOperation({ summary: 'Tüm rolleri getir' })
  @ApiResponse({
    status: 200,
    description: 'Tüm rollerin listesi',
  })
  findAll() {
    return this.rolesService.findAll();
  }

  /**
   * ID'ye göre rol bul (Admin)
   */
  @Get(':id')
  @Roles(RoleNames.ADMIN)
  @ApiOperation({ summary: 'ID\'ye göre rol getir' })
  @ApiResponse({
    status: 200,
    description: 'Rol başarıyla döndürüldü',
  })
  @ApiResponse({
    status: 404,
    description: 'Rol bulunamadı',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.rolesService.findOne(id);
  }

  /**
   * Yeni rol oluştur (Admin)
   */
  @Post()
  @Roles(RoleNames.ADMIN)
  @ApiOperation({ summary: 'Yeni rol oluştur' })
  @ApiResponse({
    status: 201,
    description: 'Rol başarıyla oluşturuldu',
  })
  create(@Body() dto: CreateRoleDto) {
    return this.rolesService.create(dto);
  }

  /**
   * Rol bilgilerini güncelle (Admin)
   */
  @Put(':id')
  @Roles(RoleNames.ADMIN)
  @ApiOperation({ summary: 'Rol bilgilerini güncelle' })
  @ApiResponse({
    status: 200,
    description: 'Rol başarıyla güncellendi',
  })
  @ApiResponse({
    status: 404,
    description: 'Rol bulunamadı',
  })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateRoleDto) {
    return this.rolesService.update(id, dto);
  }



  /**
   * Rolü sil (Admin)
   */
  @Delete(':id')
  @Roles(RoleNames.ADMIN)
  @ApiOperation({ summary: 'Rolü sil' })
  @ApiResponse({
    status: 200,
    description: 'Rol başarıyla silindi',
  })
  @ApiResponse({
    status: 404,
    description: 'Rol bulunamadı',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.rolesService.remove(id);
  }
}
