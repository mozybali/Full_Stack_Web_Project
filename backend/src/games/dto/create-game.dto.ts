import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGameDto {
  @ApiProperty({
    example: 'Elden Ring',
    description: 'Game name',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'PC',
    description: 'Gaming platform',
  })
  @IsString()
  platform: string;

  @ApiProperty({
    example: 'Action RPG',
    description: 'Game genre',
    required: false,
  })
  @IsOptional()
  @IsString()
  genre?: string;
}

export class UpdateGameDto {
  @ApiProperty({
    example: 'Elden Ring',
    description: 'Game name',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    example: 'PC',
    description: 'Gaming platform',
    required: false,
  })
  @IsOptional()
  @IsString()
  platform?: string;

  @ApiProperty({
    example: 'Action RPG',
    description: 'Game genre',
    required: false,
  })
  @IsOptional()
  @IsString()
  genre?: string;
}
