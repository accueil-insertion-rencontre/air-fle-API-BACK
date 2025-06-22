import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LearnerHistory, Prisma } from '@prisma/client';

export interface LearnerHistoryChange {
  studentId: string;
  entityType: string;
  entityId?: string;
  actionType: string;
  changeType: string;
  description: string;
  previousData?: any;
  newData?: any;
  changedByUserId?: string;
}

@Injectable()
export class LearnerHistoryService {
  constructor(private prisma: PrismaService) {}

  /**
   * Enregistre un changement dans l'historique d'un apprenant
   */
  async recordChange(change: LearnerHistoryChange): Promise<LearnerHistory> {
    return this.prisma.learnerHistory.create({
      data: {
        student_uuid: change.studentId,
        entity_type: change.entityType,
        entity_id: change.entityId || null,
        action_type: change.actionType,
        change_type: change.changeType || null,
        previous_data: change.previousData || null,
        new_data: change.newData || null,
        description: change.description,
        changed_by_user_uuid: change.changedByUserId || null,
      },
      include: {
        student: {
          select: {
            student_firstname: true,
            student_lastname: true,
          },
        },
        changed_by: {
          select: {
            user_firstname: true,
            user_lastname: true,
          },
        },
      },
    });
  }

  /**
   * Récupère l'historique complet d'un apprenant
   */
  async getLearnerHistory(
    studentId: string,
    options: {
      skip?: number;
      take?: number;
      entityType?: string;
      actionType?: string;
      changeType?: string;
      fromDate?: Date;
      toDate?: Date;
    } = {},
  ) {
    const where: Prisma.LearnerHistoryWhereInput = {
      student_uuid: studentId,
    };

    if (options.entityType) {
      where.entity_type = options.entityType;
    }

    if (options.actionType) {
      where.action_type = options.actionType;
    }

    if (options.changeType) {
      where.change_type = options.changeType;
    }

    if (options.fromDate || options.toDate) {
      where.changed_at = {};
      if (options.fromDate) {
        where.changed_at.gte = options.fromDate;
      }
      if (options.toDate) {
        where.changed_at.lte = options.toDate;
      }
    }

    const [history, total] = await Promise.all([
      this.prisma.learnerHistory.findMany({
        where,
        include: {
          changed_by: {
            select: {
              user_uuid: true,
              user_firstname: true,
              user_lastname: true,
            },
          },
        },
        orderBy: { changed_at: 'desc' },
        skip: options.skip || 0,
        take: options.take || 50,
      }),
      this.prisma.learnerHistory.count({ where }),
    ]);

    return {
      history: history.map((change) => ({
        id: change.learner_history_uuid,
        entity_type: change.entity_type,
        entity_id: change.entity_id,
        action_type: change.action_type,
        change_type: change.change_type,
        description: change.description,
        previous_data: change.previous_data,
        new_data: change.new_data,
        date: change.changed_at,
        changedBy: change.changed_by
          ? {
              id: change.changed_by.user_uuid,
              firstname: change.changed_by.user_firstname,
              lastname: change.changed_by.user_lastname,
            }
          : null,
      })),
      pagination: {
        total,
        skip: options.skip || 0,
        take: options.take || 50,
      },
    };
  }

  /**
   * Récupère l'historique par type d'entité
   */
  async getHistoryByEntityType(
    studentId: string,
    entityType: string,
  ): Promise<any> {
    return this.getLearnerHistory(studentId, { entityType });
  }

  /**
   * Récupère la progression des niveaux
   */
  async getProgressionHistory(studentId: string) {
    const history = await this.prisma.learnerHistory.findMany({
      where: {
        student_uuid: studentId,
        entity_type: 'student',
        change_type: 'level_change',
      },
      orderBy: {
        changed_at: 'desc',
      },
      include: {
        changed_by: {
          select: {
            user_firstname: true,
            user_lastname: true,
          },
        },
      },
    });

    return history.map((change) => ({
      id: change.learner_history_uuid,
      description: change.description,
      previous_data: change.previous_data,
      new_data: change.new_data,
      date: change.changed_at,
      changedBy: change.changed_by
        ? {
            firstname: change.changed_by.user_firstname,
            lastname: change.changed_by.user_lastname,
          }
        : null,
    }));
  }

  /**
   * Récupère l'historique des examens
   */
  async getExamHistory(studentId: string): Promise<any> {
    const entityType = 'exam';

    const options = {
      skip: 0,
      take: 50,
      entityType,
    };

    return this.getLearnerHistory(studentId, options);
  }

  /**
   * Récupère l'historique des absences
   */
  async getAbsenceHistory(studentId: string): Promise<any> {
    const entityType = 'absence';

    const options = {
      skip: 0,
      take: 50,
      entityType,
    };

    return this.getLearnerHistory(studentId, options);
  }

