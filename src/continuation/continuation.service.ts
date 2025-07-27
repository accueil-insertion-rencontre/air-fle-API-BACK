import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Continuation } from '@prisma/client';
import { LearnerHistoryService } from '../learner-history/learner-history.service';
import { ContinuationStatsDto } from './dto/continuation-stats.dto';

// Type pour une continuation avec ses relations
type ContinuationWithRelations = Prisma.ContinuationGetPayload<{
  include: {
    student: true;
  };
}>;

// Interface pour les filtres
interface ContinuationFilters {
  student_uuid?: string;
  student_name?: string;
  date_from?: string;
  date_to?: string;
}

@Injectable()
export class ContinuationService {
  constructor(
    private prisma: PrismaService,
    private learnerHistoryService: LearnerHistoryService,
  ) {}

  async findAllWithFilters(filters: ContinuationFilters): Promise<ContinuationWithRelations[]> {
    const where: any = {};

    // Filtre par UUID d'étudiant
    if (filters.student_uuid) {
      where.student_uuid = filters.student_uuid;
    }

    // Filtre par nom d'étudiant (recherche insensible à la casse)
    if (filters.student_name) {
      where.student = {
        OR: [
          {
            student_firstname: {
              contains: filters.student_name,
              mode: 'insensitive',
            },
          },
          {
            student_lastname: {
              contains: filters.student_name,
              mode: 'insensitive',
            },
          },
        ],
      };
    }

    // Note: les filtres date_from et date_to ne s'appliquent plus à continuation_temporality
    // puisque c'est maintenant un string de temporalité ("3 mois", "6 mois", etc.)

    return this.prisma.continuation.findMany({
      where,
      include: {
        student: true,
      },
      orderBy: {
        continuation_temporality: 'desc',
      },
    });
  }

  async getStats(): Promise<ContinuationStatsDto> {
    // Nombre total de continuations
    const totalContinuations = await this.prisma.continuation.count();

    // Continuations avec temporalité définie
    const continuationsWithTemporality = await this.prisma.continuation.count({
      where: {
        continuation_temporality: {
          not: null,
        },
      },
    });

    const continuationsWithoutTemporality = totalContinuations - continuationsWithTemporality;

    // Note: "recent_continuations" ne s'applique plus puisque continuation_temporality 
    // est maintenant un string ("3 mois", "6 mois") et non une date
    // On peut compter les continuations par type de temporalité
    const shortTermContinuations = await this.prisma.continuation.count({
      where: {
        continuation_temporality: {
          in: ['3 mois', '6 mois'],
        },
      },
    });

    return {
      total_continuations: totalContinuations,
      continuations_with_date: continuationsWithTemporality,
      continuations_without_date: continuationsWithoutTemporality,
      recent_continuations: shortTermContinuations, // Réinterprété comme "continuations court terme"
    };
  }

  async findAll(studentId: string): Promise<ContinuationWithRelations[]> {
    return this.prisma.continuation.findMany({
      where: { student_uuid: studentId },
      include: {
        student: true,
      },
      orderBy: {
        continuation_temporality: 'desc',
      },
    });
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
