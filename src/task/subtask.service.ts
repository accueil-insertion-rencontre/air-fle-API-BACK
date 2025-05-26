import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Subtask, Prisma } from '@prisma/client';
import { CreateSubtaskDto } from './dto/create-subtask.dto';
import { UpdateSubtaskDto } from './dto/update-subtask.dto';

// Type pour une sous-tâche avec ses relations
export type SubtaskWithRelations = Prisma.SubtaskGetPayload<{
  include: {
    task: {
      include: {
        user: true;
      };
    };
  };
}>;

@Injectable()
export class SubtaskService {
  constructor(
    private prisma: PrismaService
  ) {}

  async findAll(taskId: string): Promise<SubtaskWithRelations[]> {
    return this.prisma.subtask.findMany({
      where: { task_id: taskId },
      include: {
        task: {
          include: {
            user: true
          }
        }
      },
      orderBy: { createdAt: 'asc' }
    });
  }

  async findOne(id: string): Promise<SubtaskWithRelations | null> {
    return this.prisma.subtask.findUnique({
      where: { id },
      include: {
        task: {
          include: {
            user: true
          }
        }
      }
    });
  }

  async create(taskId: string, createSubtaskDto: CreateSubtaskDto): Promise<SubtaskWithRelations> {
    const subtask = await this.prisma.subtask.create({
      data: {
        ...createSubtaskDto,
        status: createSubtaskDto.status || 'pending',
        task: {
          connect: { id: taskId }
        }
      },
      include: {
        task: {
          include: {
            user: true
          }
        }
      }
    });

    // Mettre à jour le statut de la tâche parente
    await this.updateTaskProgress(taskId);

    return subtask;
  }

  async update(id: string, updateSubtaskDto: UpdateSubtaskDto): Promise<SubtaskWithRelations> {
    const subtask = await this.findOne(id);
    if (!subtask) {
      throw new NotFoundException('Sous-tâche non trouvée');
    }

    const updatedSubtask = await this.prisma.subtask.update({
      where: { id },
      data: updateSubtaskDto,
      include: {
        task: {
          include: {
            user: true
          }
        }
      }
    });

    // Mettre à jour le statut de la tâche parente si le statut de la sous-tâche a changé
    if (updateSubtaskDto.status) {
      await this.updateTaskProgress(subtask.task_id);
    }

    return updatedSubtask;
  }

  async toggleStatus(id: string): Promise<SubtaskWithRelations> {
    const subtask = await this.findOne(id);
    if (!subtask) {
      throw new NotFoundException('Sous-tâche non trouvée');
    }

    const newStatus: 'pending' | 'completed' = subtask.status === 'completed' ? 'pending' : 'completed';

    return this.update(id, { status: newStatus });
  }

  async delete(id: string): Promise<SubtaskWithRelations> {
    const subtask = await this.findOne(id);
    if (!subtask) {
      throw new NotFoundException('Sous-tâche non trouvée');
    }

    const deletedSubtask = await this.prisma.subtask.delete({
      where: { id },
      include: {
        task: {
          include: {
            user: true
          }
        }
      }
    });

    // Mettre à jour le statut de la tâche parente
    await this.updateTaskProgress(subtask.task_id);

    return deletedSubtask;
  }

  private async updateTaskProgress(taskId: string): Promise<void> {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: {
        subtasks: true
      }
    });

    if (!task) return;

    const totalSubtasks = task.subtasks.length;
    
    if (totalSubtasks === 0) {
      return;
    }

    const completedSubtasks = task.subtasks.filter(
      subtask => subtask.status === 'completed'
    ).length;

    const completionPercentage = Math.round((completedSubtasks / totalSubtasks) * 100);
    
    let status: string;
    if (completionPercentage === 0) {
      status = 'pending';
    } else if (completionPercentage === 100) {
      status = 'completed';
    } else {
      status = 'in_progress';
    }

    await this.prisma.task.update({
      where: { id: taskId },
      data: {
        status,
        completionPercentage
      }
    });
  }
} 