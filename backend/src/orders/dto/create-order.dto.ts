import { IsNumber, IsArray, ValidateNested, Min, IsEnum, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '../../common/enums/order-status.enum';

export class CreateOrderItemDto {
  @ApiProperty({
    example: 1,
    description: 'Ürün ID',
  })
  @IsNumber()
  productId: number;

  @ApiProperty({
    example: 2,
    description: 'Sipariş miktarı',
  })
  @IsNumber()
  @Min(1)
  quantity: number;
}

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
