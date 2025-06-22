import { Test, type TestingModule } from '@nestjs/testing';
import { FrenchLevelService } from './french-level.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('FrenchLevelService', () => {
  let service: FrenchLevelService;
  let prismaService: any;

  const mockFrenchLevel = {
    id: '1',
    code: 'A1',
    description: 'Niveau débutant',
  };

  beforeEach(async () => {
    prismaService = {
      frenchLevel: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
    };

    service = new FrenchLevelService(prismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of french levels', async () => {
      const mockFrenchLevels = [mockFrenchLevel];
      prismaService.frenchLevel.findMany.mockResolvedValue(mockFrenchLevels);

      const result = await service.findAll();

      expect(result).toEqual(mockFrenchLevels);
      expect(prismaService.frenchLevel.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single french level', async () => {
      prismaService.frenchLevel.findUnique.mockResolvedValue(mockFrenchLevel);

      const result = await service.findOne('1');

      expect(result).toEqual(mockFrenchLevel);
      expect(prismaService.frenchLevel.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should return null when french level is not found', async () => {
      prismaService.frenchLevel.findUnique.mockResolvedValue(null);

      const result = await service.findOne('999');

      expect(result).toBeNull();
      expect(prismaService.frenchLevel.findUnique).toHaveBeenCalledWith({
        where: { id: '999' },
      });
    });
  });

  describe('create', () => {
    it('should create a new french level', async () => {
      const createDto = {
        code: 'A1',
        description: 'Niveau débutant',
      };

      prismaService.frenchLevel.create.mockResolvedValue(mockFrenchLevel);

      const result = await service.create(createDto);

      expect(result).toEqual(mockFrenchLevel);
      expect(prismaService.frenchLevel.create).toHaveBeenCalledWith({
        data: createDto,
      });
    });
  });

  describe('update', () => {
    it('should update a french level', async () => {
      const updateDto = {
        description: 'Niveau débutant mis à jour',
      };

      const updatedFrenchLevel = {
        ...mockFrenchLevel,
        description: 'Niveau débutant mis à jour',
      };

      prismaService.frenchLevel.update.mockResolvedValue(updatedFrenchLevel);

      const result = await service.update('1', updateDto);

      expect(result).toEqual(updatedFrenchLevel);
      expect(prismaService.frenchLevel.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: updateDto,
      });
    });
  });

  describe('delete', () => {
    it('should delete a french level', async () => {
      prismaService.frenchLevel.delete.mockResolvedValue(mockFrenchLevel);

      const result = await service.delete('1');

      expect(result).toEqual(mockFrenchLevel);
      expect(prismaService.frenchLevel.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });
});
