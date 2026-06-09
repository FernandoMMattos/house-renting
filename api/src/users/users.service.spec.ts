import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from './users.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

const safeUser = {
  id: 'user-id-1',
  name: 'Test User',
  email: 'test@example.com',
};
const fullUser = { ...safeUser, password: 'hashed-password' };

const makePrisma = () => ({
  user: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
});

describe('UsersService', () => {
  let service: UsersService;
  let prisma: ReturnType<typeof makePrisma>;

  beforeEach(async () => {
    prisma = makePrisma();

    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
    (bcrypt.hash as jest.Mock).mockResolvedValue('new-hashed-password');
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
  });

  // ─── findOne ─────────────────────────────────────────────────────────────────

  describe('findOne', () => {
    it('returns id, name and email for an existing user', async () => {
      prisma.user.findUnique.mockResolvedValue(safeUser);

      const result = await service.findOne('user-id-1');

      expect(result).toEqual(safeUser);
      expect(result).not.toHaveProperty('password');
    });

    it('throws NotFoundException when user does not exist', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(service.findOne('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // ─── update ───────────────────────────────────────────────────────────────────

  describe('update', () => {
    it('updates the name without touching the password', async () => {
      prisma.user.update.mockResolvedValue({ ...safeUser, name: 'New Name' });

      const result = await service.update('user-id-1', { name: 'New Name' });

      expect(prisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: { name: 'New Name' } }),
      );
      expect(result.name).toBe('New Name');
      expect(bcrypt.hash).not.toHaveBeenCalled();
    });

    it('updates the password when currentPassword is correct', async () => {
      prisma.user.findUnique.mockResolvedValue(fullUser);
      prisma.user.update.mockResolvedValue(safeUser);

      await service.update('user-id-1', {
        password: 'NewPass123',
        currentPassword: 'OldPass',
      });

      expect(bcrypt.compare).toHaveBeenCalledWith('OldPass', fullUser.password);
      expect(bcrypt.hash).toHaveBeenCalledWith('NewPass123', 10);
      expect(prisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: { password: 'new-hashed-password' } }),
      );
    });

    it('throws BadRequestException when currentPassword is missing for a password change', async () => {
      await expect(
        service.update('user-id-1', { password: 'NewPass123' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('throws BadRequestException when currentPassword is wrong', async () => {
      prisma.user.findUnique.mockResolvedValue(fullUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.update('user-id-1', {
          password: 'NewPass123',
          currentPassword: 'WrongPass',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('throws NotFoundException when user is not found during password change', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.update('nonexistent', {
          password: 'NewPass',
          currentPassword: 'OldPass',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('can update both name and password in a single call', async () => {
      prisma.user.findUnique.mockResolvedValue(fullUser);
      prisma.user.update.mockResolvedValue({
        ...safeUser,
        name: 'Updated Name',
      });

      await service.update('user-id-1', {
        name: 'Updated Name',
        password: 'NewPass123',
        currentPassword: 'OldPass',
      });

      const updateData = prisma.user.update.mock.calls[0][0].data;
      expect(updateData.name).toBe('Updated Name');
      expect(updateData.password).toBe('new-hashed-password');
    });
  });
});
