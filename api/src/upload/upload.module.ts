import { Module } from '@nestjs/common';
import { UploadService } from './upload.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { UploadController } from './upload.controller.js';
import { CloudinaryProvider } from '../../cloudinary.config.js';

@Module({
  controllers: [UploadController],
  providers: [PrismaService, UploadService, CloudinaryProvider],
  exports: [UploadService],
})
export class UploadModule {}
