import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Status } from '@prisma/client';

@Injectable()
export class StatusService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Status[]> {
    return this.prisma.status.findMany();
  }

  async findOne(id: string): Promise<Status | null> {
    return this.prisma.status.findUnique({
      where: { status_uuid: id },
    });
  }

  async create(createStatusData: Prisma.StatusCreateInput): Promise<Status> {
    return this.prisma.status.create({
      data: createStatusData,
    });
  }

  async update(
    id: string,
    updateStatusData: Prisma.StatusUpdateInput,
  ): Promise<Status> {
    return this.prisma.status.update({
      where: { status_uuid: id },
      data: updateStatusData,
    });
  }

  async delete(id: string): Promise<Status> {
    return this.prisma.status.delete({
      where: { status_uuid: id },
    });
  }
}
