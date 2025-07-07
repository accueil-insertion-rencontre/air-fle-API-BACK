import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Exam } from '@prisma/client';
import { LearnerHistoryService } from '../learner-history/learner-history.service';

// Type pour un examen avec ses relations
type ExamWithRelations = Prisma.ExamGetPayload<{
  include: {
    student: true;
  };
}>;

@Injectable()
export class ExamService {
  constructor(
    private prisma: PrismaService,
    private learnerHistoryService: LearnerHistoryService,
  ) {}

  async findOne(id: string): Promise<ExamWithRelations | null> {
    return this.prisma.exam.findUnique({
      where: { exam_uuid: id },
      include: {
        student: true,
      },
    });
  }

  async findAll(params?: {
    skip?: number;
    take?: number;
    where?: Prisma.ExamWhereInput;
    orderBy?: Prisma.ExamOrderByWithRelationInput;
  }): Promise<{
    data: ExamWithRelations[];
    meta: { total: number; skip: number; take: number };
  }> {
    const { skip, take, where, orderBy } = params || {};

    const [exams, total] = await Promise.all([
      this.prisma.exam.findMany({
        skip,
        take,
        where,
        orderBy,
        include: {
          student: true,
        },
      }),
      this.prisma.exam.count({ where }),
    ]);

    return {
      data: exams,
      meta: {
        total,
        skip: skip || 0,
        take: take || total,
      },
    };
  }

  async create(
    createExamData: Prisma.ExamCreateInput,
  ): Promise<ExamWithRelations> {
    const exam = await this.prisma.exam.create({
      data: createExamData,
      include: {
        student: true,
      },
    });

    // Enregistrer dans l'historique
    await this.learnerHistoryService.recordChange({
      studentId: exam.student_uuid,
      entityType: 'exam',
      entityId: exam.exam_uuid,
      actionType: 'created',
      changeType: 'exam_creation',
      description: `Nouvel examen créé: ${exam.exam_label}`,
      newData: {
        label: exam.exam_label,
        date: exam.exam_taked_at,
        score: exam.exam_score,
      },
    });

    return exam;
  }

  async update(
    id: string,
    updateExamData: Prisma.ExamUpdateInput,
  ): Promise<ExamWithRelations> {
    // Récupérer l'examen avant modification pour l'historique
    const currentExam = await this.findOne(id);
    if (!currentExam) {
      throw new NotFoundException(`Examen avec l'ID ${id} non trouvé`);
    }

    const exam = await this.prisma.exam.update({
      where: { exam_uuid: id },
      data: updateExamData,
      include: {
        student: true,
      },
    });

    // Enregistrer dans l'historique
    await this.learnerHistoryService.recordChange({
      studentId: exam.student_uuid,
      entityType: 'exam',
      entityId: exam.exam_uuid,
      actionType: 'updated',
      changeType: 'exam_modification',
      description: `Examen modifié: ${exam.exam_label}`,
      previousData: {
        label: currentExam.exam_label,
        date: currentExam.exam_taked_at,
        score: currentExam.exam_score,
      },
      newData: {
        label: exam.exam_label,
        date: exam.exam_taked_at,
        score: exam.exam_score,
      },
    });

    return exam;
  }

  async delete(id: string): Promise<ExamWithRelations> {
    const exam = await this.findOne(id);
    if (!exam) {
      throw new NotFoundException(`Examen avec l'ID ${id} non trouvé`);
    }

    const deletedExam = await this.prisma.exam.delete({
      where: { exam_uuid: id },
      include: {
        student: true,
      },
    });

    // Enregistrer dans l'historique
    await this.learnerHistoryService.recordChange({
      studentId: deletedExam.student_uuid,
      entityType: 'exam',
      entityId: deletedExam.exam_uuid,
      actionType: 'deleted',
      changeType: 'exam_deletion',
      description: `Examen supprimé: ${deletedExam.exam_label}`,
      previousData: {
        label: deletedExam.exam_label,
        date: deletedExam.exam_taked_at,
        score: deletedExam.exam_score,
      },
    });

    return deletedExam;
  }
}
