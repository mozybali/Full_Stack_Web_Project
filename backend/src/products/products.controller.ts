import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dto/create-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

// Ürün yönetimi ile ilgili tüm endpoint'ler
@ApiTags('Ürünler')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  /**
   * Tüm ürünleri listele
   * Tüm kullanıcılar tarafından erişilebilir
   */
  @Get()
  @ApiOperation({ summary: 'Tüm ürünleri getir' })
  @ApiResponse({
    status: 200,
    description: 'Ürün listesi başarıyla döndürüldü',
  })
  findAll() {
    return this.productsService.findAll();
  }

  /**
   * ID'ye göre ürün bul
   */
  @Get(':id')
  @ApiOperation({ summary: 'ID\'ye göre ürün getir' })
  @ApiResponse({
    status: 200,
    description: 'Ürün başarıyla döndürüldü',
  })
  @ApiResponse({
    status: 404,
    description: 'Ürün bulunamadı',
  })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  /**
   * Yeni ürün oluştur (Satıcı ve Admin'e özel)
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Yeni ürün oluştur' })
  @ApiResponse({
    status: 201,
    description: 'Ürün başarıyla oluşturuldu',
  })
  @ApiResponse({
    status: 401,
    description: 'Yetkisiz erişim',
  })
  create(@Body() dto: CreateProductDto, @Request() req: any) {
    return this.productsService.create(dto, req.user.sub);
  }

  /**
   * Ürün bilgilerini güncelle
   */
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Ürün bilgilerini güncelle' })
  @ApiResponse({
    status: 200,
    description: 'Ürün başarıyla güncellendi',
  })
  @ApiResponse({
    status: 404,
    description: 'Ürün bulunamadı',
  })
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.update(+id, dto);
  }

  /**
   * Ürünü sil
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Ürünü sil' })
  @ApiResponse({
    status: 200,
    description: 'Ürün başarıyla silindi',
  })
  @ApiResponse({
    status: 404,
    description: 'Ürün bulunamadı',
  })
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
