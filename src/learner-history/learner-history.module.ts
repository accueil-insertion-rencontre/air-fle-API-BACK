import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { LearnerHistoryService } from './learner-history.service';
import { LearnerHistoryController } from './learner-history.controller';

@Module({
  imports: [PrismaModule],
  controllers: [LearnerHistoryController],
  providers: [LearnerHistoryService],
  exports: [LearnerHistoryService], // Export pour utilisation dans d'autres modules
})
export class LearnerHistoryModule {}
