import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Orientation, Prisma } from '@prisma/client';

@Injectable()
export class OrientationService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Orientation[]> {
    return this.prisma.orientation.findMany();
  }

  async findOne(id: string): Promise<Orientation | null> {
    return this.prisma.orientation.findUnique({
      where: { id },
    });
  }

  async create(data: Prisma.OrientationCreateInput): Promise<Orientation> {
    return this.prisma.orientation.create({
      data,
    });
  }

  async update(id: string, data: Prisma.OrientationUpdateInput): Promise<Orientation> {
    return this.prisma.orientation.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Orientation> {
    return this.prisma.orientation.delete({
      where: { id },
    });
  }
} 