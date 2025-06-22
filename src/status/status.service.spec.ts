import { Test, type TestingModule } from '@nestjs/testing';
import { StatusService } from './status.service';
import { PrismaService } from '../prisma/prisma.service';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('StatusService', () => {
  let service: StatusService;
  let prisma: PrismaService;

  const mockPrismaService = {
    status: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  };

  beforeEach(async () => {
    prisma = mockPrismaService as any;
    service = new StatusService(prisma);

    // Réinitialiser les mocks avant chaque test
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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
      mockPrismaService.status.findMany.mockResolvedValue(result);

      expect(await service.findAll()).toBe(result);
      expect(mockPrismaService.status.findMany).toHaveBeenCalled();
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
      mockPrismaService.status.findUnique.mockResolvedValue(result);

      expect(await service.findOne('1')).toBe(result);
      expect(mockPrismaService.status.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });

  describe('create', () => {
    it('should create a new status', async () => {
      const createDto = {
        label: 'Inactif',
      };
      const result = {
        id: '2',
        label: 'Inactif',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockPrismaService.status.create.mockResolvedValue(result);

      expect(await service.create(createDto)).toBe(result);
      expect(mockPrismaService.status.create).toHaveBeenCalledWith({
        data: createDto,
      });
    });
  });

  describe('update', () => {
    it('should update a status', async () => {
      const updateDto = {
        label: 'En attente',
      };
      const result = {
        id: '3',
        label: 'En attente',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockPrismaService.status.update.mockResolvedValue(result);

      expect(await service.update('3', updateDto)).toBe(result);
      expect(mockPrismaService.status.update).toHaveBeenCalledWith({
        where: { id: '3' },
        data: updateDto,
      });
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
      mockPrismaService.status.delete.mockResolvedValue(result);

      expect(await service.delete('1')).toBe(result);
      expect(mockPrismaService.status.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });
});
