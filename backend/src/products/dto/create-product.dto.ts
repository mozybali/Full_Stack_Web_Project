import { IsString, IsNumber, IsEnum, IsOptional, Min } from 'class-validator';
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
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    example: 100,
    description: 'Ürün stok miktarı',
  })
  @IsNumber()
  @Min(1)
  stock: number;

  @ApiProperty({
    example: 1,
    description: 'Oyun ID',
  })
  @IsNumber()
  gameId: number;
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
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiProperty({
    example: 100,
    description: 'Ürün stok miktarı',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  stock?: number;

  @ApiProperty({
    example: 1,
    description: 'Oyun ID',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  gameId?: number;

  @ApiProperty({
    example: true,
    description: 'Ürün aktif mi',
    required: false,
  })
  @IsOptional()
  isActive?: boolean;
}
