import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Gender } from '@prisma/client';

@Injectable()
export class GenderService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Gender[]> {
    return this.prisma.gender.findMany();
  }

  async findOne(id: string): Promise<Gender | null> {
    return this.prisma.gender.findUnique({
      where: { gender_uuid: id },
    });
  }

  async create(createGenderData: Prisma.GenderCreateInput): Promise<Gender> {
    return this.prisma.gender.create({
      data: createGenderData,
    });
  }

  async update(
    id: string,
    updateGenderData: Prisma.GenderUpdateInput,
  ): Promise<Gender> {
    return this.prisma.gender.update({
      where: { gender_uuid: id },
      data: updateGenderData,
    });
  }

  async delete(id: string): Promise<Gender> {
    return this.prisma.gender.delete({
      where: { gender_uuid: id },
    });
  }
}
