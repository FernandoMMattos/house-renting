import { IsNotEmpty, IsString } from 'class-validator';

export class UploadDto {
  @IsString()
  @IsNotEmpty()
  propertyId: string;
}
