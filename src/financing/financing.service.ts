import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Financing } from '@prisma/client';

@Injectable()
export class FinancingService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Financing[]> {
    return this.prisma.financing.findMany();
  }

  async findOne(id: string): Promise<Financing | null> {
    return this.prisma.financing.findUnique({
      where: { financing_uuid: id },
    });
  }

  async create(
    createFinancingData: Prisma.FinancingCreateInput,
  ): Promise<Financing> {
    return this.prisma.financing.create({
      data: createFinancingData,
    });
  }

  async update(
    id: string,
    updateFinancingData: Prisma.FinancingUpdateInput,
  ): Promise<Financing> {
    return this.prisma.financing.update({
      where: { financing_uuid: id },
      data: updateFinancingData,
    });
  }

  async delete(id: string): Promise<Financing> {
    return this.prisma.financing.delete({
      where: { financing_uuid: id },
    });
  }
}
