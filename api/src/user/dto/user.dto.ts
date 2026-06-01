import { IsString } from 'class-validator';

export class userDto {
  @IsString()
  name?: string;

  @IsString()
  password?: string;
}
