import { Test, type TestingModule } from '@nestjs/testing';
import { NationalityService } from './nationality.service';
import { PrismaService } from '../prisma/prisma.service';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('NationalityService', () => {
  let service: NationalityService;
  let prisma: PrismaService;

  const mockPrismaService = {
    nationality: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  };

  beforeEach(async () => {
    prisma = mockPrismaService as any;
    service = new NationalityService(prisma);

    // Réinitialiser les mocks avant chaque test
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of nationalities', async () => {
      const result = [
        {
          id: '1',
          label: 'Française',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      mockPrismaService.nationality.findMany.mockResolvedValue(result);

      expect(await service.findAll()).toBe(result);
      expect(mockPrismaService.nationality.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single nationality', async () => {
      const result = {
        id: '1',
        label: 'Française',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockPrismaService.nationality.findUnique.mockResolvedValue(result);

      expect(await service.findOne('1')).toBe(result);
      expect(mockPrismaService.nationality.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });

  describe('create', () => {
    it('should create a new nationality', async () => {
      const createDto = {
        label: 'Espagnole',
      };
      const result = {
        id: '2',
        label: 'Espagnole',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockPrismaService.nationality.create.mockResolvedValue(result);

      expect(await service.create(createDto)).toBe(result);
      expect(mockPrismaService.nationality.create).toHaveBeenCalledWith({
        data: createDto,
      });
    });
  });

  describe('update', () => {
    it('should update a nationality', async () => {
      const updateDto = {
        label: 'Italienne',
      };
      const result = {
        id: '3',
        label: 'Italienne',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockPrismaService.nationality.update.mockResolvedValue(result);

      expect(await service.update('3', updateDto)).toBe(result);
      expect(mockPrismaService.nationality.update).toHaveBeenCalledWith({
        where: { id: '3' },
        data: updateDto,
      });
    });
  });

  describe('delete', () => {
    it('should delete a nationality', async () => {
      const result = {
        id: '1',
        label: 'Française',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockPrismaService.nationality.delete.mockResolvedValue(result);

      expect(await service.delete('1')).toBe(result);
      expect(mockPrismaService.nationality.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });
});
