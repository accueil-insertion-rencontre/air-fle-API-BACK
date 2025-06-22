import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('TaskService', () => {
  let service: TaskService;
  let mockPrismaService: any;

  beforeEach(() => {
    // Créer un mock direct pour PrismaService
    mockPrismaService = {
      task: {
        create: vi.fn(),
        findMany: vi.fn(),
        findUnique: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
      subtask: {
        create: vi.fn(),
      },
      $transaction: vi.fn(),
    };

    // Créer le service directement avec le mock
    service = new TaskService(mockPrismaService as PrismaService);
  });

  it('devrait être défini', () => {
    expect(service).toBeDefined();
  });

  it('devrait avoir une méthode findAll', () => {
    expect(typeof service.findAll).toBe('function');
  });

  it('devrait avoir une méthode findOne', () => {
    expect(typeof service.findOne).toBe('function');
  });

  it('devrait avoir une méthode create', () => {
    expect(typeof service.create).toBe('function');
  });

  it('devrait avoir une méthode update', () => {
    expect(typeof service.update).toBe('function');
  });

  it('devrait avoir une méthode delete', () => {
    expect(typeof service.delete).toBe('function');
  });

  it('devrait avoir une méthode getAllTasksWithStats', () => {
    expect(typeof service.getAllTasksWithStats).toBe('function');
  });

  it('devrait avoir une méthode getStatistics', () => {
    expect(typeof service.getStatistics).toBe('function');
  });

  describe('findOne', () => {
    it('devrait retourner une tâche existante', async () => {
      const taskId = 'task-1';
      const expectedTask = {
        id: taskId,
        title: 'Tâche test',
        user: { id: 'user-1' },
        subtasks: [],
      };

      mockPrismaService.task.findUnique.mockResolvedValue(expectedTask);

      const result = await service.findOne(taskId);

      expect(mockPrismaService.task.findUnique).toHaveBeenCalledWith({
        where: { id: taskId },
        include: {
          user: true,
          subtasks: {
            orderBy: { createdAt: 'asc' },
          },
        },
      });
      expect(result).toEqual(expectedTask);
    });

    it('devrait retourner null si tâche non trouvée', async () => {
      const taskId = 'task-999';

      mockPrismaService.task.findUnique.mockResolvedValue(null);

      const result = await service.findOne(taskId);

      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it("devrait retourner toutes les tâches d'un utilisateur", async () => {
      const userId = 'user-1';
      const expectedTasks = [
        { id: 'task-1', title: 'Tâche 1', user_id: userId, subtasks: [] },
        { id: 'task-2', title: 'Tâche 2', user_id: userId, subtasks: [] },
      ];

      mockPrismaService.task.findMany.mockResolvedValue(expectedTasks);

      const result = await service.findAll(userId);

      expect(mockPrismaService.task.findMany).toHaveBeenCalledWith({
        where: { user_id: userId },
        include: {
          user: true,
          subtasks: {
            orderBy: { createdAt: 'asc' },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(expectedTasks);
    });
  });

  describe('create', () => {
    it('devrait créer une tâche simple sans sous-tâches', async () => {
      const userId = 'user-1';
      const createTaskDto = {
        title: 'Tâche simple',
        description: 'Description simple',
        priority: 'HIGH' as any,
      };

      const expectedTask = {
        id: 'task-1',
        title: 'Tâche simple',
        description: 'Description simple',
        priority: 'HIGH',
        status: 'pending',
        completionPercentage: 0,
        user_id: userId,
        user: { id: userId },
        subtasks: [],
      };

      mockPrismaService.$transaction.mockImplementation(async (callback) => {
        const mockTx = {
          task: {
            create: vi.fn().mockResolvedValue({ id: 'task-1' }),
            findUnique: vi.fn().mockResolvedValue(expectedTask),
          },
        };
        return await callback(mockTx);
      });

      const result = await service.create(userId, createTaskDto);

      expect(mockPrismaService.$transaction).toHaveBeenCalled();
      expect(result).toEqual(expectedTask);
    });
  });

  describe('update', () => {
    it('devrait mettre à jour une tâche existante', async () => {
      const taskId = 'task-1';
      const updateDto = {
        title: 'Titre mis à jour',
        description: 'Description mise à jour',
      };

      const existingTask = {
        id: taskId,
        title: 'Ancien titre',
        user: { id: 'user-1' },
        subtasks: [],
      };

      const updatedTask = {
        ...existingTask,
        ...updateDto,
      };

      // Mock pour findOne d'abord
      mockPrismaService.task.findUnique.mockResolvedValue(existingTask);
      // Mock pour update ensuite
      mockPrismaService.task.update.mockResolvedValue(updatedTask);

      const result = await service.update(taskId, updateDto);

      expect(mockPrismaService.task.update).toHaveBeenCalledWith({
        where: { id: taskId },
        data: updateDto,
        include: {
          user: true,
          subtasks: {
            orderBy: { createdAt: 'asc' },
          },
        },
      });
      expect(result).toEqual(updatedTask);
    });

    it('devrait lever NotFoundException si tâche non trouvée', async () => {
      const taskId = 'task-999';
      const updateDto = { title: 'Titre' };

      mockPrismaService.task.findUnique.mockResolvedValue(null);

      await expect(service.update(taskId, updateDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('delete', () => {
    it('devrait supprimer une tâche existante', async () => {
      const taskId = 'task-1';
      const existingTask = {
        id: taskId,
        title: 'Tâche à supprimer',
        user: { id: 'user-1' },
        subtasks: [],
      };

      mockPrismaService.task.findUnique.mockResolvedValue(existingTask);
      mockPrismaService.task.delete.mockResolvedValue(existingTask);

      const result = await service.delete(taskId);

      expect(mockPrismaService.task.delete).toHaveBeenCalledWith({
        where: { id: taskId },
        include: {
          user: true,
          subtasks: true,
        },
      });
      expect(result).toEqual(existingTask);
    });

    it('devrait lever NotFoundException si tâche non trouvée', async () => {
      const taskId = 'task-999';

      mockPrismaService.task.findUnique.mockResolvedValue(null);

      await expect(service.delete(taskId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getStatistics', () => {
    it("devrait retourner les statistiques d'une tâche", async () => {
      const taskId = 'task-1';
      const taskWithSubtasks = {
        id: taskId,
        title: 'Tâche test',
        status: 'in_progress',
        subtasks: [
          { id: 'sub-1', status: 'completed' },
          { id: 'sub-2', status: 'pending' },
          { id: 'sub-3', status: 'completed' },
        ],
      };

      mockPrismaService.task.findUnique.mockResolvedValue(taskWithSubtasks);

      const result = await service.getStatistics(taskId);

      expect(result).toEqual({
        task: {
          id: taskId,
          title: 'Tâche test',
          status: 'in_progress',
        },
        subtasks: {
          total: 3,
          completed: 2,
          pending: 1,
          completionPercentage: 66.67,
        },
      });
    });

    it('devrait lever NotFoundException si tâche non trouvée', async () => {
      const taskId = 'task-999';

      mockPrismaService.task.findUnique.mockResolvedValue(null);

      await expect(service.getStatistics(taskId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
