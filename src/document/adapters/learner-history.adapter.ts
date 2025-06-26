import { Injectable } from '@nestjs/common';
import { LearnerHistoryService } from '../../learner-history/learner-history.service';
import { ILearnerHistoryProvider, AttendanceRecord } from '../interfaces/document-generator.interface';

@Injectable()
export class LearnerHistoryAdapter implements ILearnerHistoryProvider {
  constructor(private readonly learnerHistoryService: LearnerHistoryService) {}

  async getAttendanceHistory(uuid: string): Promise<AttendanceRecord[]> {
    const result = await this.learnerHistoryService.getLearnerHistory(uuid);
    
    return result.history.map(historyItem => ({
      learner_history_date: historyItem.date,
      status: {
        status_name: historyItem.action_type || 'Present'
      }
    }));
  }
} 