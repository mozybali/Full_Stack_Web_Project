import { Controller, Get, Post, Body, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

// Sipariş yönetimi ile ilgili tüm endpoint'ler
@ApiTags('Siparişler')
@ApiBearerAuth('JWT')
@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  /**
   * Yeni sipariş oluştur
   * Alışveriş sepetinden sipariş oluşturur
   */
  @Post()
  @ApiOperation({ summary: 'Yeni sipariş oluştur' })
  @ApiResponse({
    status: 201,
    description: 'Sipariş başarıyla oluşturuldu',
  })
  @ApiResponse({
    status: 400,
    description: 'Geçersiz sipariş verisi',
  })
  create(@Body() dto: CreateOrderDto, @Req() req: any) {
    return this.ordersService.create(dto, req.user.sub);
  }

  /**
   * Mevcut kullanıcının siparişlerini getir
   */
  @Get('my')
  @ApiOperation({ summary: 'Kendi siparişlerimizi getir' })
  @ApiResponse({
    status: 200,
    description: 'Kullanıcının sipariş listesi',
  })
  findMy(@Req() req: any) {
    return this.ordersService.findMy(req.user.sub);
  }

  /**
   * Tüm siparişleri getir (Admin)
   */
  @Get()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Tüm siparişleri getir' })
  @ApiResponse({
    status: 200,
    description: 'Tüm siparişlerin listesi',
  })
  findAll() {
    return this.ordersService.findAll();
  }

  /**
   * ID'ye göre sipariş bul
   */
  @Get(':id')
  @ApiOperation({ summary: 'ID\'ye göre sipariş getir' })
  @ApiResponse({
    status: 200,
    description: 'Sipariş başarıyla döndürüldü',
  })
  @ApiResponse({
    status: 404,
    description: 'Sipariş bulunamadı',
  })
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.ordersService.findOne(+id, req.user);
  }

  /**
   * Sipariş durumunu güncelle (PATCH)
   */
  @Patch(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Sipariş durumunu güncelle' })
  @ApiResponse({
    status: 200,
    description: 'Sipariş başarıyla güncellendi',
  })
  @ApiResponse({
    status: 404,
    description: 'Sipariş bulunamadı',
  })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderDto) {
    return this.ordersService.updateStatus(+id, dto);
  }
}
