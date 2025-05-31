import { Module } from '@nestjs/common';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { PrismaModule } from '../prisma/prisma.module';
import { LearnerHistoryModule } from '../learner-history/learner-history.module';

@Module({
  imports: [PrismaModule, LearnerHistoryModule],
  controllers: [StudentController],
  providers: [StudentService],
  exports: [StudentService],
})
export class StudentModule {}
