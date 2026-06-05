import { Prisma } from '../../generated/prisma/client.js';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { UpdateUserDto } from './dto/users.dto.js';
import * as bcrypt from 'bcrypt';
import { BCRYPT_SALT_ROUNDS } from '../common/constants.js';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: string, dto: UpdateUserDto) {
    if (dto.password !== undefined) {
      if (!dto.currentPassword) {
        throw new BadRequestException(
          'currentPassword is required to change password',
        );
      }

      const user = await this.prisma.user.findUnique({
        where: { id },
        select: { password: true },
      });

      if (!user) throw new NotFoundException('User not found');

      const matches = await bcrypt.compare(dto.currentPassword, user.password);

      if (!matches)
        throw new BadRequestException('Current password is incorrect');
    }

    const data: Prisma.UserUpdateInput = {};
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.password !== undefined)
      data.password = await bcrypt.hash(dto.password, BCRYPT_SALT_ROUNDS);

    return this.prisma.user.update({
      where: { id },
      data,
      select: { id: true, name: true, email: true },
    });
  }
}
