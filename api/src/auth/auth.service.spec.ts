import { Test, TestingModule } from '@nestjs/testing';
import {
  ConflictException,
  UnauthorizedException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { EmailService } from '../email/email.service.js';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

const mockUser = {
  id: 'user-id-1',
  email: 'test@example.com',
  name: 'Test User',
  password: 'hashed-password',
  emailVerified: true,
};

const makePrisma = () => ({
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  verificationToken: {
    findUnique: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    deleteMany: jest.fn(),
  },
  passwordResetToken: {
    findUnique: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    deleteMany: jest.fn(),
  },
  tokenBlacklist: {
    create: jest.fn(),
    deleteMany: jest.fn(),
  },
  $transaction: jest.fn(),
});

describe('AuthService', () => {
  let service: AuthService;
  let prisma: ReturnType<typeof makePrisma>;

  const mockJwt = { sign: jest.fn().mockReturnValue('jwt-token') };
  const mockEmail = {
    sendVerificationEmail: jest.fn(),
    sendPasswordResetEmail: jest.fn(),
  };

  beforeEach(async () => {
    prisma = makePrisma();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: mockJwt },
        { provide: PrismaService, useValue: prisma },
        { provide: EmailService, useValue: mockEmail },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);

    jest.clearAllMocks();
    mockJwt.sign.mockReturnValue('jwt-token');
    mockEmail.sendVerificationEmail.mockResolvedValue(undefined);
    mockEmail.sendPasswordResetEmail.mockResolvedValue(undefined);
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
  });

  // ─── register ────────────────────────────────────────────────────────────────

  describe('register', () => {
    const dto = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    };
    const createdUser = {
      id: 'user-id-1',
      email: 'test@example.com',
      name: 'Test User',
    };

    beforeEach(() => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.$transaction.mockImplementation(async (callbackOrOps: any) => {
        if (typeof callbackOrOps === 'function') {
          const tx = {
            user: { create: jest.fn().mockResolvedValue(createdUser) },
            verificationToken: { create: jest.fn().mockResolvedValue({}) },
          };
          return callbackOrOps(tx);
        }
        return Promise.all(callbackOrOps);
      });
    });

    it('returns success message and sends verification email', async () => {
      const result = await service.register(dto);

      expect(result.message).toContain('Registration successful');
      expect(mockEmail.sendVerificationEmail).toHaveBeenCalledWith(
        createdUser.email,
        expect.any(String),
      );
    });

    it('hashes the password before saving', async () => {
      await service.register(dto);

      expect(bcrypt.hash).toHaveBeenCalledWith(dto.password, 10);
    });

    it('throws ConflictException when email is already taken', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser);

      await expect(service.register(dto)).rejects.toThrow(ConflictException);
    });

    it('rolls back user creation when email sending fails', async () => {
      mockEmail.sendVerificationEmail.mockRejectedValue(
        new Error('SMTP error'),
      );
      let rollbackCalled = false;
      prisma.$transaction.mockImplementation(async (callbackOrOps: any) => {
        if (typeof callbackOrOps === 'function') {
          const tx = {
            user: { create: jest.fn().mockResolvedValue(createdUser) },
            verificationToken: { create: jest.fn().mockResolvedValue({}) },
          };
          return callbackOrOps(tx);
        }
        rollbackCalled = true;
        return [];
      });

      await expect(service.register(dto)).rejects.toThrow('SMTP error');
      expect(rollbackCalled).toBe(true);
    });
  });

  // ─── login ───────────────────────────────────────────────────────────────────

  describe('login', () => {
    const dto = { email: mockUser.email, password: 'password123' };

    it('returns user (without sensitive fields) and JWT token', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.login(dto);

      expect(result.token).toBe('jwt-token');
      expect(result.user).not.toHaveProperty('password');
      expect(result.user).not.toHaveProperty('emailVerified');
      expect(result.user.email).toBe(mockUser.email);
    });

    it('throws UnauthorizedException when user does not exist', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException when password is wrong', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
    });

    it('throws ForbiddenException when email is not verified', async () => {
      prisma.user.findUnique.mockResolvedValue({
        ...mockUser,
        emailVerified: false,
      });

      await expect(service.login(dto)).rejects.toThrow(ForbiddenException);
    });

    it('throws ForbiddenException with EMAIL_NOT_VERIFIED message', async () => {
      prisma.user.findUnique.mockResolvedValue({
        ...mockUser,
        emailVerified: false,
      });

      await expect(service.login(dto)).rejects.toThrow('EMAIL_NOT_VERIFIED');
    });
  });

  // ─── verifyEmail ─────────────────────────────────────────────────────────────

  describe('verifyEmail', () => {
    const validToken = 'valid-verification-token';
    const tokenRecord = {
      token: validToken,
      userId: mockUser.id,
      expiresAt: new Date(Date.now() + 60_000),
    };

    it('marks user as verified and deletes the token', async () => {
      prisma.verificationToken.findUnique.mockResolvedValue(tokenRecord);
      prisma.$transaction.mockResolvedValue([{}, {}]);

      const result = await service.verifyEmail(validToken);

      expect(result.message).toContain('Email verified');
      expect(prisma.$transaction).toHaveBeenCalledTimes(1);
    });

    it('throws BadRequestException for an unknown token', async () => {
      prisma.verificationToken.findUnique.mockResolvedValue(null);

      await expect(service.verifyEmail('bad-token')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('throws BadRequestException for an expired token', async () => {
      prisma.verificationToken.findUnique.mockResolvedValue({
        ...tokenRecord,
        expiresAt: new Date(Date.now() - 1000),
      });

      await expect(service.verifyEmail(validToken)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  // ─── forgotPassword ───────────────────────────────────────────────────────────

  describe('forgotPassword', () => {
    it('returns generic message and sends no email when user is not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      const result = await service.forgotPassword('ghost@example.com');

      expect(result.message).toContain('If that email exists');
      expect(mockEmail.sendPasswordResetEmail).not.toHaveBeenCalled();
    });

    it('returns generic message and sends no email when user email is unverified', async () => {
      prisma.user.findUnique.mockResolvedValue({
        ...mockUser,
        emailVerified: false,
      });

      const result = await service.forgotPassword(mockUser.email);

      expect(result.message).toContain('If that email exists');
      expect(mockEmail.sendPasswordResetEmail).not.toHaveBeenCalled();
    });

    it('sends reset email for a verified user', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser);
      prisma.passwordResetToken.deleteMany.mockResolvedValue({});
      prisma.passwordResetToken.create.mockResolvedValue({});

      const result = await service.forgotPassword(mockUser.email);

      expect(result.message).toContain('If that email exists');
      expect(mockEmail.sendPasswordResetEmail).toHaveBeenCalledWith(
        mockUser.email,
        expect.any(String),
      );
    });

    it('deletes any existing reset tokens before creating a new one', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser);
      prisma.passwordResetToken.deleteMany.mockResolvedValue({});
      prisma.passwordResetToken.create.mockResolvedValue({});

      await service.forgotPassword(mockUser.email);

      expect(prisma.passwordResetToken.deleteMany).toHaveBeenCalledWith({
        where: { userId: mockUser.id },
      });
    });
  });

  // ─── resetPassword ────────────────────────────────────────────────────────────

  describe('resetPassword', () => {
    const token = 'reset-token-hex';
    const tokenRecord = {
      token,
      userId: mockUser.id,
      expiresAt: new Date(Date.now() + 60_000),
    };

    it('updates the password and deletes the reset token', async () => {
      prisma.passwordResetToken.findUnique.mockResolvedValue(tokenRecord);
      prisma.$transaction.mockResolvedValue([{}, {}]);

      const result = await service.resetPassword(token, 'NewPass123');

      expect(result.message).toContain('Password reset successfully');
      expect(bcrypt.hash).toHaveBeenCalledWith('NewPass123', 10);
    });

    it('throws BadRequestException for an invalid token', async () => {
      prisma.passwordResetToken.findUnique.mockResolvedValue(null);

      await expect(service.resetPassword('bad-token', 'pass')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('throws BadRequestException for an expired token', async () => {
      prisma.passwordResetToken.findUnique.mockResolvedValue({
        ...tokenRecord,
        expiresAt: new Date(Date.now() - 1000),
      });

      await expect(service.resetPassword(token, 'pass')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  // ─── logout ───────────────────────────────────────────────────────────────────

  describe('logout', () => {
    it('adds the token to the blacklist and purges expired entries', async () => {
      prisma.$transaction.mockResolvedValue([{}, {}]);

      await service.logout('some.jwt.token');

      expect(prisma.$transaction).toHaveBeenCalledTimes(1);
    });
  });
});
