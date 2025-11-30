import { Controller, Get, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

// Kullanıcı yönetimi ile ilgili tüm endpoint'ler
@ApiTags('Kullanıcılar')
@ApiBearerAuth('JWT')
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Tüm kullanıcıları listele (Admin)
   */
  @Get()
  @ApiOperation({ summary: 'Tüm kullanıcıları getir' })
  @ApiResponse({
    status: 200,
    description: 'Kullanıcıların listesi',
  })
  @ApiResponse({
    status: 401,
    description: 'Yetkisiz erişim',
  })
  findAll() {
    return this.usersService.findAll();
  }

  /**
   * ID'ye göre kullanıcı bul
   */
  @Get(':id')
  @ApiOperation({ summary: 'ID\'ye göre kullanıcı getir' })
  @ApiResponse({
    status: 200,
    description: 'Kullanıcı başarıyla döndürüldü',
  })
  @ApiResponse({
    status: 404,
    description: 'Kullanıcı bulunamadı',
  })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  /**
   * Kullanıcıyı sil (Admin)
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Kullanıcıyı sil' })
  @ApiResponse({
    status: 200,
    description: 'Kullanıcı başarıyla silindi',
  })
  @ApiResponse({
    status: 404,
    description: 'Kullanıcı bulunamadı',
  })
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
