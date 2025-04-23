import { Module } from '@nestjs/common';
import { FrenchLevelService } from './french-level.service';
import { FrenchLevelController } from './french-level.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FrenchLevelController],
  providers: [FrenchLevelService],
  exports: [FrenchLevelService],
})
export class FrenchLevelModule {} 