import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Group, Prisma } from '@prisma/client';
import {
  IGroupRepository,
  IGroupStudentManager,
  IGroupBusinessService,
  GroupWithRelations,
  GroupFilters,
  CreateGroupRequest,
  UpdateGroupRequest,
  GROUP_REPOSITORY,
  GROUP_STUDENT_MANAGER,
} from './interfaces/group.interface';

@Injectable()
export class GroupService implements IGroupBusinessService {
  constructor(
    @Inject(GROUP_REPOSITORY)
    private readonly groupRepository: IGroupRepository,
    @Inject(GROUP_STUDENT_MANAGER)
    private readonly studentManager: IGroupStudentManager,
  ) {}

  async findAll(filters?: GroupFilters): Promise<GroupWithRelations[]> {
    const where: Prisma.GroupWhereInput = {};

    if (filters?.session_uuid) {
      where.session_uuid = filters.session_uuid;
    }

    if (filters?.period_uuid) {
      where.periods = {
        some: {
          period_uuid: filters.period_uuid,
        },
      };
    }

    return this.groupRepository.findAll({
      where,
      skip: filters?.skip,
      take: filters?.take,
    });
  }

  async findById(id: string): Promise<GroupWithRelations> {
    const group = await this.groupRepository.findOne(id);
    if (!group) {
      throw new NotFoundException(`Groupe avec l'ID ${id} non trouvé`);
    }
    return group;
  }

  async createGroup(data: CreateGroupRequest): Promise<Group> {
    const prismaData: Prisma.GroupCreateInput = {
      group_label: data.group_label,
      session: {
        connect: {
          session_uuid: data.session_uuid,
        },
      },
    };

    return this.groupRepository.create(prismaData);
  }

  async updateGroup(id: string, data: UpdateGroupRequest): Promise<Group> {
    // Vérifier que le groupe existe
    await this.findById(id);

    const prismaData: Prisma.GroupUpdateInput = {};

    if (data.group_label !== undefined) {
      prismaData.group_label = data.group_label;
    }

    if (data.session_uuid) {
      prismaData.session = {
        connect: {
          session_uuid: data.session_uuid,
        },
      };
    }

    return this.groupRepository.update(id, prismaData);
  }

  async deleteGroup(id: string): Promise<Group> {
    // Vérifier que le groupe existe
    await this.findById(id);
    return this.groupRepository.delete(id);
  }

  // Méthodes de gestion des étudiants (délégation)
  async addStudent(groupId: string, studentId: string): Promise<any> {
    // Vérifier que le groupe existe
    await this.findById(groupId);
    return this.studentManager.addStudent(groupId, studentId);
  }

  async removeStudent(groupId: string, studentId: string): Promise<any> {
    // Vérifier que le groupe existe
    await this.findById(groupId);
    return this.studentManager.removeStudent(groupId, studentId);
  }

  async getStudentsByGroup(groupId: string): Promise<any[]> {
    // Vérifier que le groupe existe
    await this.findById(groupId);
    return this.studentManager.getStudentsByGroup(groupId);
  }
}
