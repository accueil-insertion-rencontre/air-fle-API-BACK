import { Test, type TestingModule } from '@nestjs/testing';
import { GenderService } from './gender.service';
import { PrismaService } from '../prisma/prisma.service';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('GenderService', () => {
  let service: GenderService;
  let prisma: PrismaService;

  const mockPrismaService = {
    gender: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  };

  beforeEach(async () => {
    prisma = mockPrismaService as any;
    service = new GenderService(prisma);

    // Réinitialiser les mocks avant chaque test
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of genders', async () => {
      const result = [
        {
          id: '1',
          label: 'Masculin',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      mockPrismaService.gender.findMany.mockResolvedValue(result);

      expect(await service.findAll()).toBe(result);
      expect(mockPrismaService.gender.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single gender', async () => {
      const result = {
        id: '1',
        label: 'Masculin',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockPrismaService.gender.findUnique.mockResolvedValue(result);

      expect(await service.findOne('1')).toBe(result);
      expect(mockPrismaService.gender.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });

  describe('create', () => {
    it('should create a new gender', async () => {
      const createDto = {
        label: 'Féminin',
      };
      const result = {
        id: '2',
        label: 'Féminin',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockPrismaService.gender.create.mockResolvedValue(result);

      expect(await service.create(createDto)).toBe(result);
      expect(mockPrismaService.gender.create).toHaveBeenCalledWith({
        data: createDto,
      });
    });
  });

  describe('update', () => {
    it('should update a gender', async () => {
      const updateDto = {
        label: 'Non-binaire',
      };
      const result = {
        id: '3',
        label: 'Non-binaire',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockPrismaService.gender.update.mockResolvedValue(result);

      expect(await service.update('3', updateDto)).toBe(result);
      expect(mockPrismaService.gender.update).toHaveBeenCalledWith({
        where: { id: '3' },
        data: updateDto,
      });
    });
  });

  describe('delete', () => {
    it('should delete a gender', async () => {
      const result = {
        id: '1',
        label: 'Masculin',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockPrismaService.gender.delete.mockResolvedValue(result);

      expect(await service.delete('1')).toBe(result);
      expect(mockPrismaService.gender.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });
});
