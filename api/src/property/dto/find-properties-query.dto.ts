import {
  IsOptional,
  IsString,
  IsInt,
  Min,
  Max,
  IsArray,
  IsEnum,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { PropertyType, RoomType } from '../../../generated/prisma/enums.js';

export class FindPropertiesQueryDto {
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string'
      ? value
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      : [],
  )
  @IsArray()
  @IsString({ each: true })
  areaCodes?: string[];

  @IsOptional()
  @IsString()
  @IsEnum(RoomType)
  roomType?: RoomType;

  @IsOptional()
  @IsString()
  @IsEnum(PropertyType)
  propertyType?: PropertyType;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  maxPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  bedrooms?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  bathrooms?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  sharingWith?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number;
}
