import { Module } from '@nestjs/common';
import { ExamService } from './exam.service';
import { ExamController } from './exam.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { LearnerHistoryModule } from '../learner-history/learner-history.module';

@Module({
  imports: [PrismaModule, LearnerHistoryModule],
  controllers: [ExamController],
  providers: [ExamService],
  exports: [ExamService],
})
export class ExamModule {}
