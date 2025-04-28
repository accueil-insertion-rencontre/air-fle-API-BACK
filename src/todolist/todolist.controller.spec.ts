import { Test, type TestingModule } from '@nestjs/testing';
import { TodolistController } from './todolist.controller';
import { TodolistService } from './todolist.service';
import { CreateTodolistDto } from './dto/create-todolist.dto';
import { UpdateTodolistDto } from './dto/update-todolist.dto';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('TodolistController', () => {
  let controller: TodolistController;
  let service: TodolistService;

  const mockUser = {
    id: 'user-1',
    firstname: 'John',
    lastname: 'Doe',
    email: 'john.doe@example.com',
    password: 'hashed_password',
    role_id: 'user-role',
    birthdate: null,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockTodolist = {
    id: '1',
    title: 'Tâche test',
    description: 'Description de la tâche test',
    completionPercentage: '0',
    dueAt: new Date('2023-12-31'),
    user_id: 'user-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    user: mockUser,
  };

  const mockTodolistService = {
    findAll: vi.fn(),
    findOne: vi.fn(),
    findByUser: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };

  beforeEach(async () => {
    service = mockTodolistService as any;
    controller = new TodolistController(service);

    // Réinitialiser les mocks avant chaque test
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all todolist items', async () => {
      const mockTodolists = [mockTodolist];
      mockTodolistService.findAll.mockResolvedValue(mockTodolists);

      expect(await controller.findAll()).toBe(mockTodolists);
      expect(mockTodolistService.findAll).toHaveBeenCalled();
    });

    it('should return todolist items filtered by userId', async () => {
      const mockTodolists = [mockTodolist];
      mockTodolistService.findByUser.mockResolvedValue(mockTodolists);

      expect(await controller.findAll('user-1')).toBe(mockTodolists);
      expect(mockTodolistService.findByUser).toHaveBeenCalledWith('user-1');
    });
  });

  describe('findOne', () => {
    it('should return a single todolist item', async () => {
      mockTodolistService.findOne.mockResolvedValue(mockTodolist);

      expect(await controller.findOne('1')).toBe(mockTodolist);
      expect(mockTodolistService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('create', () => {
    it('should create a new todolist item', async () => {
      const createDto: CreateTodolistDto = {
        title: 'Nouvelle tâche',
        description: 'Description de la nouvelle tâche',
        completionPercentage: '0',
        dueAt: '2023-12-31T00:00:00.000Z',
        user_id: 'user-1',
      };

      mockTodolistService.create.mockResolvedValue(mockTodolist);

      expect(await controller.create(createDto)).toBe(mockTodolist);
      
      // Vérification que le service a été appelé avec les données transformées
      expect(mockTodolistService.create).toHaveBeenCalledWith(expect.objectContaining({
        title: createDto.title,
        description: createDto.description,
        completionPercentage: createDto.completionPercentage,
        dueAt: createDto.dueAt,
        user: {
          connect: {
            id: createDto.user_id
          }
        }
      }));
    });
  });

  describe('update', () => {
    it('should update a todolist item', async () => {
      const updateDto: UpdateTodolistDto = {
        title: 'Tâche mise à jour',
        description: 'Description mise à jour',
        completionPercentage: '50',
      };

      const updatedTodolist = {
        ...mockTodolist,
        title: updateDto.title,
        description: updateDto.description,
        completionPercentage: updateDto.completionPercentage
      };

      mockTodolistService.update.mockResolvedValue(updatedTodolist);

      expect(await controller.update('1', updateDto)).toBe(updatedTodolist);
      
      // Le DTO est passé directement car il ne contient pas user_id
      expect(mockTodolistService.update).toHaveBeenCalledWith('1', updateDto);
    });

    it('should handle user_id in update DTO correctly', async () => {
      const updateDto: UpdateTodolistDto = {
        title: 'Tâche mise à jour',
        description: 'Description mise à jour',
        completionPercentage: '50',
        user_id: 'user-2',
      };

      const updatedTodolist = {
        ...mockTodolist,
        title: updateDto.title,
        description: updateDto.description,
        completionPercentage: updateDto.completionPercentage,
        user_id: 'user-2',
      };

      mockTodolistService.update.mockResolvedValue(updatedTodolist);

      expect(await controller.update('1', updateDto)).toBe(updatedTodolist);
      
      // Vérifier que la transformation est correcte (user_id devient une relation)
      expect(mockTodolistService.update).toHaveBeenCalledWith('1', expect.objectContaining({
        title: updateDto.title,
        description: updateDto.description,
        completionPercentage: updateDto.completionPercentage,
        user: {
          connect: {
            id: 'user-2'
          }
        }
      }));
      
      // Vérifier que user_id n'est pas présent dans les données passées
      expect(mockTodolistService.update).not.toHaveBeenCalledWith(
        '1', 
        expect.objectContaining({ user_id: 'user-2' })
      );
    });
  });

  describe('remove', () => {
    it('should delete a todolist item', async () => {
      mockTodolistService.delete.mockResolvedValue(mockTodolist);

      expect(await controller.remove('1')).toBe(mockTodolist);
      expect(mockTodolistService.delete).toHaveBeenCalledWith('1');
    });
  });
}); 