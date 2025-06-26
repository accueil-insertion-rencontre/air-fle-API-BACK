import { Module } from '@nestjs/common';
import { ContinuationService } from './continuation.service';
import { ContinuationController } from './continuation.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { LearnerHistoryModule } from '../learner-history/learner-history.module';

@Module({
  imports: [PrismaModule, LearnerHistoryModule],
  controllers: [ContinuationController],
  providers: [ContinuationService],
  exports: [ContinuationService],
})
export class ContinuationModule {}
