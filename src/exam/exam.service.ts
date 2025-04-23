import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Exam, Prisma } from '@prisma/client';

@Injectable()
export class ExamService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Exam[]> {
    return this.prisma.exam.findMany({
      include: {
        student: true
      }
    });
  }

  async findOne(id: string): Promise<Exam | null> {
    return this.prisma.exam.findUnique({
      where: { id },
      include: {
        student: true
      }
    });
  }

  async create(data: Prisma.ExamCreateInput): Promise<Exam> {
    return this.prisma.exam.create({
      data,
      include: {
        student: true
      }
    });
  }

  async update(id: string, data: Prisma.ExamUpdateInput): Promise<Exam> {
    return this.prisma.exam.update({
      where: { id },
      data,
      include: {
        student: true
      }
    });
  }

  async delete(id: string): Promise<Exam> {
    return this.prisma.exam.delete({
      where: { id },
    });
  }
} 