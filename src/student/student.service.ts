import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { LearnerHistoryService } from '../learner-history/learner-history.service';
import { StudentRepository } from './student.repository';

// Type par défaut pour corriger les problèmes de linter
type Student = any;

@Injectable()
export class StudentService {
  constructor(
    private readonly studentRepository: StudentRepository,
    private readonly learnerHistoryService: LearnerHistoryService,
  ) {}

  async create(data: any, createdByUserId?: string): Promise<Student> {
    this.validateStudentData(data);

    const prismaData = this.transformDtoToPrismaCreateInput(data);

    const student = await this.studentRepository.create(
      prismaData,
      this.studentRepository.getStandardIncludes(),
    );

    await this.recordStudentCreation(student, createdByUserId);

    return student;
  }

  async findAll(params?: {
    skip?: number;
    take?: number;
    where?: any;
    orderBy?: any;
  }): Promise<Student[]> {
    const { skip, take, where, orderBy } = params || {};
    return this.studentRepository.findMany({
      skip,
      take,
      where,
      orderBy,
      include: this.studentRepository.getListIncludes(), // ✅ Includes spécialisés pour liste
    });
  }

  async findOne(studentWhereUniqueInput: any): Promise<Student | null> {
    return this.studentRepository.findUnique({
      where: studentWhereUniqueInput,
      include: this.studentRepository.getDetailIncludes(), // ✅ Includes spécialisés pour détail
    });
  }

  async update(
    params: {
      where: any;
      data: any;
    },
    updatedByUserId?: string,
  ): Promise<Student> {
    const { where, data } = params;

    // ✅ 1. Validation
    this.validateStudentData(data);

    // ✅ 2. Récupération état actuel
    const currentStudent = await this.studentRepository.findUnique({
      where,
      include: this.studentRepository.getStandardIncludes(),
    });

    if (!currentStudent) {
      throw new NotFoundException('Étudiant non trouvé');
    }

    // ✅ 3. Mise à jour
    const updatedStudent = await this.studentRepository.update({
      data,
      where,
      include: this.studentRepository.getStandardIncludes(),
    });

    // ✅ 4. Tracking des changements
    await this.trackStudentChanges(
      currentStudent,
      updatedStudent,
      data,
      updatedByUserId,
    );

    return updatedStudent;
  }

  async count(where?: any): Promise<number> {
    return this.studentRepository.count(where);
  }

  // ✅ Tracking des changements organisé
  private async trackStudentChanges(
    previous: any,
    updated: any,
    updateData: any,
    updatedByUserId?: string,
  ): Promise<void> {
    const changes: Promise<void>[] = [];

    // Changement de niveau
    if (
      updateData.french_level_uuid &&
      previous.french_level_uuid !== updated.french_level_uuid
    ) {
      changes.push(
        this.recordLevelChange(
          updated.student_uuid,
          previous.frenchLevel,
          updated.frenchLevel,
          updatedByUserId,
        ),
      );
    }

    // Changement de statut
    if (
      updateData.status_uuid &&
      previous.status_uuid !== updated.status_uuid
    ) {
      changes.push(
        this.recordStatusChange(
          updated.student_uuid,
          previous.status,
          updated.status,
          updatedByUserId,
        ),
      );
    }

    // Changements d'infos personnelles
    const personalChanges = this.detectPersonalInfoChanges(
      previous,
      updated,
      updateData,
    );
    if (personalChanges.length > 0) {
      changes.push(
        this.recordPersonalInfoChanges(
          updated.student_uuid,
          personalChanges,
          updatedByUserId,
        ),
      );
    }

    // Changement d'orientation
    if (
      updateData.orientation_uuid &&
      previous.orientation_uuid !== updated.orientation_uuid
    ) {
      changes.push(
        this.recordOrientationChange(
          updated.student_uuid,
          previous.orientation,
          updated.orientation,
          updatedByUserId,
        ),
      );
    }

    // Exécuter tous les changements en parallèle
    await Promise.all(changes);
  }

