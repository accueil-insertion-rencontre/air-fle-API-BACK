import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { StudentModule } from '../student/student.module';
import { LearnerHistoryModule } from '../learner-history/learner-history.module';
import { StudentDataAdapter } from './adapters/student-data.adapter';
import { LearnerHistoryAdapter } from './adapters/learner-history.adapter';
import {
  STUDENT_DATA_PROVIDER,
  LEARNER_HISTORY_PROVIDER,
} from './interfaces/document-generator.interface';

@Module({
  imports: [StudentModule, LearnerHistoryModule, JwtModule],
  controllers: [DocumentController],
  providers: [
    DocumentService,
    {
      provide: STUDENT_DATA_PROVIDER,
      useClass: StudentDataAdapter,
    },
    {
      provide: LEARNER_HISTORY_PROVIDER,
      useClass: LearnerHistoryAdapter,
    },
  ],
  exports: [DocumentService],
})
export class DocumentModule {}
