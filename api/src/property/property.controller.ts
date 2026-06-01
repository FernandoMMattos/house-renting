import {
  Body,
  Controller,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
  Get,
  Delete,
  Patch,
} from '@nestjs/common';
import { PropertyService } from './property.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { PropertyDto } from './dto/property.dto.js';
import { FindPropertiesQueryDto } from './dto/find-property-by-area-code.dto.js';
import { UpdatePropertyDto } from './dto/update-property.dto.js';

@Controller('properties')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req, @Body() dto: PropertyDto) {
    return this.propertyService.create(req.user.id, dto);
  }

  @Get()
  findAll(@Query() query: FindPropertiesQueryDto) {
    return this.propertyService.findAll(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  findMine(@Request() req) {
    return this.propertyService.findByAuthor(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.propertyService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePropertyDto) {
    return (this, this.propertyService.update(id, dto));
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.propertyService.delete(id);
  }
}
