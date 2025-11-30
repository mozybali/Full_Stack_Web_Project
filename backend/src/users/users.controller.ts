import { Controller, Get, Param, Delete, UseGuards, Body, Put, Patch, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UpdateUserDto } from './dto/update-user.dto';

// Kullanıcı yönetimi ile ilgili tüm endpoint'ler
@ApiTags('Kullanıcılar')
@ApiBearerAuth('JWT')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Tüm kullanıcıları listele (Admin)
   */
  @Get()
  @Roles('ADMIN')
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
   * Kullanıcı bilgilerini güncelle (Kendi profili veya Admin)
   */
  @Put(':id')
  @ApiOperation({ summary: 'Kullanıcı bilgilerini güncelle' })
  @ApiResponse({
    status: 200,
    description: 'Kullanıcı başarıyla güncellendi',
  })
  @ApiResponse({
    status: 404,
    description: 'Kullanıcı bulunamadı',
  })
  update(@Param('id') id: string, @Body() dto: UpdateUserDto, @Req() req: any) {
    return this.usersService.update(+id, dto, req.user);
  }

  /**
   * Kullanıcı bilgilerini kısmen güncelle (PATCH - Kendi profili veya Admin)
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Kullanıcı bilgilerini kısmen güncelle' })
  @ApiResponse({
    status: 200,
    description: 'Kullanıcı başarıyla güncellendi',
  })
  @ApiResponse({
    status: 404,
    description: 'Kullanıcı bulunamadı',
  })
  updatePartial(@Param('id') id: string, @Body() dto: UpdateUserDto, @Req() req: any) {
    return this.usersService.update(+id, dto, req.user);
  }

  /**
   * Kullanıcıyı sil (Admin)
   */
  @Delete(':id')
  @Roles('ADMIN')
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
