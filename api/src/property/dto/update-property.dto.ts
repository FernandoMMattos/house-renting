import { PartialType } from '@nestjs/mapped-types';
import { PropertyDto } from './property.dto.js';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdatePropertyDto extends PartialType(PropertyDto) {
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
