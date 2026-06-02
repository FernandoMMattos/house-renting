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
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PropertyService } from './property.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { PropertyDto } from './dto/property.dto.js';
import { FindPropertiesQueryDto } from './dto/find-properties-query.dto.js';
import { UpdatePropertyDto } from './dto/update-property.dto.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import type { JwtUser } from '../common/types/jwt-user.decorator.js';

@Controller('properties')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@CurrentUser() user: JwtUser, @Body() dto: PropertyDto) {
    return this.propertyService.create(user.id, dto);
  }

  @Get()
  findAll(@Query() query: FindPropertiesQueryDto) {
    return this.propertyService.findAll(query);
  }

  // NOTE: 'me' must stay above ':id' to avoid being matched as a param
  @UseGuards(JwtAuthGuard)
  @Get('me')
  findMine(@CurrentUser() user: JwtUser) {
    return this.propertyService.findByAuthor(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.propertyService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @CurrentUser() user: JwtUser,
    @Body() dto: UpdatePropertyDto,
  ) {
    return this.propertyService.update(user.id, id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: JwtUser) {
    return this.propertyService.delete(user.id, id);
  }
}
