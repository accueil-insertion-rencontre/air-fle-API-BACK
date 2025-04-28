import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FrenchLevel, Prisma } from '@prisma/client';

@Injectable()
export class FrenchLevelService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<FrenchLevel[]> {
    return this.prisma.frenchLevel.findMany();
  }

  async findOne(id: string): Promise<FrenchLevel | null> {
    return this.prisma.frenchLevel.findUnique({
      where: { id },
    });
  }

  async create(data: Prisma.FrenchLevelCreateInput): Promise<FrenchLevel> {
    return this.prisma.frenchLevel.create({
      data,
    });
  }

  async update(id: string, data: Prisma.FrenchLevelUpdateInput): Promise<FrenchLevel> {
    return this.prisma.frenchLevel.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<FrenchLevel> {
    return this.prisma.frenchLevel.delete({
      where: { id },
    });
  }
} 