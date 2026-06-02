import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { ConfigModule } from '@nestjs/config';
import { PropertyModule } from './property/property.module.js';
import { UploadModule } from './upload/upload.module.js';
import { UsersModule } from './users/users.module.js';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 10 }]),
    AuthModule,
    PrismaModule,
    PropertyModule,
    UploadModule,
    UsersModule,
  ],
})
export class AppModule {}
