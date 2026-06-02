import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service.js';
import type {} from 'multer';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { UploadDto } from './dto/upload-photos.dto.js';
import type { JwtUser } from '../common/types/jwt-user.decorator.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @UseGuards(JwtAuthGuard)
  @Post('house-photos')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FilesInterceptor('photos', 10, {
      limits: { fileSize: 10 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp|gif)$/)) {
          return cb(
            new BadRequestException('Only image files are allowed'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async uploadHousePhotos(
    @UploadedFiles() files: Express.Multer.File[],
    @Body('propertyId') dto: UploadDto,
    @CurrentUser() user: JwtUser,
  ) {
    return this.uploadService.uploadImages(files, dto.propertyId, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':publicId')
  async removeImage(
    @Param('publicId') publicId: string,
    @CurrentUser() user: JwtUser,
  ) {
    return this.uploadService.deleteImage(publicId, user.id);
  }
}
