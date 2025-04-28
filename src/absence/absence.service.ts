import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AbsenceService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.AbsenceCreateInput) {
    return this.prisma.absence.create({
      data,
      include: {
        student: true,
        course: true,
      },
    });
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
      where: { id },
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

  async update(id: string, data: Prisma.AbsenceUpdateInput) {
    try {
      return await this.prisma.absence.update({
        where: { id },
        data,
        include: {
          student: true,
          course: true,
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Absence with ID ${id} not found`);
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.absence.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Absence with ID ${id} not found`);
      }
      throw error;
    }
  }
}
