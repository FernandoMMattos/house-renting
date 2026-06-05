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

  private async uploadAll(files: Express.Multer.File[], concurrency = 3) {
    const results: UploadApiResponse[] = [];
    for (let i = 0; i < files.length; i += concurrency) {
      const batch = files.slice(i, i + concurrency);
      const batchResults = await Promise.all(
        batch.map((f) => this.uploadToCloudinary(f)),
      );
      results.push(...batchResults);
    }
    return results;
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

    const cloudinaryResults = await this.uploadAll(files);

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

  async deleteImage(publicId: string, requesterId: string): Promise<void> {
    const image = await this.prisma.image.findFirst({
      where: { publicId },
      include: { property: { select: { authorId: true } } },
    });

    if (!image) throw new NotFoundException('Image not found');

    if (image.property.authorId !== requesterId)
      throw new ForbiddenException("You don't own this image");

    try {
      await cloudinary.uploader.destroy(image.publicId);
    } catch (error) {
      console.error(
        `Failed to delete Cloudinary asset ${image.publicId}`,
        error,
      );
    }
    await this.prisma.image.delete({ where: { id: image.id } });
  }
}
