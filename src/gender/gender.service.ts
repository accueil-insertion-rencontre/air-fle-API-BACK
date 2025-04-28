import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Gender, Prisma } from '@prisma/client';

@Injectable()
export class GenderService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Gender[]> {
    return this.prisma.gender.findMany();
  }

  async findOne(id: string): Promise<Gender | null> {
    return this.prisma.gender.findUnique({
      where: { id },
    });
  }

  async create(data: Prisma.GenderCreateInput): Promise<Gender> {
    return this.prisma.gender.create({
      data,
    });
  }

  async update(id: string, data: Prisma.GenderUpdateInput): Promise<Gender> {
    return this.prisma.gender.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Gender> {
    return this.prisma.gender.delete({
      where: { id },
    });
  }
} 