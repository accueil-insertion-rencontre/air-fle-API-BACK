import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LearnerHistoryService } from '../learner-history/learner-history.service';
import { Exam, Prisma } from '@prisma/client';

@Injectable()
export class ExamService {
  constructor(
    private prisma: PrismaService,
    private learnerHistoryService: LearnerHistoryService
  ) {}

  async findAll(): Promise<Exam[]> {
    return this.prisma.exam.findMany({
      include: {
        student: true
      }
    });
  }

  async findOne(id: string): Promise<Exam | null> {
    return this.prisma.exam.findUnique({
      where: { id },
      include: {
        student: true
      }
    });
  }

  async create(data: Prisma.ExamCreateInput, createdByUserId?: string): Promise<Exam> {
    const exam = await this.prisma.exam.create({
      data,
      include: {
        student: true
      }
    });

    // Enregistrer l'examen dans l'historique de l'étudiant
    if (exam.student_id) {
      await this.learnerHistoryService.recordExamChange(
        exam.student_id,
        exam.id,
        'created',
        {
          id: exam.id,
          label: exam.label,
          note: exam.note,
          taked_at: exam.taked_at,
        },
        undefined,
        createdByUserId
      );
    }

    return exam;
  }

  async update(id: string, data: Prisma.ExamUpdateInput, updatedByUserId?: string): Promise<Exam> {
    // Récupérer l'examen actuel pour comparaison
    const currentExam = await this.findOne(id);
    
    const updatedExam = await this.prisma.exam.update({
      where: { id },
      data,
      include: {
        student: true
      }
    });

    // Enregistrer la modification dans l'historique si les données importantes ont changé
    if (currentExam && (
      currentExam.note !== updatedExam.note || 
      currentExam.label !== updatedExam.label ||
      currentExam.taked_at.getTime() !== updatedExam.taked_at.getTime()
    )) {
      await this.learnerHistoryService.recordExamChange(
        updatedExam.student_id,
        updatedExam.id,
        'updated',
        {
          label: updatedExam.label,
          note: updatedExam.note,
          taked_at: updatedExam.taked_at,
        },
        {
          label: currentExam.label,
          note: currentExam.note,
          taked_at: currentExam.taked_at,
        },
        updatedByUserId
      );
    }

    return updatedExam;
  }

  async delete(id: string, deletedByUserId?: string): Promise<Exam> {
    const exam = await this.findOne(id);
    
    if (exam) {
      // Enregistrer la suppression dans l'historique
      await this.learnerHistoryService.recordExamChange(
        exam.student_id,
        exam.id,
        'deleted',
        {
          label: exam.label,
          note: exam.note,
          taked_at: exam.taked_at,
        },
        undefined,
        deletedByUserId
      );
    }

    return this.prisma.exam.delete({
      where: { id },
    });
  }
} 