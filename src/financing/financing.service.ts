import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Financing } from '@prisma/client';

@Injectable()
export class FinancingService {
  constructor(@Inject(PrismaService) private prisma: PrismaService) {}

  async findAll(): Promise<Financing[]> {
    return this.prisma.financing.findMany();
  }

  async findOne(id: string): Promise<Financing> {
    const financing = await this.prisma.financing.findUnique({
      where: { financing_uuid: id },
    });

    if (!financing) {
      throw new NotFoundException(`Financement avec l'ID ${id} non trouvé`);
    }

    return financing;
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
    // Vérifier que le financement existe
    await this.findOne(id);

    return this.prisma.financing.update({
      where: { financing_uuid: id },
      data: updateFinancingData,
    });
  }

  async delete(id: string): Promise<Financing> {
    // Vérifier que le financement existe
    await this.findOne(id);

    return this.prisma.financing.delete({
      where: { financing_uuid: id },
    });
  }
}
