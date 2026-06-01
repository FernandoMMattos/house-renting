import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { userDto } from './dto/user.dto.js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true },
    });
  }

  async update(id: string, dto: userDto) {
    const data: Record<string, any> = {};

    if (dto.name) data.name = dto.name;
    if (dto.password) data.password = await bcrypt.hash(dto.password, 10);

    return this.prisma.user.update({
      where: { id },
      data,
      select: { id: true, name: true, email: true },
    });
  }
}
