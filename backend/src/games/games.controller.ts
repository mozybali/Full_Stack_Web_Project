import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, ParseIntPipe, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { GamesService } from './games.service';
import { CreateGameDto, UpdateGameDto } from './dto/create-game.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleNames } from '../common/enums/role-names.enum';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';

// Oyun kataloğu yönetimi ile ilgili tüm endpoint'ler
@ApiTags('Oyunlar')
@UseInterceptors(TransformInterceptor)
@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  /**
   * Tüm oyunları listele
   * Tüm kullanıcılar tarafından erişilebilir
   */
  @Get()
  @ApiOperation({ summary: 'Tüm oyunları getir' })
  @ApiResponse({
    status: 200,
    description: 'Oyun listesi başarıyla döndürüldü',
  })
  findAll() {
    return this.gamesService.findAll();
  }

  /**
   * ID'ye göre oyun bul
   */
  @Get(':id')
  @ApiOperation({ summary: 'ID\'ye göre oyun getir' })
  @ApiResponse({
    status: 200,
    description: 'Oyun başarıyla döndürüldü',
  })
  @ApiResponse({
    status: 404,
    description: 'Oyun bulunamadı',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.gamesService.findOne(id);
  }

  /**
   * Yeni oyun oluştur (Admin)
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleNames.ADMIN)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Yeni oyun oluştur' })
  @ApiResponse({
    status: 201,
    description: 'Oyun başarıyla oluşturuldu',
  })
  @ApiResponse({
    status: 401,
    description: 'Yetkisiz erişim',
  })
  create(@Body() dto: CreateGameDto) {
    return this.gamesService.create(dto);
  }

  /**
   * Oyun bilgilerini güncelle
   */
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleNames.ADMIN)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Oyun bilgilerini güncelle' })
  @ApiResponse({
    status: 200,
    description: 'Oyun başarıyla güncellendi',
  })
  @ApiResponse({
    status: 404,
    description: 'Oyun bulunamadı',
  })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateGameDto) {
    return this.gamesService.update(id, dto);
  }



  /**
   * Oyunu sil
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleNames.ADMIN)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Oyunu sil' })
  @ApiResponse({
    status: 200,
    description: 'Oyun başarıyla silindi',
  })
  @ApiResponse({
    status: 404,
    description: 'Oyun bulunamadı',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.gamesService.remove(id);
  }
}
