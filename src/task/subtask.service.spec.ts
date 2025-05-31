import { Test, TestingModule } from '@nestjs/testing';
import { SubtaskService } from './subtask.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('SubtaskService', () => {
  let service: SubtaskService;
  let mockPrismaService: any;

  beforeEach(() => {
    mockPrismaService = {
      subtask: {
        create: vi.fn(),
        findMany: vi.fn(),
        findUnique: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        count: vi.fn(),
      },
      task: {
        findUnique: vi.fn(),
        update: vi.fn(),
      },
    };

    service = new SubtaskService(mockPrismaService as PrismaService);
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

  it('devrait avoir une méthode toggleStatus', () => {
    expect(typeof service.toggleStatus).toBe('function');
  });

  describe('findOne', () => {
    it('devrait retourner une sous-tâche existante', async () => {
      const subtaskId = 'subtask-1';
      const subtask = {
        id: subtaskId,
        title: 'Sous-tâche test',
        status: 'pending',
        task: { id: 'task-1', user_id: 'user-1' }
      };

      mockPrismaService.subtask.findUnique.mockResolvedValue(subtask);

      const result = await service.findOne(subtaskId);

      expect(mockPrismaService.subtask.findUnique).toHaveBeenCalledWith({
        where: { id: subtaskId },
        include: {
          task: {
            include: {
              user: true,
            },
          },
        }
      });
      expect(result).toEqual(subtask);
    });

    it('devrait retourner null si sous-tâche non trouvée', async () => {
      const subtaskId = 'subtask-999';

      mockPrismaService.subtask.findUnique.mockResolvedValue(null);

      const result = await service.findOne(subtaskId);

      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('devrait retourner toutes les sous-tâches d\'une tâche', async () => {
      const taskId = 'task-1';
      const subtasks = [
        { id: 'sub-1', title: 'Sous-tâche 1', status: 'pending', task_id: taskId },
        { id: 'sub-2', title: 'Sous-tâche 2', status: 'completed', task_id: taskId }
      ];

      mockPrismaService.subtask.findMany.mockResolvedValue(subtasks);

      const result = await service.findAll(taskId);

      expect(mockPrismaService.subtask.findMany).toHaveBeenCalledWith({
        where: { task_id: taskId },
        include: {
          task: {
            include: {
              user: true,
            },
          },
        },
        orderBy: { createdAt: 'asc' },
      });
      expect(result).toEqual(subtasks);
    });
  });

  describe('create', () => {
    it('devrait créer une sous-tâche', async () => {
      const taskId = 'task-1';
      const createSubtaskDto = {
        title: 'Nouvelle sous-tâche',
        description: 'Description de la sous-tâche'
      };

      const newSubtask = {
        id: 'subtask-1',
        title: 'Nouvelle sous-tâche',
        description: 'Description de la sous-tâche',
        status: 'pending',
        task_id: taskId
      };

      mockPrismaService.task.findUnique.mockResolvedValue({
        id: taskId,
        subtasks: [newSubtask]
      });
      mockPrismaService.task.update.mockResolvedValue({});
      mockPrismaService.subtask.create.mockResolvedValue(newSubtask);

      const result = await service.create(taskId, createSubtaskDto);

      expect(mockPrismaService.subtask.create).toHaveBeenCalledWith({
        data: {
          ...createSubtaskDto,
          status: 'pending',
          task: {
            connect: { id: taskId }
          }
        },
        include: {
          task: {
            include: {
              user: true,
            },
          },
        },
      });
      expect(result).toEqual(newSubtask);
    });
  });

  describe('update', () => {
    it('devrait mettre à jour une sous-tâche existante', async () => {
      const subtaskId = 'subtask-1';
      const updateDto = {
        title: 'Titre mis à jour',
        status: 'completed' as any
      };

      const existingSubtask = {
        id: subtaskId,
        title: 'Ancien titre',
        status: 'pending',
        task_id: 'task-1',
        task: { id: 'task-1', user_id: 'user-1' }
      };

      const updatedSubtask = {
        ...existingSubtask,
        ...updateDto
      };

      mockPrismaService.subtask.findUnique.mockResolvedValue(existingSubtask);
      mockPrismaService.subtask.update.mockResolvedValue(updatedSubtask);
      mockPrismaService.task.findUnique.mockResolvedValue({
        id: 'task-1',
        subtasks: [updatedSubtask]
      });
      mockPrismaService.task.update.mockResolvedValue({});

      const result = await service.update(subtaskId, updateDto);

      expect(mockPrismaService.subtask.update).toHaveBeenCalledWith({
        where: { id: subtaskId },
        data: updateDto,
        include: {
          task: {
            include: {
              user: true,
            },
          },
        },
      });
      expect(result).toEqual(updatedSubtask);
    });

    it('devrait lever NotFoundException si sous-tâche non trouvée', async () => {
      const subtaskId = 'subtask-999';
      const updateDto = { title: 'Titre' };

      mockPrismaService.subtask.findUnique.mockResolvedValue(null);

      await expect(service.update(subtaskId, updateDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('devrait supprimer une sous-tâche existante', async () => {
      const subtaskId = 'subtask-1';
      const existingSubtask = {
        id: subtaskId,
        title: 'Sous-tâche à supprimer',
        status: 'completed',
        task_id: 'task-1',
        task: { id: 'task-1', user_id: 'user-1' }
      };

      mockPrismaService.subtask.findUnique.mockResolvedValue(existingSubtask);
      mockPrismaService.subtask.delete.mockResolvedValue(existingSubtask);
      mockPrismaService.task.findUnique.mockResolvedValue({
        id: 'task-1',
        subtasks: []
      });
      mockPrismaService.task.update.mockResolvedValue({});

      const result = await service.delete(subtaskId);

      expect(mockPrismaService.subtask.delete).toHaveBeenCalledWith({
        where: { id: subtaskId },
        include: {
          task: {
            include: {
              user: true,
            },
          },
        },
      });
      expect(result).toEqual(existingSubtask);
    });

    it('devrait lever NotFoundException si sous-tâche non trouvée', async () => {
      const subtaskId = 'subtask-999';

      mockPrismaService.subtask.findUnique.mockResolvedValue(null);

      await expect(service.delete(subtaskId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('toggleStatus', () => {
    it('devrait basculer le statut d\'une sous-tâche de pending à completed', async () => {
      const subtaskId = 'subtask-1';

      const existingSubtask = {
        id: subtaskId,
        title: 'Sous-tâche test',
        status: 'pending',
        task_id: 'task-1',
        task: { id: 'task-1', user_id: 'user-1' }
      };

      const toggledSubtask = {
        ...existingSubtask,
        status: 'completed'
      };

      mockPrismaService.subtask.findUnique
        .mockResolvedValueOnce(existingSubtask)
        .mockResolvedValueOnce(existingSubtask);
      
      mockPrismaService.subtask.update.mockResolvedValue(toggledSubtask);
      mockPrismaService.task.findUnique.mockResolvedValue({
        id: 'task-1',
        subtasks: [toggledSubtask]
      });
      mockPrismaService.task.update.mockResolvedValue({});

      const result = await service.toggleStatus(subtaskId);

      expect(mockPrismaService.subtask.update).toHaveBeenCalledWith({
        where: { id: subtaskId },
        data: { status: 'completed' },
        include: {
          task: {
            include: {
              user: true,
            },
          },
        },
      });
      expect(result).toEqual(toggledSubtask);
    });

    it('devrait lever NotFoundException si sous-tâche non trouvée', async () => {
      const subtaskId = 'subtask-999';

      mockPrismaService.subtask.findUnique.mockResolvedValue(null);

      await expect(service.toggleStatus(subtaskId)).rejects.toThrow(NotFoundException);
    });
  });
}); 