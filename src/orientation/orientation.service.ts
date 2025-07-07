import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Orientation } from '@prisma/client';

@Injectable()
export class OrientationService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Orientation[]> {
    return this.prisma.orientation.findMany();
  }

  async findOne(id: string): Promise<Orientation | null> {
    return this.prisma.orientation.findUnique({
      where: { orientation_uuid: id },
    });
  }

  async create(
    createOrientationData: Prisma.OrientationCreateInput,
  ): Promise<Orientation> {
    return this.prisma.orientation.create({
      data: createOrientationData,
    });
  }

  async update(
    id: string,
    updateOrientationData: Prisma.OrientationUpdateInput,
  ): Promise<Orientation> {
    return this.prisma.orientation.update({
      where: { orientation_uuid: id },
      data: updateOrientationData,
    });
  }

  async delete(id: string): Promise<Orientation> {
    return this.prisma.orientation.delete({
      where: { orientation_uuid: id },
    });
  }
}
