import { Test, type TestingModule } from '@nestjs/testing';
import { TodolistService } from './todolist.service';
import { PrismaService } from '../prisma/prisma.service';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('TodolistService', () => {
  let service: TodolistService;
  let prismaService: any;

  const mockUser = {
    id: 'user-1',
    firstname: 'John',
    lastname: 'Doe',
    email: 'john.doe@example.com',
  };

  const mockTodolist = {
    id: '1',
    title: 'Tâche test',
    description: 'Description de la tâche test',
    completionPercentage: 0,
    dueAt: new Date('2023-12-31'),
    user_id: 'user-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    user: mockUser,
  };

  beforeEach(async () => {
    prismaService = {
      todolist: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      }
    };

    service = new TodolistService(prismaService as any);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of todolist items', async () => {
      const mockTodolists = [mockTodolist];
      prismaService.todolist.findMany.mockResolvedValue(mockTodolists);

      const result = await service.findAll();
      
      expect(result).toEqual(mockTodolists);
      expect(prismaService.todolist.findMany).toHaveBeenCalledWith({
        include: { user: true }
      });
    });
  });

  describe('findOne', () => {
    it('should return a single todolist item', async () => {
      prismaService.todolist.findUnique.mockResolvedValue(mockTodolist);

      const result = await service.findOne('1');
      
      expect(result).toEqual(mockTodolist);
      expect(prismaService.todolist.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: { user: true }
      });
    });

    it('should return null when todolist item is not found', async () => {
      prismaService.todolist.findUnique.mockResolvedValue(null);

      const result = await service.findOne('999');
      
      expect(result).toBeNull();
      expect(prismaService.todolist.findUnique).toHaveBeenCalledWith({
        where: { id: '999' },
        include: { user: true }
      });
    });
  });

  describe('findByUser', () => {
    it('should return todolist items for a specific user', async () => {
      const mockTodolists = [mockTodolist];
      prismaService.todolist.findMany.mockResolvedValue(mockTodolists);

      const result = await service.findByUser('user-1');
      
      expect(result).toEqual(mockTodolists);
      expect(prismaService.todolist.findMany).toHaveBeenCalledWith({
        where: { user_id: 'user-1' },
        include: { user: true }
      });
    });
  });

  describe('create', () => {
    it('should create a new todolist item', async () => {
      const createData = {
        title: 'Nouvelle tâche',
        description: 'Description de la nouvelle tâche',
        completionPercentage: 0,
        dueAt: new Date('2023-12-31'),
        user: {
          connect: {
            id: 'user-1'
          }
        }
      };

      prismaService.todolist.create.mockResolvedValue(mockTodolist);

      const result = await service.create(createData);
      
      expect(result).toEqual(mockTodolist);
      expect(prismaService.todolist.create).toHaveBeenCalledWith({
        data: createData,
        include: { user: true }
      });
    });
  });

  describe('update', () => {
    it('should update a todolist item', async () => {
      const updateData = {
        title: 'Tâche mise à jour',
        description: 'Description mise à jour',
        completionPercentage: 50,
      };

      const updatedTodolist = {
        ...mockTodolist,
        ...updateData
      };

      prismaService.todolist.update.mockResolvedValue(updatedTodolist);

      const result = await service.update('1', updateData);
      
      expect(result).toEqual(updatedTodolist);
      expect(prismaService.todolist.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: updateData,
        include: { user: true }
      });
    });
  });

  describe('updateCompletionStatus', () => {
    it('should update completion percentage of a todolist item', async () => {
      const updatedTodolist = {
        ...mockTodolist,
        completionPercentage: 75
      };

      prismaService.todolist.update.mockResolvedValue(updatedTodolist);

      const result = await service.updateCompletionStatus('1', 75);
      
      expect(result).toEqual(updatedTodolist);
      expect(prismaService.todolist.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { completionPercentage: 75 }
      });
    });
  });

  describe('delete', () => {
    it('should delete a todolist item', async () => {
      prismaService.todolist.delete.mockResolvedValue(mockTodolist);

      const result = await service.delete('1');
      
      expect(result).toEqual(mockTodolist);
      expect(prismaService.todolist.delete).toHaveBeenCalledWith({
        where: { id: '1' }
      });
    });
  });
}); 