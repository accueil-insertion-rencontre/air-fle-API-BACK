import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ContinuationService } from './continuation.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('ContinuationService', () => {
  let continuationService: ContinuationService;
  let prismaService: any;

  const mockStudent = {
    id: 'student-id',
    firstname: 'Jean',
    lastname: 'Dupont',
    // Autres propriétés d'étudiant omises pour la clarté
  };

  const mockContinuation = {
    id: 'continuation-id',
    temporality: 'Semestre 1',
    commentary: 'Continuation pour le premier semestre',
    student_id: 'student-id',
    student: mockStudent,
  };

  // Créer un mock pour PrismaService
  beforeEach(() => {
    prismaService = {
      continuation: {
        create: vi.fn(),
        findMany: vi.fn(),
        findUnique: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
    };

    continuationService = new ContinuationService(prismaService);
  });

  describe('findAll', () => {
    it('devrait retourner toutes les continuations', async () => {
      prismaService.continuation.findMany.mockResolvedValue([mockContinuation]);

      const result = await continuationService.findAll();

      expect(prismaService.continuation.findMany).toHaveBeenCalledWith({
        include: {
          student: true,
        },
      });
      expect(result).toEqual([mockContinuation]);
    });
  });

  describe('findOne', () => {
    it('devrait trouver une continuation par ID', async () => {
      prismaService.continuation.findUnique.mockResolvedValue(mockContinuation);

      const result = await continuationService.findOne('continuation-id');

      expect(prismaService.continuation.findUnique).toHaveBeenCalledWith({
        where: { id: 'continuation-id' },
        include: {
          student: true,
        },
      });
      expect(result).toEqual(mockContinuation);
    });

    it("devrait retourner null si aucune continuation n'est trouvée", async () => {
      prismaService.continuation.findUnique.mockResolvedValue(null);

      const result = await continuationService.findOne('non-existent-id');

      expect(result).toBeNull();
    });
  });

  describe('findByStudent', () => {
    it("devrait trouver une continuation par ID d'étudiant", async () => {
      prismaService.continuation.findUnique.mockResolvedValue(mockContinuation);

      const result = await continuationService.findByStudent('student-id');

      expect(prismaService.continuation.findUnique).toHaveBeenCalledWith({
        where: { student_id: 'student-id' },
        include: {
          student: true,
        },
      });
      expect(result).toEqual(mockContinuation);
    });

    it("devrait retourner null si aucune continuation n'est trouvée pour l'étudiant", async () => {
      prismaService.continuation.findUnique.mockResolvedValue(null);

      const result = await continuationService.findByStudent(
        'non-existent-student-id',
      );

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('devrait créer une nouvelle continuation', async () => {
      const continuationData = {
        temporality: 'Semestre 1',
        commentary: 'Continuation pour le premier semestre',
        student: {
          connect: { id: 'student-id' },
        },
      };

      prismaService.continuation.create.mockResolvedValue(mockContinuation);

      const result = await continuationService.create(continuationData);

      expect(prismaService.continuation.create).toHaveBeenCalledWith({
        data: continuationData,
        include: {
          student: true,
        },
      });
      expect(result).toEqual(mockContinuation);
    });

    it('devrait gérer les erreurs lors de la création', async () => {
      const continuationData = {
        student: {
          connect: { id: 'non-existent-id' },
        },
      };

      const dbError = new Error('Required field missing');
      prismaService.continuation.create.mockRejectedValue(dbError);

      await expect(
        continuationService.create(continuationData),
      ).rejects.toThrow(Error);
    });
  });

  describe('update', () => {
    it('devrait mettre à jour une continuation', async () => {
      const updateData = {
        temporality: 'Semestre 2',
        commentary: 'Mise à jour commentaire',
      };

      const updatedContinuation = {
        ...mockContinuation,
        temporality: 'Semestre 2',
        commentary: 'Mise à jour commentaire',
      };

      prismaService.continuation.update.mockResolvedValue(updatedContinuation);

      const result = await continuationService.update(
        'continuation-id',
        updateData,
      );

      expect(prismaService.continuation.update).toHaveBeenCalledWith({
        where: { id: 'continuation-id' },
        data: updateData,
        include: {
          student: true,
        },
      });
      expect(result.temporality).toBe('Semestre 2');
      expect(result.commentary).toBe('Mise à jour commentaire');
    });

    it("devrait gérer les erreurs si la continuation n'existe pas", async () => {
      const updateData = {
        temporality: 'Semestre 2',
      };

      const error = new Error('Continuation not found');
      (error as any).code = 'P2025';
      prismaService.continuation.update.mockRejectedValue(error);

      await expect(
        continuationService.update('non-existent-id', updateData),
      ).rejects.toThrow(Error);
    });
  });

  describe('delete', () => {
    it('devrait supprimer une continuation', async () => {
      prismaService.continuation.delete.mockResolvedValue(mockContinuation);

      const result = await continuationService.delete('continuation-id');

      expect(prismaService.continuation.delete).toHaveBeenCalledWith({
        where: { id: 'continuation-id' },
      });
      expect(result).toEqual(mockContinuation);
    });

    it("devrait gérer les erreurs si la continuation n'existe pas", async () => {
      const error = new Error('Continuation not found');
      (error as any).code = 'P2025';
      prismaService.continuation.delete.mockRejectedValue(error);

      await expect(
        continuationService.delete('non-existent-id'),
      ).rejects.toThrow(Error);
    });
  });
});
