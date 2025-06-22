import { Test, type TestingModule } from '@nestjs/testing';
import { PeriodController } from './period.controller';
import { PeriodService } from './period.service';
import { CreatePeriodDto } from './dto/create-period.dto';
import { UpdatePeriodDto } from './dto/update-period.dto';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('PeriodController', () => {
  let controller: PeriodController;
  let service: PeriodService;

  const mockPeriodService = {
    findAll: vi.fn(),
    findOne: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };

  beforeEach(async () => {
    service = mockPeriodService as any;
    controller = new PeriodController(service);

    // Réinitialiser les mocks avant chaque test
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of periods', async () => {
      const result = [
        {
          id: '1',
          label: 'Semestre 1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      mockPeriodService.findAll.mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
      expect(mockPeriodService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single period', async () => {
      const result = {
        id: '1',
        label: 'Semestre 1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockPeriodService.findOne.mockResolvedValue(result);

      expect(await controller.findOne('1')).toBe(result);
      expect(mockPeriodService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('create', () => {
    it('should create a new period', async () => {
      const createDto: CreatePeriodDto = {
        label: 'Semestre 2',
        startedAt: '2023-01-01T00:00:00.000Z',
        endedAt: '2023-06-30T00:00:00.000Z',
        actual_period: false,
      };
      const result = {
        id: '2',
        label: 'Semestre 2',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockPeriodService.create.mockResolvedValue(result);

      expect(await controller.create(createDto)).toBe(result);
      expect(mockPeriodService.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('update', () => {
    it('should update a period', async () => {
      const updateDto: UpdatePeriodDto = {
        label: 'Trimestre 1',
      };
      const result = {
        id: '3',
        label: 'Trimestre 1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockPeriodService.update.mockResolvedValue(result);

      expect(await controller.update('3', updateDto)).toBe(result);
      expect(mockPeriodService.update).toHaveBeenCalledWith('3', updateDto);
    });
  });

  describe('delete', () => {
    it('should delete a period', async () => {
      const result = {
        id: '1',
        label: 'Semestre 1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockPeriodService.delete.mockResolvedValue(result);

      expect(await controller.delete('1')).toBe(result);
      expect(mockPeriodService.delete).toHaveBeenCalledWith('1');
    });
  });
});
