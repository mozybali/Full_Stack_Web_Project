import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
