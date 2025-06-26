import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LearnerHistoryService } from '../learner-history/learner-history.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AbsenceService {
  constructor(
    private prisma: PrismaService,
    private learnerHistoryService: LearnerHistoryService,
  ) {}

  async create(data: Prisma.AbsenceCreateInput, createdByUserId?: string) {
    const absence = await this.prisma.absence.create({
      data,
      include: {
        student: true,
        course: true,
      },
    });

    // Enregistrer l'absence dans l'historique
    await this.learnerHistoryService.recordAbsenceChange(
      absence.student_uuid,
      absence.absence_uuid,
      'created',
      {
        reason: absence.absence_reason,
        course: absence.course,
        date: new Date(),
      },
      undefined,
      createdByUserId,
    );

    return absence;
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.AbsenceWhereInput;
    orderBy?: Prisma.AbsenceOrderByWithRelationInput;
  }) {
    const { skip, take, where, orderBy } = params;
    const [absences, total] = await Promise.all([
      this.prisma.absence.findMany({
        skip,
        take,
        where,
        orderBy,
        include: {
          student: true,
          course: true,
        },
      }),
      this.prisma.absence.count({ where }),
    ]);

    return {
      data: absences,
      meta: {
        total,
        skip: skip || 0,
        take: take || total,
      },
    };
  }

  async findOne(id: string) {
    const absence = await this.prisma.absence.findUnique({
      where: { absence_uuid: id },
      include: {
        student: true,
        course: true,
      },
    });

    if (!absence) {
      throw new NotFoundException(`Absence with ID ${id} not found`);
    }

    return absence;
  }

  async update(
    id: string,
    data: Prisma.AbsenceUpdateInput,
    updatedByUserId?: string,
  ) {
    // Récupérer l'absence actuelle
    const currentAbsence = await this.findOne(id);

    try {
      const updatedAbsence = await this.prisma.absence.update({
        where: { absence_uuid: id },
        data,
        include: {
          student: true,
          course: true,
        },
      });

      // Enregistrer la modification dans l'historique
      await this.learnerHistoryService.recordAbsenceChange(
        updatedAbsence.student_uuid,
        updatedAbsence.absence_uuid,
        'updated',
        {
          reason: updatedAbsence.absence_reason,
          course: updatedAbsence.course,
        },
        {
          reason: currentAbsence.absence_reason,
          course: currentAbsence.course,
        },
        updatedByUserId,
      );

      return updatedAbsence;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Absence with ID ${id} not found`);
      }
      throw error;
    }
  }

  async remove(id: string, deletedByUserId?: string) {
    // Récupérer l'absence avant suppression
    const absence = await this.findOne(id);

    try {
      const deletedAbsence = await this.prisma.absence.delete({
        where: { absence_uuid: id },
      });

      // Enregistrer la suppression dans l'historique
      await this.learnerHistoryService.recordAbsenceChange(
        absence.student_uuid,
        absence.absence_uuid,
        'deleted',
        {
          reason: absence.absence_reason,
          course: absence.course,
        },
        undefined,
        deletedByUserId,
      );

      return deletedAbsence;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Absence with ID ${id} not found`);
      }
      throw error;
    }
  }
}
