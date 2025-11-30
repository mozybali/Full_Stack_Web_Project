import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { GamesService } from './games.service';
import { CreateGameDto, UpdateGameDto } from './dto/create-game.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

// Oyun kataloğu yönetimi ile ilgili tüm endpoint'ler
@ApiTags('Oyunlar')
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
  findOne(@Param('id') id: string) {
    return this.gamesService.findOne(+id);
  }

  /**
   * Yeni oyun oluştur (Admin)
   */
  @Post()
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
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
  update(@Param('id') id: string, @Body() dto: UpdateGameDto) {
    return this.gamesService.update(+id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Delete game' })
  @ApiResponse({
    status: 200,
    description: 'Game deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Game not found',
  })
  remove(@Param('id') id: string) {
    return this.gamesService.remove(+id);
  }
}
