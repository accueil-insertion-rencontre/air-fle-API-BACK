import { Module } from '@nestjs/common';
import { NationalityService } from './nationality.service';
import { NationalityController } from './nationality.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [NationalityController],
  providers: [NationalityService],
  exports: [NationalityService],
})
export class NationalityModule {} 