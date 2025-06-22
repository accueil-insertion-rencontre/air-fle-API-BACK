import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { SubtaskService } from './subtask.service';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('TaskController', () => {
  let controller: TaskController;
  let mockTaskService: any;
  let mockSubtaskService: any;

  beforeEach(() => {
    mockTaskService = {
      create: vi.fn(),
      getAllTasksWithStats: vi.fn(),
      findOne: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      getStatistics: vi.fn(),
      findAll: vi.fn(),
    };

    mockSubtaskService = {
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      findOne: vi.fn(),
      findAll: vi.fn(),
      toggleStatus: vi.fn(),
    };

    // Créer le controller directement avec les mocks
    controller = new TaskController(
      mockTaskService as TaskService,
      mockSubtaskService as SubtaskService,
    );
  });

  it('devrait être défini', () => {
    expect(controller).toBeDefined();
  });

  describe('createTask', () => {
    it('devrait créer une tâche avec succès', async () => {
      const createTaskDto = {
        title: 'Nouvelle tâche',
        description: 'Description de la tâche',
        priority: 'HIGH' as any,
      };
      const userId = 'user-1';
      const expectedTask = {
        id: 'task-1',
        ...createTaskDto,
        user_id: userId,
        status: 'pending',
      };

      mockTaskService.create.mockResolvedValue(expectedTask);

      const result = await controller.createTask(
        { user: { id: userId } } as any,
        createTaskDto,
      );

      expect(mockTaskService.create).toHaveBeenCalledWith(
        userId,
        createTaskDto,
      );
      expect(result).toEqual(expectedTask);
    });
  });

  describe('findAllTasks', () => {
    it('devrait retourner toutes les tâches avec statistiques', async () => {
      const userId = 'user-1';
      const expectedResult = {
        tasks: [
          { id: 'task-1', title: 'Tâche 1', status: 'pending' },
          { id: 'task-2', title: 'Tâche 2', status: 'completed' },
        ],
        globalStats: {
          totalTasks: 2,
          completedTasks: 1,
          inProgressTasks: 0,
          pendingTasks: 1,
          completionPercentage: 50,
        },
      };

      mockTaskService.getAllTasksWithStats.mockResolvedValue(expectedResult);

      const result = await controller.findAllTasks({
        user: { id: userId },
      } as any);

      expect(mockTaskService.getAllTasksWithStats).toHaveBeenCalledWith(userId);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOneTask', () => {
    it('devrait retourner une tâche spécifique', async () => {
      const taskId = 'task-1';
      const userId = 'user-1';
      const expectedTask = {
        id: taskId,
        title: 'Tâche spécifique',
        user_id: userId,
        subtasks: [],
      };

      mockTaskService.findOne.mockResolvedValue(expectedTask);

      const result = await controller.findOneTask(
        { user: { id: userId } } as any,
        taskId,
      );

      expect(mockTaskService.findOne).toHaveBeenCalledWith(taskId);
      expect(result).toEqual(expectedTask);
    });
  });

  describe('updateTask', () => {
    it('devrait mettre à jour une tâche', async () => {
      const taskId = 'task-1';
      const userId = 'user-1';
      const updateTaskDto = {
        title: 'Titre mis à jour',
        status: 'completed' as any,
      };
      const existingTask = {
        id: taskId,
        title: 'Ancien titre',
        user_id: userId,
        subtasks: [],
      };
      const updatedTask = {
        ...existingTask,
        ...updateTaskDto,
      };

      mockTaskService.findOne.mockResolvedValue(existingTask);
      mockTaskService.update.mockResolvedValue(updatedTask);

      const result = await controller.updateTask(
        { user: { id: userId } } as any,
        taskId,
        updateTaskDto,
      );

      expect(mockTaskService.findOne).toHaveBeenCalledWith(taskId);
      expect(mockTaskService.update).toHaveBeenCalledWith(
        taskId,
        updateTaskDto,
      );
      expect(result).toEqual(updatedTask);
    });
  });

  describe('deleteTask', () => {
    it('devrait supprimer une tâche', async () => {
      const taskId = 'task-1';
      const userId = 'user-1';
      const existingTask = {
        id: taskId,
        title: 'Tâche à supprimer',
        user_id: userId,
        subtasks: [],
      };

      mockTaskService.findOne.mockResolvedValue(existingTask);
      mockTaskService.delete.mockResolvedValue(existingTask);

      const result = await controller.deleteTask(
        { user: { id: userId } } as any,
        taskId,
      );

      expect(mockTaskService.findOne).toHaveBeenCalledWith(taskId);
      expect(mockTaskService.delete).toHaveBeenCalledWith(taskId);
      expect(result).toEqual(existingTask);
    });
  });

  describe('createSubtask', () => {
    it('devrait créer une sous-tâche', async () => {
      const taskId = 'task-1';
      const userId = 'user-1';
      const createSubtaskDto = {
        title: 'Nouvelle sous-tâche',
        description: 'Description sous-tâche',
      };
      const parentTask = {
        id: taskId,
        user_id: userId,
        subtasks: [],
      };
      const expectedSubtask = {
        id: 'subtask-1',
        ...createSubtaskDto,
        task_id: taskId,
        status: 'pending',
      };

      mockTaskService.findOne.mockResolvedValue(parentTask);
      mockSubtaskService.create.mockResolvedValue(expectedSubtask);

      const result = await controller.createSubtask(
        { user: { id: userId } } as any,
        taskId,
        createSubtaskDto,
      );

      expect(mockTaskService.findOne).toHaveBeenCalledWith(taskId);
      expect(mockSubtaskService.create).toHaveBeenCalledWith(
        taskId,
        createSubtaskDto,
      );
      expect(result).toEqual(expectedSubtask);
    });
  });

  describe('findAllSubtasks', () => {
    it("devrait retourner toutes les sous-tâches d'une tâche", async () => {
      const taskId = 'task-1';
      const userId = 'user-1';
      const parentTask = {
        id: taskId,
        user_id: userId,
        subtasks: [],
      };
      const expectedSubtasks = [
        {
          id: 'sub-1',
          title: 'Sous-tâche 1',
          status: 'pending',
          task_id: taskId,
        },
        {
          id: 'sub-2',
          title: 'Sous-tâche 2',
          status: 'completed',
          task_id: taskId,
        },
      ];

      mockTaskService.findOne.mockResolvedValue(parentTask);
      mockSubtaskService.findAll.mockResolvedValue(expectedSubtasks);

      const result = await controller.findAllSubtasks(
        { user: { id: userId } } as any,
        taskId,
      );

      expect(mockTaskService.findOne).toHaveBeenCalledWith(taskId);
      expect(mockSubtaskService.findAll).toHaveBeenCalledWith(taskId);
      expect(result).toEqual(expectedSubtasks);
    });
  });

  describe('updateSubtask', () => {
    it('devrait mettre à jour une sous-tâche', async () => {
      const subtaskId = 'subtask-1';
      const userId = 'user-1';
      const updateSubtaskDto = {
        title: 'Sous-tâche mise à jour',
        status: 'completed' as any,
      };
      const existingSubtask = {
        id: subtaskId,
        title: 'Ancienne sous-tâche',
        status: 'pending',
        task: { user_id: userId },
      };
      const updatedSubtask = {
        ...existingSubtask,
        ...updateSubtaskDto,
      };

      mockSubtaskService.findOne.mockResolvedValue(existingSubtask);
      mockSubtaskService.update.mockResolvedValue(updatedSubtask);

      const result = await controller.updateSubtask(
        { user: { id: userId } } as any,
        subtaskId,
        updateSubtaskDto,
      );

      expect(mockSubtaskService.findOne).toHaveBeenCalledWith(subtaskId);
      expect(mockSubtaskService.update).toHaveBeenCalledWith(
        subtaskId,
        updateSubtaskDto,
      );
      expect(result).toEqual(updatedSubtask);
    });
  });

  describe('toggleSubtaskStatus', () => {
    it("devrait basculer le statut d'une sous-tâche", async () => {
      const subtaskId = 'subtask-1';
      const userId = 'user-1';
      const existingSubtask = {
        id: subtaskId,
        title: 'Sous-tâche test',
        status: 'pending',
        task: { user_id: userId },
      };
      const toggledSubtask = {
        ...existingSubtask,
        status: 'completed',
      };

      mockSubtaskService.findOne.mockResolvedValue(existingSubtask);
      mockSubtaskService.toggleStatus.mockResolvedValue(toggledSubtask);

      const result = await controller.toggleSubtaskStatus(
        { user: { id: userId } } as any,
        subtaskId,
      );

      expect(mockSubtaskService.findOne).toHaveBeenCalledWith(subtaskId);
      expect(mockSubtaskService.toggleStatus).toHaveBeenCalledWith(subtaskId);
      expect(result).toEqual(toggledSubtask);
    });
  });

  describe('deleteSubtask', () => {
    it('devrait supprimer une sous-tâche', async () => {
      const subtaskId = 'subtask-1';
      const userId = 'user-1';
      const existingSubtask = {
        id: subtaskId,
        title: 'Sous-tâche à supprimer',
        status: 'completed',
        task: { user_id: userId },
      };

      mockSubtaskService.findOne.mockResolvedValue(existingSubtask);
      mockSubtaskService.delete.mockResolvedValue(existingSubtask);

      const result = await controller.deleteSubtask(
        { user: { id: userId } } as any,
        subtaskId,
      );

      expect(mockSubtaskService.findOne).toHaveBeenCalledWith(subtaskId);
      expect(mockSubtaskService.delete).toHaveBeenCalledWith(subtaskId);
      expect(result).toEqual(existingSubtask);
    });
  });

  describe('getTaskStatistics', () => {
    it("devrait retourner les statistiques d'une tâche", async () => {
      const taskId = 'task-1';
      const userId = 'user-1';
      const existingTask = {
        id: taskId,
        title: 'Tâche test',
        user_id: userId,
        subtasks: [],
      };
      const expectedStats = {
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
      };

      mockTaskService.findOne.mockResolvedValue(existingTask);
      mockTaskService.getStatistics.mockResolvedValue(expectedStats);

      const result = await controller.getTaskStatistics(
        { user: { id: userId } } as any,
        taskId,
      );

      expect(mockTaskService.findOne).toHaveBeenCalledWith(taskId);
      expect(mockTaskService.getStatistics).toHaveBeenCalledWith(taskId);
      expect(result).toEqual(expectedStats);
    });
  });
});
