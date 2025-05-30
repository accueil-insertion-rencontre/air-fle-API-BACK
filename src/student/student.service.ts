import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LearnerHistoryService } from '../learner-history/learner-history.service';
import { PrismaClient } from '@prisma/client';

// Type par défaut pour corriger les problèmes de linter
type Student = any;

@Injectable()
export class StudentService {
  constructor(
    private prisma: PrismaService,
    private learnerHistoryService: LearnerHistoryService
  ) {}

  async create(data: any, createdByUserId?: string): Promise<Student> {
    const student = await this.prisma.student.create({
      data,
      include: {
        gender: true,
        currentLevel: true,
        initialLevel: true,
        nationality: true,
        status: true,
        financing: true,
        orientation: true,
      },
    });

    // Enregistrer la création dans l'historique
    await this.learnerHistoryService.recordChange({
      studentId: student.id,
      entityType: 'student',
      actionType: 'created',
      changeType: 'student_created',
      description: `Étudiant créé: ${student.firstname} ${student.lastname}`,
      newData: {
        firstname: student.firstname,
        lastname: student.lastname,
        birthdate: student.birthdate,
        initial_level: student.initialLevel,
        status: student.status,
        nationality: student.nationality,
      },
      changedByUserId: createdByUserId,
    });

    return student;
  }

  async findAll(params?: {
    skip?: number;
    take?: number;
    where?: any;
    orderBy?: any;
  }): Promise<Student[]> {
    const { skip, take, where, orderBy } = params || {};
    return this.prisma.student.findMany({
      skip,
      take,
      where,
      orderBy,
      include: {
        gender: true,
        currentLevel: true,
        initialLevel: true,
        nationality: true,
        addresses: true,
        orientation: true,
        disabilities: {
          include: {
            disability: true
          }
        },
      },
    });
  }

  async findOne(
    studentWhereUniqueInput: any,
  ): Promise<Student | null> {
    return this.prisma.student.findUnique({
      where: studentWhereUniqueInput,
      include: {
        gender: true,
        currentLevel: true,
        initialLevel: true,
        nationality: true,
        addresses: true,
        orientation: true,
        disabilities: {
          include: {
            disability: true
          }
        },
      },
    });
  }

  async update(params: {
    where: any;
    data: any;
  }, updatedByUserId?: string): Promise<Student> {
    const { where, data } = params;
    
    // Récupérer l'état actuel avant modification
    const currentStudent = await this.prisma.student.findUnique({
      where,
      include: {
        gender: true,
        currentLevel: true,
        initialLevel: true,
        nationality: true,
        status: true,
        financing: true,
        orientation: true,
      },
    });

    if (!currentStudent) {
      throw new Error('Étudiant non trouvé');
    }

    // Effectuer la mise à jour
    const updatedStudent = await this.prisma.student.update({
      data,
      where,
      include: {
        gender: true,
        currentLevel: true,
        initialLevel: true,
        nationality: true,
        status: true,
        financing: true,
        orientation: true,
      },
    });

    // Enregistrer les changements dans l'historique
    await this.trackChanges(currentStudent, updatedStudent, data, updatedByUserId);

    return updatedStudent;
  }

  private async trackChanges(
    previous: any,
    updated: any,
    updateData: any,
    updatedByUserId?: string
  ): Promise<void> {
    // Vérifier changement de niveau actuel
    if (updateData.current_level_id && previous.current_level_id !== updated.current_level_id) {
      await this.learnerHistoryService.recordStudentChange(
        updated.id,
        'level_change',
        `Niveau modifié de ${previous.currentLevel?.code || 'Non défini'} vers ${updated.currentLevel?.code || 'Non défini'}`,
        previous.currentLevel,
        updated.currentLevel,
        updatedByUserId
      );
    }

    // Vérifier changement de statut
    if (updateData.status_id && previous.status_id !== updated.status_id) {
      await this.learnerHistoryService.recordStudentChange(
        updated.id,
        'status_change',
        `Statut modifié de "${previous.status?.label || 'Non défini'}" vers "${updated.status?.label || 'Non défini'}"`,
        previous.status,
        updated.status,
        updatedByUserId
      );
    }

    // Vérifier changement d'informations personnelles
    const personalInfoChanged = 
      updateData.firstname || 
      updateData.lastname || 
      updateData.email || 
      updateData.phone || 
      updateData.birthdate;

    if (personalInfoChanged) {
      const changedFields = {};
      const previousFields = {};
      
      if (updateData.firstname) {
        changedFields['firstname'] = updated.firstname;
        previousFields['firstname'] = previous.firstname;
      }
      if (updateData.lastname) {
        changedFields['lastname'] = updated.lastname;
        previousFields['lastname'] = previous.lastname;
      }
      if (updateData.email) {
        changedFields['email'] = updated.email;
        previousFields['email'] = previous.email;
      }
      if (updateData.phone) {
        changedFields['phone'] = updated.phone;
        previousFields['phone'] = previous.phone;
      }

      await this.learnerHistoryService.recordStudentChange(
        updated.id,
        'personal_info_update',
        `Informations personnelles modifiées`,
        previousFields,
        changedFields,
        updatedByUserId
      );
    }

    // Vérifier changement d'orientation
    if (updateData.orientation_id && previous.orientation_id !== updated.orientation_id) {
      await this.learnerHistoryService.recordStudentChange(
        updated.id,
        'orientation_change',
        `Orientation modifiée de "${previous.orientation?.type || 'Aucune'}" vers "${updated.orientation?.type || 'Aucune'}"`,
        previous.orientation,
        updated.orientation,
        updatedByUserId
      );
    }
  }

  async remove(where: any, deletedByUserId?: string): Promise<Student> {
    const student = await this.findOne(where);
    
    if (student) {
      // Enregistrer la suppression dans l'historique avant de supprimer
      await this.learnerHistoryService.recordChange({
        studentId: student.id,
        entityType: 'student',
        actionType: 'deleted',
        changeType: 'student_deleted',
        description: `Étudiant supprimé: ${student.firstname} ${student.lastname}`,
        previousData: {
          firstname: student.firstname,
          lastname: student.lastname,
          email: student.email,
        },
        changedByUserId: deletedByUserId,
      });
    }

    return this.prisma.student.delete({
      where,
    });
  }

  async updateStudentDisabilities(
    studentId: string, 
    disabilityIds: string[], 
    updatedByUserId?: string
  ): Promise<void> {
    // Récupérer les handicaps actuels
    const currentDisabilities = await this.prisma.studentDisability.findMany({
      where: { student_id: studentId },
      include: { disability: true },
    });

    await this.prisma.studentDisability.deleteMany({
      where: {
        student_id: studentId
      }
    });

    if (disabilityIds.length > 0) {
      await this.prisma.student.update({
        where: {
          id: studentId
        },
        data: {
          disabilities: {
            create: disabilityIds.map(disabilityId => ({
              disability: {
                connect: { id: disabilityId }
              }
            }))
          }
        }
      });
    }

    // Récupérer les nouveaux handicaps
    const newDisabilities = await this.prisma.studentDisability.findMany({
      where: { student_id: studentId },
      include: { disability: true },
    });

    // Enregistrer le changement dans l'historique
    await this.learnerHistoryService.recordChange({
      studentId,
      entityType: 'disability',
      actionType: 'updated',
      changeType: 'disability_updated',
      description: `Handicaps mis à jour`,
      previousData: currentDisabilities.map(d => d.disability),
      newData: newDisabilities.map(d => d.disability),
      changedByUserId: updatedByUserId,
    });
  }
}
