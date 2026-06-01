import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdatePropertyDto {
  @IsOptional()
  @IsString()
  street?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  number?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(24)
  areaCode?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @Length(7)
  @IsString()
  eirCode?: string;

  @IsOptional()
  @IsString()
  propertyType?: string;

  @IsOptional()
  @IsString()
  roomType?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  bedrooms?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  bathrooms?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  sharingWith?: number;

  @IsOptional()
  @IsDateString()
  availableFrom?: string;

  @IsOptional()
  @IsDateString()
  availableFor?: string;

  @IsOptional()
  @Type(() => Number)
  @Min(0)
  price?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
