import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service.js';
import type {} from 'multer';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { UploadDto } from './dto/upload-photos.dto.js';
import type { JwtUser } from '../common/types/jwt-user.types.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';

// Validate actual file bytes, not just the MIME header (which can be spoofed)
function isAllowedImageBuffer(buf: Buffer): boolean {
  if (buf.length < 12) return false;
  const isJpeg = buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff;
  const isPng =
    buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47 &&
    buf[4] === 0x0d && buf[5] === 0x0a && buf[6] === 0x1a && buf[7] === 0x0a;
  const isWebp =
    buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46 &&
    buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50;
  return isJpeg || isPng || isWebp;
}

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
        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
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
    @Body() dto: UploadDto,
    @CurrentUser() user: JwtUser,
  ) {
    for (const file of files) {
      if (!isAllowedImageBuffer(file.buffer)) {
        throw new BadRequestException(`File "${file.originalname}" is not a valid image`);
      }
    }
    return this.uploadService.uploadImages(files, dto.propertyId, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeImage(
    @Query('publicId') publicId: string,
    @CurrentUser() user: JwtUser,
  ) {
    if (!publicId) throw new BadRequestException('publicId query param is required');
    await this.uploadService.deleteImage(publicId, user.id);
  }
}