  /**
   * Récupère l'historique des groupes
   */
  async getGroupHistory(studentId: string): Promise<any[]> {
    const groupHistory = await this.prisma.learnerHistory.findMany({
      where: {
        student_uuid: studentId,
        entity_type: 'group_assignment',
      },
      orderBy: {
        changed_at: 'desc',
      },
      include: {
        changed_by: {
          select: {
            user_firstname: true,
            user_lastname: true,
          },
        },
      },
    });

    return groupHistory.map((change) => ({
      date: change.changed_at,
      action: change.action_type,
      group: change.new_data,
      previousGroup: change.previous_data,
      description: change.description,
      changedBy: change.changed_by,
    }));
  }

  /**
   * Récupère l'historique des adresses
   */
  async getAddressHistory(studentId: string): Promise<any[]> {
    const addressHistory = await this.prisma.learnerHistory.findMany({
      where: {
        student_uuid: studentId,
        entity_type: 'address',
      },
      orderBy: {
        changed_at: 'desc',
      },
      include: {
        changed_by: {
          select: {
            user_firstname: true,
            user_lastname: true,
          },
        },
      },
    });

    return addressHistory.map((change) => ({
      date: change.changed_at,
      action: change.action_type,
      address: change.new_data,
      previousAddress: change.previous_data,
      description: change.description,
      changedBy: change.changed_by,
    }));
  }

  /**
   * Récupère l'historique des handicaps
   */
  async getDisabilityHistory(studentId: string): Promise<any[]> {
    const disabilityHistory = await this.prisma.learnerHistory.findMany({
      where: {
        student_uuid: studentId,
        entity_type: 'disability',
      },
      orderBy: {
        changed_at: 'desc',
      },
      include: {
        changed_by: {
          select: {
            user_firstname: true,
            user_lastname: true,
          },
        },
      },
    });

    return disabilityHistory.map((change) => ({
      date: change.changed_at,
      action: change.action_type,
      disabilities: change.new_data,
      previousDisabilities: change.previous_data,
      description: change.description,
      changedBy: change.changed_by,
    }));
  }

  /**
   * Récupère les statistiques d'activité
   */
  async getActivityStats(studentId: string) {
    const [totalHistory, examHistory, absenceHistory, allHistory] =
      await Promise.all([
        this.prisma.learnerHistory.count({
          where: { student_uuid: studentId },
        }),
        this.prisma.learnerHistory.count({
          where: { student_uuid: studentId, entity_type: 'exam' },
        }),
        this.prisma.learnerHistory.count({
          where: { student_uuid: studentId, entity_type: 'absence' },
        }),
        this.prisma.learnerHistory.findMany({
          where: { student_uuid: studentId },
          orderBy: { changed_at: 'desc' },
          take: 1,
        }),
      ]);

    return {
      totalHistory,
      examHistory,
      absenceHistory,
      lastChange: allHistory.length > 0 ? allHistory[0].changed_at : null,
      lastActivity:
        allHistory.length > 0
          ? {
              description: allHistory[0].description,
              entity_type: allHistory[0].entity_type,
              action_type: allHistory[0].action_type,
              date: allHistory[0].changed_at,
            }
          : null,
    };
  }

  /**
   * Supprime l'historique d'un apprenant (GDPR compliance)
   */
  async deleteLearnerHistory(studentId: string): Promise<void> {
    await this.prisma.learnerHistory.deleteMany({
      where: {
        student_uuid: studentId,
      },
    });
  }

  // =============== MÉTHODES UTILITAIRES POUR CHAQUE ENTITÉ ===============

  /**
   * Enregistre un changement sur l'étudiant
   */
  async recordStudentChange(
    studentId: string,
    changeType: string,
    description: string,
    previousData?: any,
    newData?: any,
    changedByUserId?: string,
  ): Promise<LearnerHistory> {
    return this.recordChange({
      studentId,
      entityType: 'student',
      actionType: 'updated',
      changeType,
      description,
      previousData,
      newData,
      changedByUserId,
    });
  }

  /**
   * Enregistre un changement d'examen
   */
  async recordExamChange(
    studentId: string,
    examId: string,
    actionType: 'created' | 'updated' | 'deleted',
    examData: any,
    previousData?: any,
    changedByUserId?: string,
  ): Promise<LearnerHistory> {
    const descriptions = {
      created: `Examen créé: ${examData.label}`,
      updated: `Examen modifié: ${examData.label}`,
      deleted: `Examen supprimé: ${examData.label}`,
    };

    return this.recordChange({
      studentId,
      entityType: 'exam',
      entityId: examId,
      actionType,
      changeType: `exam_${actionType}`,
      description: descriptions[actionType],
      previousData,
      newData: examData,
      changedByUserId,
    });
  }

