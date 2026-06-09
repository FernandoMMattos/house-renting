import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PropertyService } from './property.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

const mockProperty = {
  id: 'prop-id-1',
  street: 'Main Street',
  number: 42,
  areaCode: 'D01',
  eirCode: 'D01AB12',
  description: 'A lovely flat in Dublin city centre.',
  propertyType: 'APARTMENT',
  roomType: 'DOUBLE',
  bedrooms: 2,
  bathrooms: 1,
  sharingWith: 0,
  availableFrom: new Date('2025-01-01'),
  availableUntil: new Date('2026-01-01'),
  price: 1500,
  authorId: 'user-id-1',
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const makePrisma = () => ({
  property: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    count: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
});

describe('PropertyService', () => {
  let service: PropertyService;
  let prisma: ReturnType<typeof makePrisma>;

  beforeEach(async () => {
    prisma = makePrisma();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PropertyService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<PropertyService>(PropertyService);
    jest.clearAllMocks();
  });

  // ─── create ──────────────────────────────────────────────────────────────────

  describe('create', () => {
    const dto = {
      street: 'Main Street',
      number: 42,
      areaCode: 'D01',
      eirCode: 'D01AB12',
      description: 'A lovely flat.',
      propertyType: 'APARTMENT' as const,
      roomType: 'DOUBLE' as const,
      bedrooms: 2,
      bathrooms: 1,
      sharingWith: 0,
      availableFrom: '2025-06-01',
      availableUntil: '2026-06-01',
      price: 1500,
    };

    it('creates and returns the new property', async () => {
      prisma.property.create.mockResolvedValue(mockProperty);

      const result = await service.create('user-id-1', dto);

      expect(prisma.property.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ authorId: 'user-id-1' }),
        }),
      );
      expect(result).toEqual(mockProperty);
    });

    it('converts availableFrom and availableUntil to Date objects', async () => {
      prisma.property.create.mockResolvedValue(mockProperty);

      await service.create('user-id-1', dto);

      const call = prisma.property.create.mock.calls[0][0];
      expect(call.data.availableFrom).toBeInstanceOf(Date);
      expect(call.data.availableUntil).toBeInstanceOf(Date);
    });

    it('throws BadRequestException when availableFrom is after availableUntil', async () => {
      const invalid = {
        ...dto,
        availableFrom: '2026-06-01',
        availableUntil: '2025-06-01',
      };

      await expect(service.create('user-id-1', invalid)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('throws BadRequestException when availableFrom equals availableUntil', async () => {
      const same = {
        ...dto,
        availableFrom: '2025-06-01',
        availableUntil: '2025-06-01',
      };

      await expect(service.create('user-id-1', same)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  // ─── findAll ─────────────────────────────────────────────────────────────────

  describe('findAll', () => {
    const properties = [mockProperty];

    beforeEach(() => {
      prisma.property.findMany.mockResolvedValue(properties);
      prisma.property.count.mockResolvedValue(1);
    });

    it('returns paginated data with total, limit and offset', async () => {
      const result = await service.findAll();

      expect(result).toEqual({
        data: properties,
        total: 1,
        limit: 20,
        offset: 0,
      });
    });

    it('only queries active properties', async () => {
      await service.findAll();

      const whereArg = prisma.property.findMany.mock.calls[0][0].where;
      expect(whereArg.isActive).toBe(true);
    });

    it('applies areaCode filter when provided', async () => {
      await service.findAll({ areaCodes: ['D01', 'D02'] });

      const where = prisma.property.findMany.mock.calls[0][0].where;
      expect(where.areaCode).toEqual({ in: ['D01', 'D02'] });
    });

    it('applies price range filter', async () => {
      await service.findAll({ minPrice: 500, maxPrice: 2000 });

      const where = prisma.property.findMany.mock.calls[0][0].where;
      expect(where.price).toEqual({ gte: 500, lte: 2000 });
    });

    it('respects custom limit and offset', async () => {
      await service.findAll({ limit: 5, offset: 10 });

      const call = prisma.property.findMany.mock.calls[0][0];
      expect(call.take).toBe(5);
      expect(call.skip).toBe(10);
    });

    it('applies roomType and propertyType filters', async () => {
      await service.findAll({
        roomType: 'SINGLE',
        propertyType: 'FLAT',
      } as any);

      const where = prisma.property.findMany.mock.calls[0][0].where;
      expect(where.roomType).toBe('SINGLE');
      expect(where.propertyType).toBe('FLAT');
    });
  });

  // ─── findOne ─────────────────────────────────────────────────────────────────

  describe('findOne', () => {
    it('returns the property when found', async () => {
      prisma.property.findUnique.mockResolvedValue(mockProperty);

      const result = await service.findOne('prop-id-1');

      expect(result).toEqual(mockProperty);
    });

    it('throws NotFoundException when property does not exist', async () => {
      prisma.property.findUnique.mockResolvedValue(null);

      await expect(service.findOne('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // ─── findByAuthor ─────────────────────────────────────────────────────────────

  describe('findByAuthor', () => {
    it('returns all properties belonging to the author', async () => {
      prisma.property.findMany.mockResolvedValue([mockProperty]);

      const result = await service.findByAuthor('user-id-1');

      expect(result).toHaveLength(1);
      expect(prisma.property.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { authorId: 'user-id-1' } }),
      );
    });

    it('returns an empty array when the author has no properties', async () => {
      prisma.property.findMany.mockResolvedValue([]);

      const result = await service.findByAuthor('user-id-2');

      expect(result).toEqual([]);
    });
  });

  // ─── update ───────────────────────────────────────────────────────────────────

  describe('update', () => {
    beforeEach(() => {
      prisma.property.findUnique.mockResolvedValue(mockProperty);
      prisma.property.update.mockResolvedValue(mockProperty);
    });

    it('updates and returns the property when owner calls it', async () => {
      const result = await service.update('user-id-1', 'prop-id-1', {
        price: 1200,
      });

      expect(prisma.property.update).toHaveBeenCalled();
      expect(result).toEqual(mockProperty);
    });

    it('throws ForbiddenException when a non-owner tries to update', async () => {
      await expect(
        service.update('other-user', 'prop-id-1', { price: 1200 } as any),
      ).rejects.toThrow(ForbiddenException);
    });

    it('throws NotFoundException when the property does not exist', async () => {
      prisma.property.findUnique.mockResolvedValue(null);

      await expect(
        service.update('user-id-1', 'nonexistent', { price: 1200 } as any),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws BadRequestException when both dates are provided but invalid', async () => {
      await expect(
        service.update('user-id-1', 'prop-id-1', {
          availableFrom: '2026-06-01',
          availableUntil: '2025-06-01',
        } as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('allows partial date update when only one date is provided', async () => {
      await expect(
        service.update('user-id-1', 'prop-id-1', { price: 1800 } as any),
      ).resolves.not.toThrow();
    });
  });

  // ─── delete ───────────────────────────────────────────────────────────────────

  describe('delete', () => {
    beforeEach(() => {
      prisma.property.findUnique.mockResolvedValue(mockProperty);
      prisma.property.delete.mockResolvedValue(mockProperty);
    });

    it('deletes the property when owner calls it', async () => {
      await service.delete('user-id-1', 'prop-id-1');

      expect(prisma.property.delete).toHaveBeenCalledWith({
        where: { id: 'prop-id-1' },
      });
    });

    it('throws ForbiddenException when a non-owner tries to delete', async () => {
      await expect(service.delete('other-user', 'prop-id-1')).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('throws NotFoundException when the property does not exist', async () => {
      prisma.property.findUnique.mockResolvedValue(null);

      await expect(service.delete('user-id-1', 'nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
