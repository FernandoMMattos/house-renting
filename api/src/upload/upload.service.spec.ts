import { Test, TestingModule } from '@nestjs/testing';
import {
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UploadService } from './upload.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

const mockCloudinaryResult = {
  secure_url:
    'https://res.cloudinary.com/demo/image/upload/rental_houses/abc123.webp',
  public_id: 'rental_houses/abc123',
};

jest.mock('cloudinary', () => ({
  v2: {
    uploader: {
      upload_stream: jest.fn(),
      destroy: jest.fn(),
    },
    config: jest.fn(),
  },
}));

jest.mock('streamifier', () => ({
  createReadStream: jest.fn().mockReturnValue({ pipe: jest.fn() }),
}));

import { v2 as cloudinary } from 'cloudinary';

const mockFile: Express.Multer.File = {
  fieldname: 'file',
  originalname: 'photo.jpg',
  encoding: '7bit',
  mimetype: 'image/jpeg',
  buffer: Buffer.from('fake-image-data'),
  size: 1024,
  stream: null as any,
  destination: '',
  filename: '',
  path: '',
};

const mockProperty = {
  id: 'prop-id-1',
  authorId: 'user-id-1',
};

const mockImage = {
  id: 'img-id-1',
  url: mockCloudinaryResult.secure_url,
  publicId: mockCloudinaryResult.public_id,
  propertyId: 'prop-id-1',
  property: { authorId: 'user-id-1' },
};

const makePrisma = () => ({
  property: {
    findUnique: jest.fn(),
  },
  image: {
    createMany: jest.fn(),
    findFirst: jest.fn(),
    delete: jest.fn(),
  },
});

describe('UploadService', () => {
  let service: UploadService;
  let prisma: ReturnType<typeof makePrisma>;

  beforeEach(async () => {
    prisma = makePrisma();

    const module: TestingModule = await Test.createTestingModule({
      providers: [UploadService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<UploadService>(UploadService);
    jest.clearAllMocks();

    (cloudinary.uploader.upload_stream as jest.Mock).mockImplementation(
      (_opts: any, callback: (err: Error | null, result?: any) => void) => {
        callback(null, mockCloudinaryResult);
        return { on: jest.fn(), write: jest.fn(), end: jest.fn() };
      },
    );
    (cloudinary.uploader.destroy as jest.Mock).mockResolvedValue({
      result: 'ok',
    });
  });

  // ─── uploadImages ─────────────────────────────────────────────────────────────

  describe('uploadImages', () => {
    it('uploads files to Cloudinary and saves image records to the DB', async () => {
      prisma.property.findUnique.mockResolvedValue(mockProperty);
      prisma.image.createMany.mockResolvedValue({ count: 1 });

      const result = await service.uploadImages(
        [mockFile],
        'prop-id-1',
        'user-id-1',
      );

      expect(cloudinary.uploader.upload_stream).toHaveBeenCalledTimes(1);
      expect(prisma.image.createMany).toHaveBeenCalledWith({
        data: [
          {
            url: mockCloudinaryResult.secure_url,
            publicId: mockCloudinaryResult.public_id,
            propertyId: 'prop-id-1',
          },
        ],
      });
      expect(result).toEqual({ count: 1 });
    });

    it('uploads multiple files in batches of 3', async () => {
      prisma.property.findUnique.mockResolvedValue(mockProperty);
      prisma.image.createMany.mockResolvedValue({ count: 4 });
      const files = [mockFile, mockFile, mockFile, mockFile];

      await service.uploadImages(files, 'prop-id-1', 'user-id-1');

      expect(cloudinary.uploader.upload_stream).toHaveBeenCalledTimes(4);
    });

    it('throws NotFoundException when the property does not exist', async () => {
      prisma.property.findUnique.mockResolvedValue(null);

      await expect(
        service.uploadImages([mockFile], 'nonexistent', 'user-id-1'),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws ForbiddenException when the requester does not own the property', async () => {
      prisma.property.findUnique.mockResolvedValue(mockProperty);

      await expect(
        service.uploadImages([mockFile], 'prop-id-1', 'other-user'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('cleans up Cloudinary uploads and throws when DB save fails', async () => {
      prisma.property.findUnique.mockResolvedValue(mockProperty);
      prisma.image.createMany.mockRejectedValue(new Error('DB write error'));

      await expect(
        service.uploadImages([mockFile], 'prop-id-1', 'user-id-1'),
      ).rejects.toThrow(InternalServerErrorException);

      expect(cloudinary.uploader.destroy).toHaveBeenCalledWith(
        mockCloudinaryResult.public_id,
      );
    });
  });

  // ─── deleteImage ──────────────────────────────────────────────────────────────

  describe('deleteImage', () => {
    it('deletes the image from Cloudinary and removes the DB record', async () => {
      prisma.image.findFirst.mockResolvedValue(mockImage);
      prisma.image.delete.mockResolvedValue(mockImage);

      await service.deleteImage('rental_houses/abc123', 'user-id-1');

      expect(cloudinary.uploader.destroy).toHaveBeenCalledWith(
        mockImage.publicId,
      );
      expect(prisma.image.delete).toHaveBeenCalledWith({
        where: { id: mockImage.id },
      });
    });

    it('throws NotFoundException when the image does not exist', async () => {
      prisma.image.findFirst.mockResolvedValue(null);

      await expect(
        service.deleteImage('nonexistent-public-id', 'user-id-1'),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws ForbiddenException when the requester does not own the image', async () => {
      prisma.image.findFirst.mockResolvedValue({
        ...mockImage,
        property: { authorId: 'another-user' },
      });

      await expect(
        service.deleteImage('rental_houses/abc123', 'user-id-1'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('still deletes the DB record even if Cloudinary destroy fails', async () => {
      prisma.image.findFirst.mockResolvedValue(mockImage);
      prisma.image.delete.mockResolvedValue(mockImage);
      (cloudinary.uploader.destroy as jest.Mock).mockRejectedValue(
        new Error('Cloudinary down'),
      );

      await service.deleteImage('rental_houses/abc123', 'user-id-1');

      expect(prisma.image.delete).toHaveBeenCalledWith({
        where: { id: mockImage.id },
      });
    });
  });
});
