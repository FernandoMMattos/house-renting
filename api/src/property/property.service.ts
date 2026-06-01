import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { PropertyDto } from './dto/property.dto.js';
import { UpdatePropertyDto } from './dto/update-property.dto.js';
import { FindPropertiesQueryDto } from './dto/find-property-by-area-code.dto.js';

@Injectable()
export class PropertyService {
  constructor(private readonly prisma: PrismaService) {}

  create(authorId: string, dto: PropertyDto) {
    return this.prisma.property.create({
      data: {
        ...dto,
        availableFor: new Date(dto.availableFor),
        availableFrom: new Date(dto.availableFrom),
        authorId,
      },
    });
  }

  findAll(filters?: FindPropertiesQueryDto) {
    return this.prisma.property.findMany({
      where: {
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
      },
      orderBy: { createdAt: 'desc' },
      include: {
        author: { select: { id: true, name: true, email: true } },
        image: true,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.property.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, name: true, email: true } },
        image: true,
      },
    });
  }

  findByAuthor(id: string) {
    return this.prisma.property.findMany({
      where: { authorId: id },
      orderBy: { createdAt: 'desc' },
      include: { image: true },
    });
  }

  update(id: string, dto: UpdatePropertyDto) {
    return this.prisma.property.update({
      where: { id },
      data: {
        ...dto,
        ...(dto.availableFrom && {
          availableFrom: new Date(dto.availableFrom),
        }),
        ...(dto.availableFor && { availableFor: new Date(dto.availableFor) }),
      },
    });
  }

  delete(id: string) {
    return this.prisma.property.delete({
      where: { id },
    });
  }
}
