import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Period, Prisma } from '@prisma/client';

@Injectable()
export class PeriodService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Period[]> {
    return this.prisma.period.findMany();
  }

  async findOne(id: string): Promise<Period | null> {
    return this.prisma.period.findUnique({
      where: { id },
    });
  }

  async create(data: Prisma.PeriodCreateInput): Promise<Period> {
    return this.prisma.period.create({
      data,
    });
  }

  async update(id: string, data: Prisma.PeriodUpdateInput): Promise<Period> {
    return this.prisma.period.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Period> {
    return this.prisma.period.delete({
      where: { id },
    });
  }
} 