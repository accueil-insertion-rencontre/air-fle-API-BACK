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
        student_id: change.studentId,
        entity_type: change.entityType,
        entity_id: change.entityId || null,
        action_type: change.actionType,
        change_type: change.changeType,
        description: change.description,
        previous_data: change.previousData || null,
        new_data: change.newData || null,
        changed_by_user_id: change.changedByUserId || null,
      },
      include: {
        student: {
          select: {
            firstname: true,
            lastname: true,
          }
        },
        changed_by: {
          select: {
            firstname: true,
            lastname: true,
          }
        }
      }
    });
  }

  /**
   * Récupère l'historique complet d'un apprenant
   */
  async getLearnerHistory(
    studentId: string,
    options?: {
      skip?: number;
      take?: number;
      entityType?: string;
      actionType?: string;
      changeType?: string;
      fromDate?: Date;
      toDate?: Date;
    }
  ): Promise<LearnerHistory[]> {
    const where: Prisma.LearnerHistoryWhereInput = {
      student_id: studentId,
    };

    if (options?.entityType) {
      where.entity_type = options.entityType;
    }

    if (options?.actionType) {
      where.action_type = options.actionType;
    }

    if (options?.changeType) {
      where.change_type = options.changeType;
    }

    if (options?.fromDate || options?.toDate) {
      where.change_date = {};
      if (options.fromDate) {
        where.change_date.gte = options.fromDate;
      }
      if (options.toDate) {
        where.change_date.lte = options.toDate;
      }
    }

    return this.prisma.learnerHistory.findMany({
      where,
      skip: options?.skip || 0,
      take: options?.take || 50,
      orderBy: {
        change_date: 'desc'
      },
      include: {
        student: {
          select: {
            firstname: true,
            lastname: true,
          }
        },
        changed_by: {
          select: {
            firstname: true,
            lastname: true,
          }
        }
      }
    });
  }

  /**
   * Récupère l'historique par type d'entité
   */
  async getHistoryByEntityType(
    studentId: string,
    entityType: string
  ): Promise<LearnerHistory[]> {
    return this.getLearnerHistory(studentId, { entityType });
  }

  /**
   * Récupère la progression des niveaux
   */
  async getLevelProgressHistory(studentId: string): Promise<any[]> {
    const levelChanges = await this.prisma.learnerHistory.findMany({
      where: {
        student_id: studentId,
        entity_type: 'student',
        change_type: 'level_change'
      },
      orderBy: {
        change_date: 'asc'
      },
      include: {
        changed_by: {
          select: {
            firstname: true,
            lastname: true,
          }
        }
      }
    });

    return levelChanges.map(change => ({
      date: change.change_date,
      level: change.new_data,
      previousLevel: change.previous_data,
      changedBy: change.changed_by,
      description: change.description
    }));
  }

  /**
   * Récupère l'historique des examens
   */
  async getExamHistory(studentId: string): Promise<any[]> {
    const examHistory = await this.prisma.learnerHistory.findMany({
      where: {
        student_id: studentId,
        entity_type: 'exam'
      },
      orderBy: {
        change_date: 'desc'
      },
      include: {
        changed_by: {
          select: {
            firstname: true,
            lastname: true,
          }
        }
      }
    });

    return examHistory.map(change => ({
      date: change.change_date,
      action: change.action_type,
      exam: change.new_data,
      previousExam: change.previous_data,
      description: change.description,
      changedBy: change.changed_by
    }));
  }

  /**
   * Récupère l'historique des absences
   */
  async getAbsenceHistory(studentId: string): Promise<any[]> {
    const absenceHistory = await this.prisma.learnerHistory.findMany({
      where: {
        student_id: studentId,
        entity_type: 'absence'
      },
      orderBy: {
        change_date: 'desc'
      },
      include: {
        changed_by: {
          select: {
            firstname: true,
            lastname: true,
          }
        }
      }
    });

    return absenceHistory.map(change => ({
      date: change.change_date,
      action: change.action_type,
      absence: change.new_data,
      description: change.description,
      changedBy: change.changed_by
    }));
  }

  /**
   * Récupère l'historique des groupes
   */
  async getGroupHistory(studentId: string): Promise<any[]> {
    const groupHistory = await this.prisma.learnerHistory.findMany({
      where: {
        student_id: studentId,
        entity_type: 'group_assignment'
      },
      orderBy: {
        change_date: 'desc'
      },
      include: {
        changed_by: {
          select: {
            firstname: true,
            lastname: true,
          }
        }
      }
    });

    return groupHistory.map(change => ({
      date: change.change_date,
      action: change.action_type,
      group: change.new_data,
      previousGroup: change.previous_data,
      description: change.description,
      changedBy: change.changed_by
    }));
  }

  /**
   * Récupère l'historique des adresses
   */
  async getAddressHistory(studentId: string): Promise<any[]> {
    const addressHistory = await this.prisma.learnerHistory.findMany({
      where: {
        student_id: studentId,
        entity_type: 'address'
      },
      orderBy: {
        change_date: 'desc'
      },
      include: {
        changed_by: {
          select: {
            firstname: true,
            lastname: true,
          }
        }
      }
    });

    return addressHistory.map(change => ({
      date: change.change_date,
      action: change.action_type,
      address: change.new_data,
      previousAddress: change.previous_data,
      description: change.description,
      changedBy: change.changed_by
    }));
  }

  /**
   * Récupère l'historique des handicaps
   */
  async getDisabilityHistory(studentId: string): Promise<any[]> {
    const disabilityHistory = await this.prisma.learnerHistory.findMany({
      where: {
        student_id: studentId,
        entity_type: 'disability'
      },
      orderBy: {
        change_date: 'desc'
      },
      include: {
        changed_by: {
          select: {
            firstname: true,
            lastname: true,
          }
        }
      }
    });

    return disabilityHistory.map(change => ({
      date: change.change_date,
      action: change.action_type,
      disabilities: change.new_data,
      previousDisabilities: change.previous_data,
      description: change.description,
      changedBy: change.changed_by
    }));
  }

  /**
   * Récupère les statistiques d'activité
   */
  async getActivityStats(studentId: string): Promise<any> {
    const allHistory = await this.getLearnerHistory(studentId, { take: 1000 });
    
    const statsByEntity = allHistory.reduce((acc, change) => {
      const key = change.entity_type;
      if (!acc[key]) {
        acc[key] = { total: 0, byAction: {} };
      }
      acc[key].total++;
      acc[key].byAction[change.action_type] = (acc[key].byAction[change.action_type] || 0) + 1;
      return acc;
    }, {} as Record<string, any>);

    const recentActivity = allHistory.slice(0, 10);
    
    return {
      totalChanges: allHistory.length,
      lastChange: allHistory.length > 0 ? allHistory[0].change_date : null,
      statsByEntity,
      recentActivity: recentActivity.map(change => ({
        entityType: change.entity_type,
        actionType: change.action_type,
        changeType: change.change_type,
        date: change.change_date,
        description: change.description
      }))
    };
  }

  /**
   * Supprime l'historique d'un apprenant (GDPR compliance)
   */
  async deleteLearnerHistory(studentId: string): Promise<void> {
    await this.prisma.learnerHistory.deleteMany({
      where: {
        student_id: studentId
      }
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
    changedByUserId?: string
  ): Promise<LearnerHistory> {
    return this.recordChange({
      studentId,
      entityType: 'student',
      actionType: 'updated',
      changeType,
      description,
      previousData,
      newData,
      changedByUserId
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
    changedByUserId?: string
  ): Promise<LearnerHistory> {
    const descriptions = {
      created: `Examen créé: ${examData.label}`,
      updated: `Examen modifié: ${examData.label}`,
      deleted: `Examen supprimé: ${examData.label}`
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
      changedByUserId
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
    changedByUserId?: string
  ): Promise<LearnerHistory> {
    const descriptions = {
      created: `Absence enregistrée${absenceData.reason ? `: ${absenceData.reason}` : ''}`,
      updated: `Absence modifiée`,
      deleted: `Absence supprimée`
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
      changedByUserId
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
    changedByUserId?: string
  ): Promise<LearnerHistory> {
    const descriptions = {
      assigned: `Assigné au groupe: ${groupData.label}`,
      unassigned: `Retiré du groupe: ${groupData.label}`
    };

    return this.recordChange({
      studentId,
      entityType: 'group_assignment',
      entityId: groupId,
      actionType,
      changeType: `group_${actionType}`,
      description: descriptions[actionType],
      newData: groupData,
      changedByUserId
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
    changedByUserId?: string
  ): Promise<LearnerHistory> {
    const descriptions = {
      assigned: `Adresse ajoutée: ${addressData.street}, ${addressData.city}`,
      unassigned: `Adresse supprimée`,
      updated: `Adresse modifiée`
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
      changedByUserId
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
    changedByUserId?: string
  ): Promise<LearnerHistory> {
    const descriptions = {
      created: `Continuation ajoutée`,
      updated: `Continuation modifiée`,
      deleted: `Continuation supprimée`
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
      changedByUserId
    });
  }
} 