import { Test, type TestingModule } from '@nestjs/testing';
import { OrientationController } from './orientation.controller';
import { OrientationService } from './orientation.service';
import { CreateOrientationDto } from './dto/create-orientation.dto';
import { UpdateOrientationDto } from './dto/update-orientation.dto';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('OrientationController', () => {
  let controller: OrientationController;
  let service: OrientationService;

  const mockOrientationService = {
    findAll: vi.fn(),
    findOne: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };

  beforeEach(async () => {
    service = mockOrientationService as any;
    controller = new OrientationController(service);

    // Réinitialiser les mocks avant chaque test
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of orientations', async () => {
      const result = [
        {
          id: '1',
          type: 'Professionnelle',
          description: 'Orientation vers une formation professionnelle',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      mockOrientationService.findAll.mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
      expect(mockOrientationService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single orientation', async () => {
      const result = {
        id: '1',
        type: 'Professionnelle',
        description: 'Orientation vers une formation professionnelle',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockOrientationService.findOne.mockResolvedValue(result);

      expect(await controller.findOne('1')).toBe(result);
      expect(mockOrientationService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('create', () => {
    it('should create a new orientation', async () => {
      const createDto: CreateOrientationDto = {
        type: 'Académique',
        description: 'Orientation vers une formation académique'
      };
      const result = {
        id: '2',
        type: 'Académique',
        description: 'Orientation vers une formation académique',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockOrientationService.create.mockResolvedValue(result);

      expect(await controller.create(createDto)).toBe(result);
      expect(mockOrientationService.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('update', () => {
    it('should update an orientation', async () => {
      const updateDto: UpdateOrientationDto = {
        description: 'Orientation mise à jour'
      };
      const result = {
        id: '3',
        type: 'Professionnelle',
        description: 'Orientation mise à jour',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockOrientationService.update.mockResolvedValue(result);

      expect(await controller.update('3', updateDto)).toBe(result);
      expect(mockOrientationService.update).toHaveBeenCalledWith('3', updateDto);
    });
  });

  describe('delete', () => {
    it('should delete an orientation', async () => {
      const result = {
        id: '1',
        type: 'Professionnelle',
        description: 'Orientation vers une formation professionnelle',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockOrientationService.delete.mockResolvedValue(result);

      expect(await controller.delete('1')).toBe(result);
      expect(mockOrientationService.delete).toHaveBeenCalledWith('1');
    });
  });
}); 