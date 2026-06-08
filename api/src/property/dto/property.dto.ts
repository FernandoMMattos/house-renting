import {
  IsDateString,
  IsInt,
  IsString,
  IsNumber,
  Min,
  MaxLength,
  IsNotEmpty,
  IsEnum,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PropertyType, RoomType } from '../../../generated/prisma/enums.js';
import { ApiProperty } from '@nestjs/swagger';

export class PropertyDto {
  @ApiProperty()
  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  street: string;

  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  number: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  areaCode: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(1500)
  description: string;

  @ApiProperty()
  @Matches(/^D\d{2}[A-Z0-9]{4}$/i, { message: 'eirCode must be a valid Dublin Eircode (e.g. D01LM87)' })
  @IsString()
  eirCode: string;

  @ApiProperty()
  @IsEnum(PropertyType)
  propertyType: PropertyType;

  @ApiProperty()
  @IsEnum(RoomType)
  roomType: RoomType;

  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  bedrooms: number;

  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  bathrooms: number;

  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  sharingWith: number;

  @ApiProperty()
  @IsDateString()
  availableFrom: string;

  @ApiProperty()
  @IsDateString()
  availableUntil: string;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price: number;
}
