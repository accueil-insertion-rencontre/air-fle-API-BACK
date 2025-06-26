export const STUDENT_DATA_PROVIDER = Symbol('IStudentDataProvider');
export const LEARNER_HISTORY_PROVIDER = Symbol('ILearnerHistoryProvider');

export interface IDocumentGenerator {
  generate(data: any): Promise<Buffer>;
}

export interface IStudentDataProvider {
  getBasicInfo(uuid: string): Promise<StudentBasicInfo>;
}

export interface ILearnerHistoryProvider {
  getAttendanceHistory(uuid: string): Promise<AttendanceRecord[]>;
}

export interface StudentBasicInfo {
  student_firstname: string;
  student_lastname: string;
  student_birthdate: Date;
  nationality?: {
    nationality_name: string;
  };
}

export interface AttendanceRecord {
  learner_history_date: Date;
  status?: {
    status_name: string;
  };
} 