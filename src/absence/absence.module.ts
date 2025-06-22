import { Module } from '@nestjs/common';
import { AbsenceController } from './absence.controller';
import { AbsenceService } from './absence.service';
import { PrismaModule } from '../prisma/prisma.module';
import { LearnerHistoryModule } from '../learner-history/learner-history.module';

@Module({
  imports: [PrismaModule, LearnerHistoryModule],
  controllers: [AbsenceController],
  providers: [AbsenceService],
  exports: [AbsenceService],
})
export class AbsenceModule {}
