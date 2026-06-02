import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto, LoginDto } from './dto/auth.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class AuthService {
  private readonly SALT_ROUNDS = 10;

  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (exists) throw new ConflictException('Email already in use');

    const hashedPassword = await bcrypt.hash(dto.password, this.SALT_ROUNDS);

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
}