  /**
   * Enregistre un changement d'absence
   */
  async recordAbsenceChange(
    studentId: string,
    absenceId: string,
    actionType: 'created' | 'updated' | 'deleted',
    absenceData: any,
    previousData?: any,
    changedByUserId?: string,
  ): Promise<LearnerHistory> {
    const descriptions = {
      created: `Absence enregistrée${absenceData.reason ? `: ${absenceData.reason}` : ''}`,
      updated: `Absence modifiée`,
      deleted: `Absence supprimée`,
    };

    return this.recordChange({
      studentId,
      entityType: 'absence',
      entityId: absenceId,
      actionType,
      changeType: `absence_${actionType}`,
      description: descriptions[actionType],
      previousData,
      newData: absenceData,
      changedByUserId,
    });
  }

  /**
   * Enregistre un changement de groupe
   */
  async recordGroupAssignmentChange(
    studentId: string,
    groupId: string,
    actionType: 'assigned' | 'unassigned',
    groupData: any,
    changedByUserId?: string,
  ): Promise<LearnerHistory> {
    const descriptions = {
      assigned: `Assigné au groupe: ${groupData.label}`,
      unassigned: `Retiré du groupe: ${groupData.label}`,
    };

    return this.recordChange({
      studentId,
      entityType: 'group_assignment',
      entityId: groupId,
      actionType,
      changeType: `group_${actionType}`,
      description: descriptions[actionType],
      newData: groupData,
      changedByUserId,
    });
  }

  /**
   * Enregistre un changement d'adresse
   */
  async recordAddressChange(
    studentId: string,
    addressId: string,
    actionType: 'assigned' | 'unassigned' | 'updated',
    addressData: any,
    previousData?: any,
    changedByUserId?: string,
  ): Promise<LearnerHistory> {
    const descriptions = {
      assigned: `Adresse ajoutée: ${addressData.street}, ${addressData.city}`,
      unassigned: `Adresse supprimée`,
      updated: `Adresse modifiée`,
    };

    return this.recordChange({
      studentId,
      entityType: 'address',
      entityId: addressId,
      actionType,
      changeType: `address_${actionType}`,
      description: descriptions[actionType],
      previousData,
      newData: addressData,
      changedByUserId,
    });
  }

  /**
   * Enregistre un changement de continuation
   */
  async recordContinuationChange(
    studentId: string,
    continuationId: string,
    actionType: 'created' | 'updated' | 'deleted',
    continuationData: any,
    previousData?: any,
    changedByUserId?: string,
  ): Promise<LearnerHistory> {
    const descriptions = {
      created: `Continuation ajoutée`,
      updated: `Continuation modifiée`,
      deleted: `Continuation supprimée`,
    };

    return this.recordChange({
      studentId,
      entityType: 'continuation',
      entityId: continuationId,
      actionType,
      changeType: `continuation_${actionType}`,
      description: descriptions[actionType],
      previousData,
      newData: continuationData,
      changedByUserId,
    });
  }

  async getRecentActivity(studentId: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return this.prisma.learnerHistory.findMany({
      where: {
        student_uuid: studentId,
      },
      orderBy: { changed_at: 'desc' },
      take: 20,
    });
  }

  /**
   * Récupère l'historique des assignations de groupe
   */
  async getGroupAssignmentHistory(studentId: string): Promise<any[]> {
    const groupHistory = await this.prisma.learnerHistory.findMany({
      where: {
        student_uuid: studentId,
        entity_type: 'group_assignment',
      },
      orderBy: {
        changed_at: 'desc',
      },
      include: {
        changed_by: {
          select: {
            user_firstname: true,
            user_lastname: true,
          },
        },
      },
    });

    return groupHistory.map((change) => ({
      date: change.changed_at,
      action: change.action_type,
      group: change.new_data,
      previousGroup: change.previous_data,
      description: change.description,
      changedBy: change.changed_by,
    }));
  }

  /**
   * Récupère l'historique des changements de niveau
   */
  async getLevelChangeHistory(studentId: string): Promise<any[]> {
    const levelHistory = await this.prisma.learnerHistory.findMany({
      where: {
        student_uuid: studentId,
        entity_type: 'level_change',
      },
      orderBy: {
        changed_at: 'desc',
      },
      include: {
        changed_by: {
          select: {
            user_firstname: true,
            user_lastname: true,
          },
        },
      },
    });

    return levelHistory.map((change) => ({
      date: change.changed_at,
      action: change.action_type,
      level: change.new_data,
      previousLevel: change.previous_data,
      description: change.description,
      changedBy: change.changed_by,
    }));
  }

  /**
   * Récupère l'historique des changements de statut
   */
  async getStatusChangeHistory(studentId: string): Promise<any[]> {
    const statusHistory = await this.prisma.learnerHistory.findMany({
      where: {
        student_uuid: studentId,
        entity_type: 'status_change',
      },
      orderBy: {
        changed_at: 'desc',
      },
      include: {
        changed_by: {
          select: {
            user_firstname: true,
            user_lastname: true,
          },
        },
      },
    });

    return statusHistory.map((change) => ({
      date: change.changed_at,
      action: change.action_type,
      status: change.new_data,
      previousStatus: change.previous_data,
      description: change.description,
      changedBy: change.changed_by,
    }));
  }
}
