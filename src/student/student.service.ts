import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClient } from '@prisma/client';

// Type par défaut pour corriger les problèmes de linter
type Student = any;

@Injectable()
export class StudentService {
  constructor(private prisma: PrismaService) {}

  async create(data: any): Promise<Student> {
    return this.prisma.student.create({
      data,
    });
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
  }): Promise<Student> {
    const { where, data } = params;
    return this.prisma.student.update({
      data,
      where,
    });
  }

  async remove(where: any): Promise<Student> {
    return this.prisma.student.delete({
      where,
    });
  }

  async updateStudentDisabilities(studentId: string, disabilityIds: string[]): Promise<void> {
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
  }
}
