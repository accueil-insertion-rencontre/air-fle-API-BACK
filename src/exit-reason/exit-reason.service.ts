import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ExitReason, Prisma } from '@prisma/client';

@Injectable()
export class ExitReasonService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<ExitReason[]> {
    return this.prisma.exitReason.findMany();
  }

  async findOne(id: string): Promise<ExitReason | null> {
    return this.prisma.exitReason.findUnique({
      where: { id },
    });
  }

  async create(data: Prisma.ExitReasonCreateInput): Promise<ExitReason> {
    return this.prisma.exitReason.create({
      data,
    });
  }

  async update(id: string, data: Prisma.ExitReasonUpdateInput): Promise<ExitReason> {
    return this.prisma.exitReason.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<ExitReason> {
    return this.prisma.exitReason.delete({
      where: { id },
    });
  }
} 