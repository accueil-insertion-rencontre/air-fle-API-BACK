import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ContinuationController } from './continuation.controller';
import { ContinuationService } from './continuation.service';
import { CreateContinuationDto } from './dto/create-continuation.dto';
import { UpdateContinuationDto } from './dto/update-continuation.dto';
import { IdParamDto } from './dto/id-param.dto';

describe('ContinuationController', () => {
  let controller: ContinuationController;
  let mockService: any;

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
    student: mockStudent
  };

  beforeEach(() => {
    mockService = {
      findAll: vi.fn().mockResolvedValue([mockContinuation]),
      findOne: vi.fn().mockResolvedValue(mockContinuation),
      findByStudent: vi.fn().mockResolvedValue(mockContinuation),
      create: vi.fn().mockResolvedValue(mockContinuation),
      update: vi.fn().mockResolvedValue(mockContinuation),
      delete: vi.fn().mockResolvedValue(mockContinuation),
    };
    controller = new ContinuationController(mockService as ContinuationService);
  });

  it('doit être défini', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('doit retourner un tableau de continuations', async () => {
      const result = await controller.findAll();
      expect(mockService.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockContinuation]);
    });
  });

  describe('findOne', () => {
    it('doit retourner une continuation par son ID', async () => {
      const params: IdParamDto = { id: 'continuation-id' };
      const result = await controller.findOne(params);
      expect(mockService.findOne).toHaveBeenCalledWith('continuation-id');
      expect(result).toEqual(mockContinuation);
    });
  });

  describe('findByStudent', () => {
    it('doit retourner une continuation par ID d\'étudiant', async () => {
      const result = await controller.findByStudent('student-id');
      expect(mockService.findByStudent).toHaveBeenCalledWith('student-id');
      expect(result).toEqual(mockContinuation);
    });
  });

  describe('create', () => {
    it('doit créer une nouvelle continuation', async () => {
      const dto: CreateContinuationDto = {
        temporality: 'Semestre 1',
        commentary: 'Continuation pour le premier semestre',
        studentId: 'student-id'
      };

      const expectedInput = {
        temporality: 'Semestre 1',
        commentary: 'Continuation pour le premier semestre',
        student: {
          connect: { id: 'student-id' }
        }
      };

      const result = await controller.create(dto);
      expect(mockService.create).toHaveBeenCalledWith(expectedInput);
      expect(result).toEqual(mockContinuation);
    });
  });

  describe('update', () => {
    it('doit mettre à jour une continuation', async () => {
      const params: IdParamDto = { id: 'continuation-id' };
      const dto: UpdateContinuationDto = {
        temporality: 'Semestre 2',
        commentary: 'Mise à jour commentaire',
        studentId: 'new-student-id'
      };

      const expectedInput = {
        temporality: 'Semestre 2',
        commentary: 'Mise à jour commentaire',
        student: {
          connect: { id: 'new-student-id' }
        }
      };

      const result = await controller.update(params, dto);
      expect(mockService.update).toHaveBeenCalledWith('continuation-id', expectedInput);
      expect(result).toEqual(mockContinuation);
    });

    it('doit mettre à jour une continuation sans changer l\'étudiant', async () => {
      const params: IdParamDto = { id: 'continuation-id' };
      const dto: UpdateContinuationDto = {
        temporality: 'Semestre 2',
        commentary: 'Mise à jour commentaire'
      };

      const expectedInput = {
        temporality: 'Semestre 2',
        commentary: 'Mise à jour commentaire'
      };

      const result = await controller.update(params, dto);
      expect(mockService.update).toHaveBeenCalledWith('continuation-id', expectedInput);
      expect(result).toEqual(mockContinuation);
    });
  });

  describe('delete', () => {
    it('doit supprimer une continuation', async () => {
      const params: IdParamDto = { id: 'continuation-id' };
      const result = await controller.delete(params);
      expect(mockService.delete).toHaveBeenCalledWith('continuation-id');
      expect(result).toEqual(mockContinuation);
    });
  });
}); 