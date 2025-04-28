import { Test, type TestingModule } from '@nestjs/testing';
import { FrenchLevelController } from './french-level.controller';
import { FrenchLevelService } from './french-level.service';
import { CreateFrenchLevelDto } from './dto/create-french-level.dto';
import { UpdateFrenchLevelDto } from './dto/update-french-level.dto';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { FrenchLevel } from '@prisma/client';

describe('FrenchLevelController', () => {
  let controller: FrenchLevelController;
  let service: FrenchLevelService;

  // Création de mocks typés pour les fonctions du service
  const mockFrenchLevelService = {
    findAll: vi.fn(),
    findOne: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };

  beforeEach(async () => {
    service = mockFrenchLevelService as any as FrenchLevelService;
    controller = new FrenchLevelController(service);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of french levels', async () => {
      const result = [
        {
          id: '1',
          code: 'A1',
          description: 'Niveau débutant',
        },
      ] as FrenchLevel[];
      mockFrenchLevelService.findAll.mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single french level', async () => {
      const result = {
        id: '1',
        code: 'A1',
        description: 'Niveau débutant',
      } as FrenchLevel;
      mockFrenchLevelService.findOne.mockResolvedValue(result);

      expect(await controller.findOne('1')).toBe(result);
      expect(service.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('create', () => {
    it('should create a new french level', async () => {
      const createDto: CreateFrenchLevelDto = {
        code: 'A1',
        description: 'Niveau débutant',
      };
      const result = {
        id: '1',
        code: 'A1',
        description: 'Niveau débutant',
      } as FrenchLevel;
      mockFrenchLevelService.create.mockResolvedValue(result);

      expect(await controller.create(createDto)).toBe(result);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('update', () => {
    it('should update a french level', async () => {
      const updateDto: UpdateFrenchLevelDto = {
        description: 'Niveau débutant mis à jour',
      };
      const result = { 
        id: '1',
        code: 'A1',
        description: 'Niveau débutant mis à jour',
      } as FrenchLevel;
      mockFrenchLevelService.update.mockResolvedValue(result);

      expect(await controller.update('1', updateDto)).toBe(result);
      expect(service.update).toHaveBeenCalledWith('1', updateDto);
    });
  });

  describe('delete', () => {
    it('should delete a french level', async () => {
      const result = {
        id: '1',
        code: 'A1',
        description: 'Niveau débutant',
      } as FrenchLevel;
      mockFrenchLevelService.delete.mockResolvedValue(result);

      expect(await controller.delete('1')).toBe(result);
      expect(service.delete).toHaveBeenCalledWith('1');
    });
  });
}); 