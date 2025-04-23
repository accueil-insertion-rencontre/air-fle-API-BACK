import { Module } from '@nestjs/common';
import { WorkingHourService } from './working-hour.service';
import { WorkingHourController } from './working-hour.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [WorkingHourController],
  providers: [WorkingHourService],
  exports: [WorkingHourService],
})
export class WorkingHourModule {} 