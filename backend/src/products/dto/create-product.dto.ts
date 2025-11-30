import { IsString, IsNumber, IsEnum, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProductType } from '../../common/enums/product-type.enum';

export class CreateProductDto {
  @ApiProperty({
    example: 'Game Key',
    description: 'Product title',
  })
  @IsString()
  title: string;

  @ApiProperty({
    example: 'Premium game key with 1 year warranty',
    description: 'Product description',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    enum: ProductType,
    example: ProductType.KEY,
    description: 'Product type',
  })
  @IsEnum(ProductType)
  type: ProductType;

  @ApiProperty({
    example: 29.99,
    description: 'Product price',
  })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    example: 100,
    description: 'Product stock quantity',
  })
  @IsNumber()
  @Min(1)
  stock: number;

  @ApiProperty({
    example: 1,
    description: 'Game ID',
  })
  @IsNumber()
  gameId: number;
}

export class UpdateProductDto {
  @ApiProperty({
    example: 'Game Key',
    description: 'Product title',
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    example: 'Premium game key with 1 year warranty',
    description: 'Product description',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 29.99,
    description: 'Product price',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiProperty({
    example: 100,
    description: 'Product stock quantity',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  stock?: number;
}
