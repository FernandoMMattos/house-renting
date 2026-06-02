import { Module } from '@nestjs/common';
import { PropertyController } from './property.controller.js';
import { PropertyService } from './property.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [PropertyController],
  providers: [PropertyService],
})
export class PropertyModule {}
