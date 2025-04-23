import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Nationality, Prisma } from '@prisma/client';

@Injectable()
export class NationalityService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Nationality[]> {
    return this.prisma.nationality.findMany();
  }

  async findOne(id: string): Promise<Nationality | null> {
    return this.prisma.nationality.findUnique({
      where: { id },
    });
  }

  async create(data: Prisma.NationalityCreateInput): Promise<Nationality> {
    return this.prisma.nationality.create({
      data,
    });
  }

  async update(id: string, data: Prisma.NationalityUpdateInput): Promise<Nationality> {
    return this.prisma.nationality.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Nationality> {
    return this.prisma.nationality.delete({
      where: { id },
    });
  }
} 