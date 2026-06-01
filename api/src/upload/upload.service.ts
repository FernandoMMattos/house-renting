import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { PrismaService } from '../prisma/prisma.service.js';
import * as streamifier from 'streamifier';

@Injectable()
export class UploadService {
  constructor(private readonly prisma: PrismaService) {}

  private uploadToCloudinary(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse> {
    return new Promise((res, rej) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'rental_houses',
          format: 'webp',
          quality: 'auto:best',
          transformation: [{ width: 2560, height: 1440, crop: 'limit' }],
        },
        (error, result) => {
          if (error) return rej(error);
          if (!result) return rej(new Error('Cloudinary returned no result'));
          res(result);
        },
      );
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  async uploadImages(files: Express.Multer.File[], houseId: string) {
    const cloudinaryResults = await Promise.all(
      files.map((file) => this.uploadToCloudinary(file)),
    );

    const saved = await Promise.all(
      cloudinaryResults.map((result) =>
        this.prisma.image.create({
          data: {
            url: result.secure_url,
            publicId: result.public_id,
            houseId,
          },
        }),
      ),
    );

    return saved;
  }

  async deleteImage(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId);
  }
}
