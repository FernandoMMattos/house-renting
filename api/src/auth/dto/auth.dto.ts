import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(5)
  @MaxLength(72)
  password: string;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
