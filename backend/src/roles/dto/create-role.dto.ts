import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({
    example: 'MODERATOR',
    description: 'Rol adı',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Platform moderatörleri',
    description: 'Rol açıklaması',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateRoleDto {
  @ApiProperty({
    example: 'MODERATOR',
    description: 'Rol adı',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    example: 'Platform moderatörleri',
    description: 'Rol açıklaması',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
