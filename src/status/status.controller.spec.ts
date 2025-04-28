import { Test, type TestingModule } from '@nestjs/testing';
import { StatusController } from './status.controller';
import { StatusService } from './status.service';
import { CreateStatusDto } from './dto/create-status.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('StatusController', () => {
  let controller: StatusController;
  let service: StatusService;

  const mockStatusService = {
    findAll: vi.fn(),
    findOne: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };

  beforeEach(async () => {
    service = mockStatusService as any;
    controller = new StatusController(service);

    // Réinitialiser les mocks avant chaque test
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of statuses', async () => {
      const result = [
        {
          id: '1',
          label: 'Actif',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      mockStatusService.findAll.mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
      expect(mockStatusService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single status', async () => {
      const result = {
        id: '1',
        label: 'Actif',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockStatusService.findOne.mockResolvedValue(result);

      expect(await controller.findOne('1')).toBe(result);
      expect(mockStatusService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('create', () => {
    it('should create a new status', async () => {
      const createDto: CreateStatusDto = {
        label: 'Inactif',
      };
      const result = {
        id: '2',
        label: 'Inactif',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockStatusService.create.mockResolvedValue(result);

      expect(await controller.create(createDto)).toBe(result);
      expect(mockStatusService.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('update', () => {
    it('should update a status', async () => {
      const updateDto: UpdateStatusDto = {
        label: 'En attente',
      };
      const result = {
        id: '3',
        label: 'En attente',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockStatusService.update.mockResolvedValue(result);

      expect(await controller.update('3', updateDto)).toBe(result);
      expect(mockStatusService.update).toHaveBeenCalledWith('3', updateDto);
    });
  });

  describe('delete', () => {
    it('should delete a status', async () => {
      const result = {
        id: '1',
        label: 'Actif',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockStatusService.delete.mockResolvedValue(result);

      expect(await controller.delete('1')).toBe(result);
      expect(mockStatusService.delete).toHaveBeenCalledWith('1');
    });
  });
}); 