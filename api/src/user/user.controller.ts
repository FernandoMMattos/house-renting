import {
  Controller,
  Get,
  UseGuards,
  Request,
  Patch,
  Body,
} from '@nestjs/common';
import { UserService } from './user.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { userDto } from './dto/user.dto.js';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Request() req) {
    return this.userService.findOne(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  updateMe(@Request() req, @Body() dto: userDto) {
    return this.userService.update(req.user.id, dto);
  }
}
