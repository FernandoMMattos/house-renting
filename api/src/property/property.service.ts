import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { PropertyDto } from './dto/property.dto.js';
import { UpdatePropertyDto } from './dto/update-property.dto.js';
import { FindPropertiesQueryDto } from './dto/find-properties-query.dto.js';

@Injectable()
export class PropertyService {
  constructor(private readonly prisma: PrismaService) {}

  async create(authorId: string, dto: PropertyDto) {
    if (new Date(dto.availableFrom) >= new Date(dto.availableUntil)) {
      throw new BadRequestException(
        'availableFrom must be before availableUntil',
      );
    }

    return this.prisma.property.create({
      data: {
        ...dto,
        availableFrom: new Date(dto.availableFrom),
        availableUntil: new Date(dto.availableUntil),
        authorId,
      },
    });
  }

  async findAll(filters?: FindPropertiesQueryDto) {
    const where = {
      isActive: true,
      ...(filters?.areaCodes?.length && {
        areaCode: { in: filters.areaCodes },
      }),
      ...(filters?.roomType && { roomType: filters.roomType }),
      ...(filters?.propertyType && { propertyType: filters.propertyType }),
      ...(filters?.bedrooms && { bedrooms: { gte: filters.bedrooms } }),
      ...(filters?.bathrooms && { bathrooms: { gte: filters.bathrooms } }),
      ...(filters?.sharingWith && {
        sharingWith: { gte: filters.sharingWith },
      }),
      ...((filters?.minPrice || filters?.maxPrice) && {
        price: {
          ...(filters.minPrice && { gte: filters.minPrice }),
          ...(filters.maxPrice && { lte: filters.maxPrice }),
        },
      }),
    };
    const [data, total] = await this.prisma.$transaction([
      this.prisma.property.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: filters?.limit ?? 20,
        skip: filters?.offset ?? 0,
        include: {
          author: { select: { id: true, name: true, email: true } },
          images: true,
        },
      }),
      this.prisma.property.count({ where }),
    ]);

    return {
      data,
      total,
      limit: filters?.limit ?? 20,
      offset: filters?.offset ?? 0,
    };
  }

  async findOne(id: string) {
    const property = await this.prisma.property.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, name: true, email: true } },
        images: true,
      },
    });
    if (!property) throw new NotFoundException('Property not found');
    return property;
  }

  async findByAuthor(id: string) {
    return this.prisma.property.findMany({
      where: { authorId: id, isActive: true },
      orderBy: { createdAt: 'desc' },
      include: { images: true },
    });
  }

  async update(requesterId: string, id: string, dto: UpdatePropertyDto) {
    await this.findPropertyAndVerifyOwner(id, requesterId);

    if (
      dto.availableFrom &&
      dto.availableUntil &&
      new Date(dto.availableFrom) >= new Date(dto.availableUntil)
    ) {
      throw new BadRequestException(
        'availableFrom must be before availableUntil',
      );
    }

    return this.prisma.property.update({
      where: { id },
      data: {
        ...dto,
        ...(dto.availableFrom && {
          availableFrom: new Date(dto.availableFrom),
        }),
        ...(dto.availableUntil && {
          availableUntil: new Date(dto.availableUntil),
        }),
      },
    });
  }

  async delete(requesterId: string, id: string) {
    await this.findPropertyAndVerifyOwner(id, requesterId);
    return this.prisma.property.update({
      where: { id },
      data: { isActive: false },
    });
  }

  private async findPropertyAndVerifyOwner(id: string, requesterId: string) {
    const property = await this.prisma.property.findUnique({ where: { id } });
    if (!property) throw new NotFoundException('Property not found');
    if (property.authorId !== requesterId)
      throw new ForbiddenException('You do not own this property');
    return property;
  }
}