  private async recordLevelChange(
    studentId: string,
    previousLevel: any,
    newLevel: any,
    updatedByUserId?: string,
  ): Promise<void> {
    await this.learnerHistoryService.recordStudentChange(
      studentId,
      'level_change',
      `Niveau modifié de ${previousLevel?.code || 'Non défini'} vers ${newLevel?.code || 'Non défini'}`,
      previousLevel,
      newLevel,
      updatedByUserId,
    );
  }

  private async recordStatusChange(
    studentId: string,
    previousStatus: any,
    newStatus: any,
    updatedByUserId?: string,
  ): Promise<void> {
    await this.learnerHistoryService.recordStudentChange(
      studentId,
      'status_change',
      `Statut modifié de "${previousStatus?.label || 'Non défini'}" vers "${newStatus?.label || 'Non défini'}"`,
      previousStatus,
      newStatus,
      updatedByUserId,
    );
  }

  private async recordOrientationChange(
    studentId: string,
    previousOrientation: any,
    newOrientation: any,
    updatedByUserId?: string,
  ): Promise<void> {
    await this.learnerHistoryService.recordStudentChange(
      studentId,
      'orientation_change',
      `Orientation modifiée de "${previousOrientation?.type || 'Aucune'}" vers "${newOrientation?.type || 'Aucune'}"`,
      previousOrientation,
      newOrientation,
      updatedByUserId,
    );
  }

  private detectPersonalInfoChanges(
    previous: any,
    updated: any,
    updateData: any,
  ): { field: string; from: any; to: any }[] {
    const changes: { field: string; from: any; to: any }[] = [];

    if (
      updateData.student_firstname &&
      previous.student_firstname !== updated.student_firstname
    ) {
      changes.push({
        field: 'firstname',
        from: previous.student_firstname,
        to: updated.student_firstname,
      });
    }

    if (
      updateData.student_lastname &&
      previous.student_lastname !== updated.student_lastname
    ) {
      changes.push({
        field: 'lastname',
        from: previous.student_lastname,
        to: updated.student_lastname,
      });
    }

    if (
      updateData.student_mail &&
      previous.student_mail !== updated.student_mail
    ) {
      changes.push({
        field: 'email',
        from: previous.student_mail,
        to: updated.student_mail,
      });
    }

    if (
      updateData.student_phone &&
      previous.student_phone !== updated.student_phone
    ) {
      changes.push({
        field: 'phone',
        from: previous.student_phone,
        to: updated.student_phone,
      });
    }

    return changes;
  }

  private async recordPersonalInfoChanges(
    studentId: string,
    changes: any[],
    updatedByUserId?: string,
  ): Promise<void> {
    await this.learnerHistoryService.recordStudentChange(
      studentId,
      'personal_info_update',
      `Informations personnelles mises à jour: ${changes.map((c) => c.field).join(', ')}`,
      Object.fromEntries(changes.map((c) => [c.field, c.from])),
      Object.fromEntries(changes.map((c) => [c.field, c.to])),
      updatedByUserId,
    );
  }

  async remove(where: any, deletedByUserId?: string): Promise<Student> {
    const student = await this.findOne(where);
    if (!student) {
      throw new NotFoundException('Étudiant non trouvé');
    }

    // ✅ Historique délégué
    await this.recordStudentDeletion(student, deletedByUserId);

    return this.studentRepository.delete(where);
  }

  async updateStudentDisabilities(
    studentId: string,
    disabilityIds: string[],
    updatedByUserId?: string,
  ): Promise<void> {
    // Récupérer les handicaps actuels
    const currentDisabilities =
      await this.studentRepository.findStudentDisabilities(studentId);

    // ✅ Mise à jour via repository
    await this.studentRepository.updateStudentDisabilities(
      studentId,
      disabilityIds,
    );

    // ✅ Historique délégué
    await this.recordDisabilityChange(
      studentId,
      currentDisabilities.map((d) => d.disability),
      disabilityIds,
      updatedByUserId,
    );
  }

  // ===============================
  // ✅ MÉTHODES PRIVÉES ORGANISÉES
  // ===============================

