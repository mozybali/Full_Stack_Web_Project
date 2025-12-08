/**
 * Sipariş Oluşturma DTO (Data Transfer Object)
 * 
 * Yeni sipariş oluşturma ve güncelleme işlemleri için gerekli verileri tanımlar ve doğrular.
 * 
 * Validasyon kuralları:
 * - Items: Sipariş öğeleri dizisi (minimum 1 öğe)
 * - ProductId: Pozitif tamsayı
 * - Quantity: Minimum 1
 */
import { IsNumber, IsArray, ValidateNested, Min, IsEnum, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '../../common/enums/order-status.enum';

/**
 * Sipariş öğesi için DTO
 */
export class CreateOrderItemDto {
  @ApiProperty({
    example: 1,
    description: 'Ürün ID',
  })
  @Type(() => Number)
  @IsNumber()
  productId: number;

  @ApiProperty({
    example: 2,
    description: 'Sipariş miktarı',
  })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  quantity: number;
}

/**
 * Sipariş oluşturma için DTO
 * Sepetteki ürünlerden sipariş oluşturur
 */
export class CreateOrderDto {
  @ApiProperty({
    type: [CreateOrderItemDto],
    description: 'Sipariş öğelerinin dizisi',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}

/**
 * Sipariş durumu güncelleme için DTO
 * Sadece admin kullanıcılar sipariş durumunu güncelleyebilir
 */
export class UpdateOrderDto {
  @ApiProperty({
    enum: OrderStatus,
    example: OrderStatus.COMPLETED,
    description: 'Yeni sipariş durumu',
    required: false,
  })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;
}
