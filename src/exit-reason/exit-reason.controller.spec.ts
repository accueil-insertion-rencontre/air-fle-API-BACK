import { Test, TestingModule } from '@nestjs/testing';
import { ExitReasonController } from './exit-reason.controller';
import { ExitReasonService } from './exit-reason.service';
import { describe, expect, it, beforeEach, vi } from 'vitest';

describe('ExitReasonController', () => {
  let controller: ExitReasonController;
  let exitReasonService: ExitReasonService;

  const mockExitReason = {
    id: 'exit-reason-id',
    reason: 'Fin de formation',
  };

  const exitReasonServiceMock = {
    findAll: vi.fn(),
    findOne: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };

  beforeEach(async () => {
    controller = new ExitReasonController(
      exitReasonServiceMock as unknown as ExitReasonService,
    );
    exitReasonService = exitReasonServiceMock as unknown as ExitReasonService;

    // Reset les mocks après chaque test
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('devrait retourner toutes les raisons de sortie', async () => {
      exitReasonServiceMock.findAll.mockResolvedValue([mockExitReason]);

      const result = await controller.findAll();

      expect(exitReasonServiceMock.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockExitReason]);
    });
  });

  describe('findOne', () => {
    it('devrait retourner une raison de sortie par son id', async () => {
      exitReasonServiceMock.findOne.mockResolvedValue(mockExitReason);

      const result = await controller.findOne('exit-reason-id');

      expect(exitReasonServiceMock.findOne).toHaveBeenCalledWith(
        'exit-reason-id',
      );
      expect(result).toEqual(mockExitReason);
    });

    it("devrait retourner null si la raison de sortie n'existe pas", async () => {
      exitReasonServiceMock.findOne.mockResolvedValue(null);

      const result = await controller.findOne('nonexistent-id');

      expect(exitReasonServiceMock.findOne).toHaveBeenCalledWith(
        'nonexistent-id',
      );
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('devrait créer une nouvelle raison de sortie', async () => {
      const createExitReasonDto = {
        reason: 'Fin de formation',
      };

      exitReasonServiceMock.create.mockResolvedValue(mockExitReason);

      const result = await controller.create(createExitReasonDto);

      expect(exitReasonServiceMock.create).toHaveBeenCalledWith(
        createExitReasonDto,
      );
      expect(result).toEqual(mockExitReason);
    });
  });

  describe('update', () => {
    it('devrait mettre à jour une raison de sortie', async () => {
      const updateExitReasonDto = {
        reason: 'Obtention du diplôme',
      };

      const updatedExitReason = {
        ...mockExitReason,
        reason: 'Obtention du diplôme',
      };

      exitReasonServiceMock.update.mockResolvedValue(updatedExitReason);

      const result = await controller.update(
        'exit-reason-id',
        updateExitReasonDto,
      );

      expect(exitReasonServiceMock.update).toHaveBeenCalledWith(
        'exit-reason-id',
        updateExitReasonDto,
      );
      expect(result.reason).toBe('Obtention du diplôme');
    });
  });

  describe('delete', () => {
    it('devrait supprimer une raison de sortie', async () => {
      exitReasonServiceMock.delete.mockResolvedValue(mockExitReason);

      const result = await controller.delete('exit-reason-id');

      expect(exitReasonServiceMock.delete).toHaveBeenCalledWith(
        'exit-reason-id',
      );
      expect(result).toEqual(mockExitReason);
    });
  });
});
