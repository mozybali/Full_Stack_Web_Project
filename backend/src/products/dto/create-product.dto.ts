import { IsString, IsNumber, IsEnum, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ProductType } from '../../common/enums/product-type.enum';

export class CreateProductDto {
  @ApiProperty({
    example: 'Oyun Lisansı',
    description: 'Ürün başlığı',
  })
  @IsString()
  title: string;

  @ApiProperty({
    example: 'Premium oyun lisansı 1 yıl garantili',
    description: 'Ürün açıklaması',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    enum: ProductType,
    example: ProductType.KEY,
    description: 'Ürün türü',
  })
  @IsEnum(ProductType)
  type: ProductType;

  @ApiProperty({
    example: 29.99,
    description: 'Ürün fiyatı',
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    example: 100,
    description: 'Ürün stok miktarı',
  })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  stock: number;

  @ApiProperty({
    example: 1,
    description: 'Oyun ID',
  })
  @Type(() => Number)
  @IsNumber()
  gameId: number;

  @ApiProperty({
    example: '/uploads/products/product-123456.webp',
    description: 'Ürün resmi URL',
    required: false,
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;
}

export class UpdateProductDto {
  @ApiProperty({
    example: 'Oyun Lisansı',
    description: 'Ürün başlığı',
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    example: 'Premium oyun lisansı 1 yıl garantili',
    description: 'Ürün açıklaması',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 29.99,
    description: 'Ürün fiyatı',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiProperty({
    example: 100,
    description: 'Ürün stok miktarı',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  stock?: number;

  @ApiProperty({
    example: 1,
    description: 'Oyun ID',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  gameId?: number;

  @ApiProperty({
    example: '/uploads/products/product-123456.webp',
    description: 'Ürün resmi URL',
    required: false,
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({
    example: true,
    description: 'Ürün aktif mi',
    required: false,
  })
  @IsOptional()
  isActive?: boolean;
}
