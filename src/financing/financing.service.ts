import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Financing, Prisma } from '@prisma/client';

@Injectable()
export class FinancingService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Financing[]> {
    return this.prisma.financing.findMany();
  }

  async findOne(id: string): Promise<Financing | null> {
    return this.prisma.financing.findUnique({
      where: { id },
    });
  }

  async create(data: Prisma.FinancingCreateInput): Promise<Financing> {
    return this.prisma.financing.create({
      data,
    });
  }

  async update(id: string, data: Prisma.FinancingUpdateInput): Promise<Financing> {
    return this.prisma.financing.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Financing> {
    return this.prisma.financing.delete({
      where: { id },
    });
  }
} 