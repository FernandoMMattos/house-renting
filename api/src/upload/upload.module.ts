import { Module } from '@nestjs/common';
import { UploadService } from './upload.service.js';
import { CloudinaryProvider } from '../config/cloudinary.config.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  providers: [UploadService, CloudinaryProvider],
  exports: [UploadService],
})
export class UploadModule {}
