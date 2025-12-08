/**
 * Oyun Oluşturma DTO (Data Transfer Object)
 * 
 * Yeni oyun oluşturma ve güncelleme işlemleri için gerekli verileri tanımlar ve doğrular.
 * 
 * Validasyon kuralları:
 * - Name: String, zorunlu
 * - Platform: String, zorunlu (PC, PlayStation, Xbox, vb.)
 * - Genre: String, opsiyonel (Action, RPG, Strategy, vb.)
 */
import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Oyun oluşturma için DTO
 */
export class CreateGameDto {
  @ApiProperty({
    example: 'Elden Ring',
    description: 'Oyun adı',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'PC',
    description: 'Oyunun platformu',
  })
  @IsString()
  platform: string;

  @ApiProperty({
    example: 'Action RPG',
    description: 'Oyun türü',
    required: false,
  })
  @IsOptional()
  @IsString()
  genre?: string;
}

/**
 * Oyun güncelleme için DTO
 * Tüm alanlar opsiyonel - sadece değiştirilmek istenen alanlar gönderilir
 */
export class UpdateGameDto {
  @ApiProperty({
    example: 'Elden Ring',
    description: 'Oyun adı',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    example: 'PC',
    description: 'Oyunun platformu',
    required: false,
  })
  @IsOptional()
  @IsString()
  platform?: string;

  @ApiProperty({
    example: 'Action RPG',
    description: 'Oyun türü',
    required: false,
  })
  @IsOptional()
  @IsString()
  genre?: string;
}
