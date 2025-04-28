import { Test, type TestingModule } from '@nestjs/testing';
import { OrientationService } from './orientation.service';
import { PrismaService } from '../prisma/prisma.service';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('OrientationService', () => {
  let service: OrientationService;
  let prisma: PrismaService;

  const mockPrismaService = {
    orientation: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  };

  beforeEach(async () => {
    prisma = mockPrismaService as any;
    service = new OrientationService(prisma);

    // Réinitialiser les mocks avant chaque test
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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
      mockPrismaService.orientation.findMany.mockResolvedValue(result);

      expect(await service.findAll()).toBe(result);
      expect(mockPrismaService.orientation.findMany).toHaveBeenCalled();
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
      mockPrismaService.orientation.findUnique.mockResolvedValue(result);

      expect(await service.findOne('1')).toBe(result);
      expect(mockPrismaService.orientation.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });

  describe('create', () => {
    it('should create a new orientation', async () => {
      const createDto = {
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
      mockPrismaService.orientation.create.mockResolvedValue(result);

      expect(await service.create(createDto)).toBe(result);
      expect(mockPrismaService.orientation.create).toHaveBeenCalledWith({
        data: createDto,
      });
    });
  });

  describe('update', () => {
    it('should update an orientation', async () => {
      const updateDto = {
        description: 'Orientation mise à jour'
      };
      const result = {
        id: '3',
        type: 'Professionnelle',
        description: 'Orientation mise à jour',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockPrismaService.orientation.update.mockResolvedValue(result);

      expect(await service.update('3', updateDto)).toBe(result);
      expect(mockPrismaService.orientation.update).toHaveBeenCalledWith({
        where: { id: '3' },
        data: updateDto,
      });
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
      mockPrismaService.orientation.delete.mockResolvedValue(result);

      expect(await service.delete('1')).toBe(result);
      expect(mockPrismaService.orientation.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });
}); 