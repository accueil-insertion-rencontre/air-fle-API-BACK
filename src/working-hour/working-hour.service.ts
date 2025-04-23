import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WorkingHour, Prisma } from '@prisma/client';

@Injectable()
export class WorkingHourService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<WorkingHour[]> {
    return this.prisma.workingHour.findMany();
  }

  async findOne(id: string): Promise<WorkingHour | null> {
    return this.prisma.workingHour.findUnique({
      where: { id },
    });
  }

  async create(data: Prisma.WorkingHourCreateInput): Promise<WorkingHour> {
    return this.prisma.workingHour.create({
      data,
    });
  }

  async update(id: string, data: Prisma.WorkingHourUpdateInput): Promise<WorkingHour> {
    return this.prisma.workingHour.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<WorkingHour> {
    return this.prisma.workingHour.delete({
      where: { id },
    });
  }
} 