import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { PrismaService } from './prisma/prisma.service.js';
import { ConfigModule } from '@nestjs/config';
import { PropertyService } from './property/property.service.js';
import { PropertyController } from './property/property.controller.js';
import { PropertyModule } from './property/property.module.js';
import { UploadService } from './upload/upload.service.js';
import { UploadController } from './upload/upload.controller.js';
import { UploadModule } from './upload/upload.module.js';
import { UserController } from './user/user.controller.js';
import { UserModule } from './user/user.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    PrismaModule,
    PropertyModule,
    UploadModule,
    UserModule,
  ],
  controllers: [PropertyController, UploadController, UserController],
  providers: [PrismaService, PropertyService, UploadService],
})
export class AppModule {}
