import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class StudentRepository {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  // ===============================
  // OPÉRATIONS CRUD DE BASE
  // ===============================

  async create(data: Prisma.StudentCreateInput, include?: any) {
    return this.prisma.student.create({
      data,
      include,
    });
  }

  async findMany(params: {
    skip?: number;
    take?: number;
    where?: Prisma.StudentWhereInput;
    orderBy?: Prisma.StudentOrderByWithRelationInput;
    include?: any;
  }) {
    const { skip, take, where, orderBy, include } = params;
    return this.prisma.student.findMany({
      skip,
      take,
      where,
      orderBy,
      include,
    });
  }

  async findUnique(params: {
    where: Prisma.StudentWhereUniqueInput;
    include?: any;
  }) {
    const { where, include } = params;
    return this.prisma.student.findUnique({
      where,
      include,
    });
  }

  async update(params: {
    where: Prisma.StudentWhereUniqueInput;
    data: Prisma.StudentUpdateInput;
    include?: any;
  }) {
    const { where, data, include } = params;
    return this.prisma.student.update({
      where,
      data,
      include,
    });
  }

  async delete(where: Prisma.StudentWhereUniqueInput) {
    return this.prisma.student.delete({
      where,
    });
  }

  async count(where?: Prisma.StudentWhereInput) {
    return this.prisma.student.count({ where });
  }

  // ===============================
  // OPÉRATIONS SPÉCIALISÉES
  // ===============================

  async findStudentNationalities(studentId: string) {
    return this.prisma.studentNationality.findMany({
      where: { student_uuid: studentId },
      include: { nationality: true },
    });
  }

  async updateStudentNationalities(
    studentId: string,
    nationalityIds: string[],
  ) {
    // Supprimer les anciennes relations
    await this.prisma.studentNationality.deleteMany({
      where: { student_uuid: studentId },
    });

    // Créer les nouvelles relations
    if (nationalityIds.length > 0) {
      await this.prisma.studentNationality.createMany({
        data: nationalityIds.map((nationalityId) => ({
          student_uuid: studentId,
          nationality_uuid: nationalityId,
        })),
      });
    }
  }

  async findStudentDisabilities(studentId: string) {
    return this.prisma.studentDisability.findMany({
      where: { student_uuid: studentId },
      include: { disability: true },
    });
  }

  async updateStudentDisabilities(studentId: string, disabilityIds: string[]) {
    // Supprimer les anciennes relations
    await this.prisma.studentDisability.deleteMany({
      where: { student_uuid: studentId },
    });

    // Créer les nouvelles relations
    if (disabilityIds.length > 0) {
      await this.prisma.studentDisability.createMany({
        data: disabilityIds.map((disabilityId) => ({
          student_uuid: studentId,
          disability_uuid: disabilityId,
        })),
      });
    }
  }

  // ===============================
  // INCLUDES PRÉDÉFINIS
  // ===============================

  getStandardIncludes() {
    return {
      gender: true,
      frenchLevel: true,
      status: true,
      financing: true,
      orientation: true,
      exitReason: true,
      nationalities: {
        include: {
          nationality: true,
        },
      },
    };
  }

  getListIncludes() {
    return {
      gender: true,
      frenchLevel: true,
      status: true,
      nationalities: {
        include: {
          nationality: true,
        },
      },
    };
  }

  getDetailIncludes() {
    return {
      ...this.getStandardIncludes(),
      nationalities: {
        include: {
          nationality: true,
        },
      },
      addresses: {
        include: {
          address: true,
        },
      },
      groups: {
        include: {
          group: true,
        },
      },
      exit_levels: {
        include: {
          french_level: true,
        },
      },
    };
  }
}
