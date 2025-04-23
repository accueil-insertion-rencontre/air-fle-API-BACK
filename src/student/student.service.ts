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
}
