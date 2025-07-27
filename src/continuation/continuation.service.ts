import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Continuation } from '@prisma/client';
import { LearnerHistoryService } from '../learner-history/learner-history.service';

// Type pour une continuation avec ses relations
type ContinuationWithRelations = Prisma.ContinuationGetPayload<{
  include: {
    student: true;
  };
}>;

@Injectable()
export class ContinuationService {
  constructor(
    private prisma: PrismaService,
    private learnerHistoryService: LearnerHistoryService,
  ) {}

  async findAll(studentId: string): Promise<ContinuationWithRelations[]> {
    return this.prisma.continuation.findMany({
      where: { student_uuid: studentId },
      include: {
        student: true,
      },
    });
  }

  async findAllGeneral(params?: {
    skip?: number;
    take?: number;
    where?: Prisma.ContinuationWhereInput;
    orderBy?: Prisma.ContinuationOrderByWithRelationInput;
  }): Promise<{
    data: any[];
    meta: { total: number; skip: number; take: number };
  }> {
    const { skip = 0, take = 10, where = {}, orderBy = { continuation_uuid: 'desc' } as Prisma.ContinuationOrderByWithRelationInput } = params || {};

    const [data, total] = await Promise.all([
      this.prisma.continuation.findMany({
        skip,
        take,
        where,
        orderBy,
        include: {
          student: true,
        },
      }),
      this.prisma.continuation.count({ where }),
    ]);

    return {
      data,
      meta: { total, skip, take },
    };
  }

  async findOne(id: string): Promise<ContinuationWithRelations | null> {
    return this.prisma.continuation.findUnique({
      where: { continuation_uuid: id },
      include: {
        student: true,
      },
    });
  }

  async create(
    createContinuationData: Prisma.ContinuationCreateInput,
  ): Promise<ContinuationWithRelations> {
    const continuation = await this.prisma.continuation.create({
      data: createContinuationData,
      include: {
        student: true,
      },
    });

    // Enregistrer dans l'historique
    await this.learnerHistoryService.recordChange({
      studentId: continuation.student_uuid,
      entityType: 'continuation',
      entityId: continuation.continuation_uuid,
      actionType: 'created',
      changeType: 'continuation_creation',
      description: `Nouvelle continuation créée`,
      newData: {
        temporality: continuation.continuation_temporality,
        commentary: continuation.continuation_commentary,
      },
    });

    return continuation;
  }

  async update(
    id: string,
    updateContinuationData: Prisma.ContinuationUpdateInput,
  ): Promise<ContinuationWithRelations> {
    // Récupérer la continuation avant modification pour l'historique
    const currentContinuation = await this.findOne(id);
    if (!currentContinuation) {
      throw new NotFoundException(`Continuation avec l'ID ${id} non trouvée`);
    }

    const continuation = await this.prisma.continuation.update({
      where: { continuation_uuid: id },
      data: updateContinuationData,
      include: {
        student: true,
      },
    });

    // Enregistrer dans l'historique
    await this.learnerHistoryService.recordChange({
      studentId: continuation.student_uuid,
      entityType: 'continuation',
      entityId: continuation.continuation_uuid,
      actionType: 'updated',
      changeType: 'continuation_modification',
      description: `Continuation modifiée`,
      previousData: {
        temporality: currentContinuation.continuation_temporality,
        commentary: currentContinuation.continuation_commentary,
      },
      newData: {
        temporality: continuation.continuation_temporality,
        commentary: continuation.continuation_commentary,
      },
    });

    return continuation;
  }

  async delete(id: string): Promise<ContinuationWithRelations> {
    const continuation = await this.findOne(id);
    if (!continuation) {
      throw new NotFoundException(`Continuation avec l'ID ${id} non trouvée`);
    }

    const deletedContinuation = await this.prisma.continuation.delete({
      where: { continuation_uuid: id },
      include: {
        student: true,
      },
    });

    // Enregistrer dans l'historique
    await this.learnerHistoryService.recordChange({
      studentId: deletedContinuation.student_uuid,
      entityType: 'continuation',
      entityId: deletedContinuation.continuation_uuid,
      actionType: 'deleted',
      changeType: 'continuation_deletion',
      description: `Continuation supprimée`,
      previousData: {
        temporality: deletedContinuation.continuation_temporality,
        commentary: deletedContinuation.continuation_commentary,
      },
    });

    return deletedContinuation;
  }
}
