import { Test, TestingModule } from '@nestjs/testing';
import { ExitReasonService } from './exit-reason.service';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { describe, expect, it, beforeEach, vi } from 'vitest';

describe('ExitReasonService', () => {
  let service: ExitReasonService;

  const mockExitReason = {
    id: 'exit-reason-id',
    reason: 'Fin de formation',
  };

  const prismaMock = {
    exitReason: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  };

  beforeEach(async () => {
    service = new ExitReasonService(prismaMock as unknown as PrismaService);

    // Réinitialisation des mocks à chaque test
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('devrait retourner toutes les raisons de sortie', async () => {
      prismaMock.exitReason.findMany.mockResolvedValue([mockExitReason]);

      const result = await service.findAll();

      expect(prismaMock.exitReason.findMany).toHaveBeenCalled();
      expect(result).toEqual([mockExitReason]);
    });
  });

  describe('findOne', () => {
    it('devrait retourner une raison de sortie par son id', async () => {
      prismaMock.exitReason.findUnique.mockResolvedValue(mockExitReason);

      const result = await service.findOne('exit-reason-id');

      expect(prismaMock.exitReason.findUnique).toHaveBeenCalledWith({
        where: { id: 'exit-reason-id' },
      });
      expect(result).toEqual(mockExitReason);
    });

    it("devrait retourner null si la raison de sortie n'existe pas", async () => {
      prismaMock.exitReason.findUnique.mockResolvedValue(null);

      const result = await service.findOne('nonexistent-id');

      expect(prismaMock.exitReason.findUnique).toHaveBeenCalledWith({
        where: { id: 'nonexistent-id' },
      });
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('devrait créer une nouvelle raison de sortie', async () => {
      const createData: Prisma.ExitReasonCreateInput = {
        reason: 'Fin de formation',
      };

      prismaMock.exitReason.create.mockResolvedValue(mockExitReason);

      const result = await service.create(createData);

      expect(prismaMock.exitReason.create).toHaveBeenCalledWith({
        data: createData,
      });
      expect(result).toEqual(mockExitReason);
    });
  });

  describe('update', () => {
    it('devrait mettre à jour une raison de sortie', async () => {
      const updateData: Prisma.ExitReasonUpdateInput = {
        reason: 'Obtention du diplôme',
      };

      const updatedExitReason = {
        ...mockExitReason,
        reason: 'Obtention du diplôme',
      };

      prismaMock.exitReason.update.mockResolvedValue(updatedExitReason);

      const result = await service.update('exit-reason-id', updateData);

      expect(prismaMock.exitReason.update).toHaveBeenCalledWith({
        where: { id: 'exit-reason-id' },
        data: updateData,
      });
      expect(result.reason).toBe('Obtention du diplôme');
    });
  });

  describe('delete', () => {
    it('devrait supprimer une raison de sortie', async () => {
      prismaMock.exitReason.delete.mockResolvedValue(mockExitReason);

      const result = await service.delete('exit-reason-id');

      expect(prismaMock.exitReason.delete).toHaveBeenCalledWith({
        where: { id: 'exit-reason-id' },
      });
      expect(result).toEqual(mockExitReason);
    });
  });
});
