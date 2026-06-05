import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(72)
  password?: string;

  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(72)
  currentPassword?: string;
}
