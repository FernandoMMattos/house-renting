import {
  Controller,
  Get,
  UseGuards,
  Request,
  Patch,
  Body,
} from '@nestjs/common';
import { UsersService } from './users.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { UpdateUserDto } from './dto/users.dto.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import type { JwtUser } from '../common/types/jwt-user.decorator.js';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@CurrentUser() user: JwtUser) {
    return this.userService.findOne(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  updateMe(@CurrentUser() user: JwtUser, @Body() dto: UpdateUserDto) {
    return this.userService.update(user.id, dto);
  }
}
