import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto, LoginDto } from './dto/auth.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { BCRYPT_SALT_ROUNDS, JWT_TTL_MS } from '../common/constants.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (exists) throw new ConflictException('Email already in use');

    const hashedPassword = await bcrypt.hash(dto.password, BCRYPT_SALT_ROUNDS);

    const user = await this.prisma.user.create({
      data: { email: dto.email, name: dto.name, password: hashedPassword },
      select: { id: true, email: true, name: true },
    });

    return { user, token: this.signToken(user.id, user.email) };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { password: _pw, ...safeUser } = user;
    return { user: safeUser, token: this.signToken(user.id, user.email) };
  }

  private signToken(userId: string, email: string): string {
    return this.jwtService.sign({ sub: userId, email });
  }

  async logout(token: string) {
    const now = new Date();
    await this.prisma.$transaction([
      this.prisma.tokenBlacklist.create({
        data: { token, expiresAt: new Date(now.getTime() + JWT_TTL_MS) },
      }),
      this.prisma.tokenBlacklist.deleteMany({
        where: { expiresAt: { lt: now } },
      }),
    ]);
  }
}
