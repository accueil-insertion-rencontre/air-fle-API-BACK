import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Continuation, Prisma } from '@prisma/client';

@Injectable()
export class ContinuationService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Continuation[]> {
    return this.prisma.continuation.findMany({
      include: {
        student: true
      }
    });
  }

  async findOne(id: string): Promise<Continuation | null> {
    return this.prisma.continuation.findUnique({
      where: { id },
      include: {
        student: true
      }
    });
  }

  async findByStudent(studentId: string): Promise<Continuation | null> {
    return this.prisma.continuation.findUnique({
      where: { student_id: studentId },
      include: {
        student: true
      }
    });
  }

  async create(data: Prisma.ContinuationCreateInput): Promise<Continuation> {
    return this.prisma.continuation.create({
      data,
      include: {
        student: true
      }
    });
  }

  async update(id: string, data: Prisma.ContinuationUpdateInput): Promise<Continuation> {
    return this.prisma.continuation.update({
      where: { id },
      data,
      include: {
        student: true
      }
    });
  }

  async delete(id: string): Promise<Continuation> {
    return this.prisma.continuation.delete({
      where: { id },
    });
  }
} 