  // ✅ Validation métier centralisée
  private validateStudentData(data: any): void {
    if (data.student_birthdate) {
      const age = this.calculateAge(new Date(data.student_birthdate));
      if (age < 16) {
        throw new BadRequestException("L'étudiant doit avoir au moins 16 ans");
      }
      if (age > 100) {
        throw new BadRequestException('Âge invalide');
      }
    }

    if (data.student_mail && !this.isValidEmail(data.student_mail)) {
      throw new BadRequestException('Format email invalide');
    }
  }

  // ✅ Enregistrement historique spécialisé
  private async recordStudentCreation(
    student: Student,
    createdByUserId?: string,
  ): Promise<void> {
    await this.learnerHistoryService.recordChange({
      studentId: student.student_uuid,
      entityType: 'student',
      actionType: 'created',
      changeType: 'student_created',
      description: `Étudiant créé: ${student.student_firstname} ${student.student_lastname}`,
      newData: this.extractStudentBasicData(student),
      changedByUserId: createdByUserId,
    });
  }

  private async recordStudentDeletion(
    student: Student,
    deletedByUserId?: string,
  ): Promise<void> {
    await this.learnerHistoryService.recordChange({
      studentId: student.student_uuid,
      entityType: 'student',
      actionType: 'deleted',
      changeType: 'student_deleted',
      description: `Étudiant supprimé: ${student.student_firstname} ${student.student_lastname}`,
      previousData: this.extractStudentBasicData(student),
      changedByUserId: deletedByUserId,
    });
  }

  private async recordDisabilityChange(
    studentId: string,
    previousDisabilities: any[],
    newDisabilityIds: string[],
    updatedByUserId?: string,
  ): Promise<void> {
    await this.learnerHistoryService.recordChange({
      studentId,
      entityType: 'student_disability',
      actionType: 'updated',
      changeType: 'disability_update',
      description: `Handicaps mis à jour`,
      previousData: previousDisabilities,
      newData: { disabilityIds: newDisabilityIds },
      changedByUserId: updatedByUserId,
    });
  }

  // ✅ Utilitaires
  private calculateAge(birthdate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthdate.getFullYear();
    const monthDiff = today.getMonth() - birthdate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthdate.getDate())
    ) {
      age--;
    }

    return age;
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  private extractStudentBasicData(student: Student) {
    return {
      firstname: student.student_firstname,
      lastname: student.student_lastname,
      birthdate: student.student_birthdate,
      email: student.student_mail,
      phone: student.student_phone,
    };
  }

  // ✅ Nouvelle méthode pour transformer le DTO en format Prisma
  private transformDtoToPrismaCreateInput(data: any): any {
    const prismaData: any = {
      // Champs directs
      student_firstname: data.student_firstname,
      student_lastname: data.student_lastname,
      student_birthdate: data.student_birthdate,
      student_place_of_birth: data.student_place_of_birth,
      student_mail: data.student_mail,
      student_phone: data.student_phone,
      student_date_test_initial: data.student_date_test_initial,
      student_date_entry_france: data.student_date_entry_france,
      student_commentary: data.student_commentary,
      student_created_at: data.student_created_at || new Date(),
      student_updated_at: data.student_updated_at || new Date(),
      student_date_cir: data.student_date_cir,
      student_date_residence_permit: data.student_date_residence_permit,

      // Relations obligatoires
      gender: { connect: { gender_uuid: data.gender_uuid } },
      frenchLevel: { connect: { french_level_uuid: data.french_level_uuid } },
      financing: { connect: { financing_uuid: data.financing_uuid } },
      status: { connect: { status_uuid: data.status_uuid } },
    };

    // Relations optionnelles
    if (data.orientation_uuid) {
      prismaData.orientation = {
        connect: { orientation_uuid: data.orientation_uuid },
      };
    }

    if (data.exit_reason_uuid) {
      prismaData.exitReason = {
        connect: { exit_reason_uuid: data.exit_reason_uuid },
      };
    }

    return prismaData;
  }
}
