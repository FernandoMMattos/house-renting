import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { PrismaService } from '../prisma/prisma.service.js';
import * as streamifier from 'streamifier';

@Injectable()
export class UploadService {
  constructor(private readonly prisma: PrismaService) {}

  private uploadToCloudinary(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'rental_houses',
          format: 'webp',
          quality: 'auto:best',
          transformation: [{ width: 2560, height: 1440, crop: 'limit' }],
        },
        (error, result) => {
          if (error) return reject(error);
          if (!result)
            return reject(new Error('Cloudinary returned no result'));
          resolve(result);
        },
      );
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  async uploadImages(
    files: Express.Multer.File[],
    propertyId: string,
    requesterId: string,
  ) {
    const property = await this.prisma.property.findUnique({
      where: { id: propertyId },
    });
    if (!property) throw new NotFoundException('Property not found');
    if (property.authorId !== requesterId)
      throw new ForbiddenException('You do not own this property');

    const cloudinaryResults = await Promise.all(
      files.map((file) => this.uploadToCloudinary(file)),
    );

    try {
      return await this.prisma.image.createMany({
        data: cloudinaryResults.map((result) => ({
          url: result.secure_url,
          publicId: result.public_id,
          propertyId,
        })),
      });
    } catch (error) {
      await Promise.allSettled(
        cloudinaryResults.map((r) => cloudinary.uploader.destroy(r.public_id)),
      );
      throw new InternalServerErrorException('Failed to save images');
    }
  }

  async deleteImage(imageId: string, requesterId: string): Promise<void> {
    const image = await this.prisma.image.findUnique({
      where: { id: imageId },
      include: { property: { select: { authorId: true } } },
    });

    if (!image) throw new NotFoundException('Image not found');

    if (image.property.authorId !== requesterId)
      throw new ForbiddenException("You don't own this image");

    await cloudinary.uploader.destroy(image.publicId);
    await this.prisma.image.delete({ where: { id: imageId } });
  }
}
