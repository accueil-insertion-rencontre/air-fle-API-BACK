import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Disability, Prisma } from '@prisma/client';

@Injectable()
export class DisabilityService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Disability[]> {
    return this.prisma.disability.findMany({
      include: {
        students: {
          include: {
            student: true
          }
        }
      }
    });
  }

  async findOne(id: string): Promise<Disability | null> {
    const disability = await this.prisma.disability.findUnique({
      where: { id },
      include: {
        students: {
          include: {
            student: true
          }
        }
      }
    });

    if (!disability) {
      throw new NotFoundException(`Handicap avec l'ID ${id} non trouvé`);
    }

    return disability;
  }

  async create(data: Prisma.DisabilityCreateInput): Promise<Disability> {
    return this.prisma.disability.create({
      data,
      include: {
        students: true
      }
    });
  }

  async update(id: string, data: Prisma.DisabilityUpdateInput): Promise<Disability> {
    try {
      return await this.prisma.disability.update({
        where: { id },
        data,
        include: {
          students: true
        }
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Handicap avec l'ID ${id} non trouvé`);
      }
      throw error;
    }
  }

  async remove(id: string): Promise<Disability> {
    try {
      return await this.prisma.disability.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Handicap avec l'ID ${id} non trouvé`);
      }
      throw error;
    }
  }
}
