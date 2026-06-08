import {
  IsDateString,
  IsInt,
  IsString,
  IsNumber,
  Min,
  Length,
  MaxLength,
  IsNotEmpty,
  IsEnum,
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
  @MaxLength(1500)
  description: string;

  @ApiProperty()
  @Length(7)
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
