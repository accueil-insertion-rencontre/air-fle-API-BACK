import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Period } from '@prisma/client';

@Injectable()
export class PeriodService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Period[]> {
    return this.prisma.period.findMany();
  }

  async findOne(id: string): Promise<Period | null> {
    return this.prisma.period.findUnique({
      where: { period_uuid: id },
    });
  }

  async create(createPeriodData: Prisma.PeriodCreateInput): Promise<Period> {
    return this.prisma.period.create({
      data: createPeriodData,
    });
  }

  async update(
    id: string,
    updatePeriodData: Prisma.PeriodUpdateInput,
  ): Promise<Period> {
    return this.prisma.period.update({
      where: { period_uuid: id },
      data: updatePeriodData,
    });
  }

  async delete(id: string): Promise<Period> {
    return this.prisma.period.delete({
      where: { period_uuid: id },
    });
  }
}
