import {
  IsDateString,
  IsInt,
  IsString,
  Min,
  Length,
  Max,
  MaxLength,
  IsNotEmpty,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PropertyType, RoomType } from '../../../generated/prisma/enums.js';

export class PropertyDto {
  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  street: string;

  @Type(() => Number)
  @IsInt()
  number: number;

  @IsInt()
  @Min(1)
  @Max(24)
  areaCode: string;

  @IsString()
  @MaxLength(1500)
  description: string;

  @Length(7)
  @IsString()
  eirCode: string;

  @IsString()
  @IsEnum(PropertyType)
  propertyType: PropertyType;

  @IsString()
  @IsEnum(RoomType)
  roomType: RoomType;

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
  availableUntil: string;

  @Type(() => Number)
  @Min(0)
  @IsInt()
  price: number;
}
