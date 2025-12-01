import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Request, ParseIntPipe, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dto/create-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleNames } from '../common/enums/role-names.enum';
import { multerMemoryOptions } from '../config/multer.config';

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
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  /**
   * Yeni ürün oluştur (Satıcı ve Admin'e özel)
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleNames.SELLER, RoleNames.ADMIN)
  @UseInterceptors(FileInterceptor('image', multerMemoryOptions))
  @ApiBearerAuth('JWT')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Yeni ürün oluştur (resimle birlikte)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'Oyun Lisansı' },
        description: { type: 'string', example: 'Premium oyun lisansı' },
        type: { type: 'string', enum: ['ACCOUNT', 'KEY'], example: 'KEY' },
        price: { type: 'number', example: 29.99 },
        stock: { type: 'number', example: 100 },
        gameId: { type: 'number', example: 1 },
        image: { type: 'string', format: 'binary', description: 'Ürün resmi (JPEG, PNG, WebP - Max 5MB)' },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Ürün başarıyla oluşturuldu',
  })
  @ApiResponse({
    status: 401,
    description: 'Yetkisiz erişim',
  })
  create(
    @Body() dto: CreateProductDto,
    @Request() req: any,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.productsService.create(dto, req.user.sub, image);
  }

  /**
   * Ürün bilgilerini güncelle
   */
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleNames.SELLER, RoleNames.ADMIN)
  @UseInterceptors(FileInterceptor('image', multerMemoryOptions))
  @ApiBearerAuth('JWT')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Ürün bilgilerini güncelle (resimle birlikte)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'Oyun Lisansı' },
        description: { type: 'string', example: 'Premium oyun lisansı' },
        price: { type: 'number', example: 29.99 },
        stock: { type: 'number', example: 100 },
        gameId: { type: 'number', example: 1 },
        isActive: { type: 'boolean', example: true },
        image: { type: 'string', format: 'binary', description: 'Yeni ürün resmi (opsiyonel)' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Ürün başarıyla güncellendi',
  })
  @ApiResponse({
    status: 404,
    description: 'Ürün bulunamadı',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductDto,
    @Request() req: any,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.productsService.update(id, dto, req.user.sub, image);
  }

  /**
   * Ürünü sil
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleNames.SELLER, RoleNames.ADMIN)
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
  remove(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.productsService.remove(id, req.user.sub);
  }
}
