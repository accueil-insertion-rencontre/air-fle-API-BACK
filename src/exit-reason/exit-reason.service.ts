import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, ExitReason } from '@prisma/client';

@Injectable()
export class ExitReasonService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<ExitReason[]> {
    return this.prisma.exitReason.findMany();
  }

  async findOne(id: string): Promise<ExitReason | null> {
    return this.prisma.exitReason.findUnique({
      where: { exit_reason_uuid: id },
    });
  }

  async create(
    createExitReasonData: Prisma.ExitReasonCreateInput,
  ): Promise<ExitReason> {
    return this.prisma.exitReason.create({
      data: createExitReasonData,
    });
  }

  async update(
    id: string,
    updateExitReasonData: Prisma.ExitReasonUpdateInput,
  ): Promise<ExitReason> {
    return this.prisma.exitReason.update({
      where: { exit_reason_uuid: id },
      data: updateExitReasonData,
    });
  }

  async delete(id: string): Promise<ExitReason> {
    return this.prisma.exitReason.delete({
      where: { exit_reason_uuid: id },
    });
  }
}
