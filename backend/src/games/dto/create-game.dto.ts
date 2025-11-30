import { IsString, IsOptional } from 'class-validator';

export class CreateGameDto {
  @IsString()
  name: string;

  @IsString()
  platform: string;

  @IsOptional()
  @IsString()
  genre?: string;
}

export class UpdateGameDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  platform?: string;

  @IsOptional()
  @IsString()
  genre?: string;
}
