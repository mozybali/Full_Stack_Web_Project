import { Controller, Get, Param, Delete, UseGuards, Body, Put, Req, ParseIntPipe, ForbiddenException, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserRolesDto } from './dto/update-user-roles.dto';
import { RoleNames } from '../common/enums/role-names.enum';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';

// Kullanıcı yönetimi ile ilgili tüm endpoint'ler
@ApiTags('Kullanıcılar')
@ApiBearerAuth('JWT')
@UseInterceptors(TransformInterceptor)
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Tüm kullanıcıları listele (Admin)
   */
  @Get()
  @Roles(RoleNames.ADMIN)
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
   * Kendi bilgisini veya admin tüm kullanıcıları görebilir
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
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    // Kendi profilini görebilir veya admin tüm profilleri görebilir
    if (req.user.sub !== id && !req.user.roles?.includes(RoleNames.ADMIN)) {
      throw new ForbiddenException('Bu kullanıcının bilgilerine erişim izniniz yok');
    }
    return this.usersService.findOne(id);
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
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto, @Req() req: any) {
    return this.usersService.update(id, dto, req.user);
  }



  /**
   * Kullanıcıyı sil (Admin)
   */
  @Delete(':id')
  @Roles(RoleNames.ADMIN)
  @ApiOperation({ summary: 'Kullanıcıyı sil' })
  @ApiResponse({
    status: 200,
    description: 'Kullanıcı başarıyla silindi',
  })
  @ApiResponse({
    status: 404,
    description: 'Kullanıcı bulunamadı',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }

  /**
   * Kullanıcıya rolleri ata (Admin)
   */
  @Put(':id/roles')
  @Roles(RoleNames.ADMIN)
  @ApiOperation({ summary: 'Kullanıcıya rolleri ata' })
  @ApiResponse({
    status: 200,
    description: 'Roller başarıyla atandı',
  })
  @ApiResponse({
    status: 404,
    description: 'Kullanıcı veya rol bulunamadı',
  })
  updateRoles(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserRolesDto,
  ) {
    return this.usersService.updateRoles(id, dto.roleIds);
  }
}
