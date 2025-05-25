import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Task, Prisma } from '@prisma/client';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

// Type pour une tâche avec ses relations
type TaskWithRelations = Prisma.TaskGetPayload<{
  include: {
    user: true;
    subtasks: true;
  };
}>;

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string): Promise<TaskWithRelations[]> {
    return this.prisma.task.findMany({
      where: { user_id: userId },
      include: {
        user: true,
        subtasks: {
          orderBy: { createdAt: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findOne(id: string): Promise<TaskWithRelations | null> {
    return this.prisma.task.findUnique({
      where: { id },
      include: {
        user: true,
        subtasks: {
          orderBy: { createdAt: 'asc' }
        }
      }
    });
  }

  async create(userId: string, createTaskDto: CreateTaskDto): Promise<TaskWithRelations> {
    const { subtasks, ...taskData } = createTaskDto;

    return this.prisma.$transaction(async (prisma) => {
      // 1. Créer la tâche
      const task = await prisma.task.create({
        data: {
          ...taskData,
          status: 'pending',
          completionPercentage: 0,
          user: {
            connect: { id: userId }
          }
        }
      });

      // 2. Créer les sous-tâches si elles existent
      if (subtasks && subtasks.length > 0) {
        await Promise.all(
          subtasks.map(subtask => 
            prisma.subtask.create({
              data: {
                ...subtask,
                status: 'pending',
                task: {
                  connect: { id: task.id }
                }
              }
            })
          )
        );
      }

      // 3. Retourner la tâche avec ses sous-tâches
      return prisma.task.findUnique({
        where: { id: task.id },
        include: {
          user: true,
          subtasks: {
            orderBy: { createdAt: 'asc' }
          }
        }
      }) as Promise<TaskWithRelations>;
    });
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<TaskWithRelations> {
    const task = await this.findOne(id);
    if (!task) {
      throw new NotFoundException('Tâche non trouvée');
    }

    // Le statut et le pourcentage de completion sont calculés automatiquement
    const { completionPercentage, ...updateData } = updateTaskDto;

    return this.prisma.task.update({
      where: { id },
      data: updateData,
      include: {
        user: true,
        subtasks: {
          orderBy: { createdAt: 'asc' }
        }
      }
    });
  }

  async delete(id: string): Promise<TaskWithRelations> {
    const task = await this.findOne(id);
    if (!task) {
      throw new NotFoundException('Tâche non trouvée');
    }

    return this.prisma.task.delete({
      where: { id },
      include: {
        user: true,
        subtasks: true
      }
    });
  }

  /**
   * Récupère les statistiques d'une tâche
   */
  async getStatistics(id: string): Promise<any> {
    const task = await this.findOne(id);
    if (!task) {
      throw new NotFoundException('Tâche non trouvée');
    }

    const totalSubtasks = task.subtasks.length;
    const completedSubtasks = task.subtasks.filter(subtask => subtask.status === 'completed').length;
    const pendingSubtasks = task.subtasks.filter(subtask => subtask.status === 'pending').length;
    
    const completionPercentage = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

    return {
      task: {
        id: task.id,
        title: task.title,
        status: task.status
      },
      subtasks: {
        total: totalSubtasks,
        completed: completedSubtasks,
        pending: pendingSubtasks,
        completionPercentage: Math.round(completionPercentage * 100) / 100
      }
    };
  }

  /**
   * Récupère toutes les tâches de l'utilisateur avec leurs statistiques
   */
  async getAllTasksWithStats(userId: string): Promise<any> {
    const tasks = await this.findAll(userId);
    
    const tasksWithStats = await Promise.all(
      tasks.map(async (task) => {
        const stats = await this.getStatistics(task.id);
        return {
          ...task,
          statistics: stats.subtasks
        };
      })
    );

    // Statistiques globales
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === 'completed').length;
    const inProgressTasks = tasks.filter(task => task.status === 'in_progress').length;
    const pendingTasks = tasks.filter(task => task.status === 'pending').length;

    return {
      tasks: tasksWithStats,
      globalStats: {
        totalTasks,
        completedTasks,
        inProgressTasks,
        pendingTasks,
        completionPercentage: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
      }
    };
  }
} 