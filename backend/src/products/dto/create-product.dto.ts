import { IsString, IsNumber, IsEnum, IsOptional, Min } from 'class-validator';
import { ProductType } from '../../common/enums/product-type.enum';

export class CreateProductDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(ProductType)
  type: ProductType;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(1)
  stock: number;

  @IsNumber()
  gameId: number;
}

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  stock?: number;
}
