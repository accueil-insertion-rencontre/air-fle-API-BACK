import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class GroupService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.GroupCreateInput) {
    return this.prisma.group.create({
      data,
      include: {
        students: {
          include: {
            student: true,
          },
        },
        session: true,
      },
    });
  }

  async findAll(params?: {
    skip?: number;
    take?: number;
    where?: Prisma.GroupWhereInput;
    orderBy?: Prisma.GroupOrderByWithRelationInput;
  }) {
    const { skip, take, where, orderBy } = params || {};
    const [groups, total] = await Promise.all([
      this.prisma.group.findMany({
        skip,
        take,
        where,
        orderBy,
        include: {
          students: {
            include: {
              student: true,
            },
          },
          session: true,
        },
      }),
      this.prisma.group.count({ where }),
    ]);

    return {
      data: groups,
      meta: {
        total,
        skip: skip || 0,
        take: take || total,
      },
    };
  }

  async findOne(id: string) {
    const group = await this.prisma.group.findUnique({
      where: { id },
      include: {
        students: {
          include: {
            student: true,
          },
        },
        session: true,
      },
    });

    if (!group) {
      throw new NotFoundException(`Groupe avec l'ID ${id} non trouvé`);
    }

    return group;
  }

  async update(id: string, data: Prisma.GroupUpdateInput) {
    try {
      return await this.prisma.group.update({
        where: { id },
        data,
        include: {
          students: {
            include: {
              student: true,
            },
          },
          session: true,
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Groupe avec l'ID ${id} non trouvé`);
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.group.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Groupe avec l'ID ${id} non trouvé`);
      }
      throw error;
    }
  }

  async addStudent(groupId: string, studentId: string) {
    try {
      return await this.prisma.group.update({
        where: { id: groupId },
        data: {
          students: {
            create: {
              student: {
                connect: { id: studentId }
              }
            }
          }
        },
        include: {
          students: {
            include: {
              student: true
            }
          }
        }
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new Error(`L'étudiant fait déjà partie de ce groupe`);
      }
      throw error;
    }
  }

  async removeStudent(groupId: string, studentId: string) {
    try {
      return await this.prisma.group.update({
        where: { id: groupId },
        data: {
          students: {
            deleteMany: {
              student_id: studentId
            }
          }
        }
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`L'étudiant n'est pas membre de ce groupe`);
      }
      throw error;
    }
  }
}
