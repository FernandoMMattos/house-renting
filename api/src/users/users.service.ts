import { Prisma } from '../../generated/prisma/client.js';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { UpdateUserDto } from './dto/users.dto.js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private readonly SALT_ROUNDS = 10;
  constructor(private readonly prisma: PrismaService) {}

  async findOne(id: string) {
    const user = this.prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: string, dto: UpdateUserDto) {
    await this.findOne(id);

    const data: Prisma.UserUpdateInput = {};
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.password !== undefined)
      data.password = await bcrypt.hash(dto.password, this.SALT_ROUNDS);

    return this.prisma.user.update({
      where: { id },
      data,
      select: { id: true, name: true, email: true },
    });
  }
}
