import { Test, type TestingModule } from '@nestjs/testing';
import { PeriodService } from './period.service';
import { PrismaService } from '../prisma/prisma.service';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('PeriodService', () => {
  let service: PeriodService;
  let prisma: PrismaService;

  const mockPrismaService = {
    period: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  };

  beforeEach(async () => {
    prisma = mockPrismaService as any;
    service = new PeriodService(prisma);

    // Réinitialiser les mocks avant chaque test
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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
      mockPrismaService.period.findMany.mockResolvedValue(result);

      expect(await service.findAll()).toBe(result);
      expect(mockPrismaService.period.findMany).toHaveBeenCalled();
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
      mockPrismaService.period.findUnique.mockResolvedValue(result);

      expect(await service.findOne('1')).toBe(result);
      expect(mockPrismaService.period.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });

  describe('create', () => {
    it('should create a new period', async () => {
      const createDto = {
        label: 'Semestre 2',
        startedAt: '2023-01-01T00:00:00.000Z',
        endedAt: '2023-06-30T00:00:00.000Z',
        actual_period: false
      };
      const result = {
        id: '2',
        label: 'Semestre 2',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockPrismaService.period.create.mockResolvedValue(result);

      expect(await service.create(createDto)).toBe(result);
      expect(mockPrismaService.period.create).toHaveBeenCalledWith({
        data: createDto,
      });
    });
  });

  describe('update', () => {
    it('should update a period', async () => {
      const updateDto = {
        label: 'Trimestre 1',
      };
      const result = {
        id: '3',
        label: 'Trimestre 1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockPrismaService.period.update.mockResolvedValue(result);

      expect(await service.update('3', updateDto)).toBe(result);
      expect(mockPrismaService.period.update).toHaveBeenCalledWith({
        where: { id: '3' },
        data: updateDto,
      });
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
      mockPrismaService.period.delete.mockResolvedValue(result);

      expect(await service.delete('1')).toBe(result);
      expect(mockPrismaService.period.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });
}); 