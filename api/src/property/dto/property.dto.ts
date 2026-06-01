import {
  IsDateString,
  IsInt,
  IsString,
  Min,
  Length,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export class PropertyDto {
  @IsString()
  street: string;

  @Type(() => Number)
  @IsInt()
  number: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(24)
  areaCode: number;

  @IsString()
  description: string;

  @Length(7)
  @IsString()
  eirCode: string;

  @IsString()
  propertyType: string;

  @IsString()
  roomType: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  bedrooms: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  bathrooms: number;

  @Type(() => Number)
  @IsInt()
  sharingWith: number;

  @IsDateString()
  availableFrom: string;

  @IsDateString()
  availableFor: string;

  @Type(() => Number)
  @Min(0)
  price: number;
}
