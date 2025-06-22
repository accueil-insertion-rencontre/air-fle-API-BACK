import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Group } from '@prisma/client';

// Type pour un groupe avec ses relations
type GroupWithRelations = Prisma.GroupGetPayload<{
  include: {
    session: true;
    courses: true;
    students: {
      include: {
        student: true;
      };
    };
    periods: {
      include: {
        period: true;
      };
    };
  };
}>;

@Injectable()
export class GroupService {
  constructor(private prisma: PrismaService) {}

  async findAll(params?: {
    skip?: number;
    take?: number;
    where?: Prisma.GroupWhereInput;
  }): Promise<GroupWithRelations[]> {
    return this.prisma.group.findMany({
      ...params,
      include: {
        session: true,
        courses: true,
        students: {
          include: {
            student: true,
          },
        },
        periods: {
          include: {
            period: true,
          },
        },
      },
    });
  }

  async findOne(id: string): Promise<GroupWithRelations | null> {
    return this.prisma.group.findUnique({
      where: { group_uuid: id },
      include: {
        session: true,
        courses: true,
        students: {
          include: {
            student: true,
          },
        },
        periods: {
          include: {
            period: true,
          },
        },
      },
    });
  }

  async create(createGroupData: Prisma.GroupCreateInput): Promise<Group> {
    return this.prisma.group.create({
      data: createGroupData,
    });
  }

  async update(
    id: string,
    updateGroupData: Prisma.GroupUpdateInput,
  ): Promise<Group> {
    return this.prisma.group.update({
      where: { group_uuid: id },
      data: updateGroupData,
    });
  }

  async remove(id: string): Promise<Group> {
    return this.prisma.group.delete({
      where: { group_uuid: id },
    });
  }

  async addStudent(groupId: string, studentId: string): Promise<any> {
    return this.prisma.studentGroup.create({
      data: {
        group_uuid: groupId,
        student_uuid: studentId,
      },
    });
  }

  async removeStudent(groupId: string, studentId: string): Promise<any> {
    return this.prisma.studentGroup.delete({
      where: {
        student_uuid_group_uuid: {
          student_uuid: studentId,
          group_uuid: groupId,
        },
      },
    });
  }
}
