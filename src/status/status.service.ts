import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Status, Prisma } from '@prisma/client';

@Injectable()
export class StatusService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Status[]> {
    return this.prisma.status.findMany();
  }

  async findOne(id: string): Promise<Status | null> {
    return this.prisma.status.findUnique({
      where: { id },
    });
  }

  async create(data: Prisma.StatusCreateInput): Promise<Status> {
    return this.prisma.status.create({
      data,
    });
  }

  async update(id: string, data: Prisma.StatusUpdateInput): Promise<Status> {
    return this.prisma.status.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Status> {
    return this.prisma.status.delete({
      where: { id },
    });
  }
} 