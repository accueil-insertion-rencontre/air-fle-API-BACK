import { Test, type TestingModule } from '@nestjs/testing';
import { SessionController } from './session.controller';
import { SessionService } from './session.service';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { HttpStatus } from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';

describe('SessionController', () => {
  let controller: SessionController;
  let service: SessionService;

  const mockSessionService = {
    create: vi.fn(),
    findAll: vi.fn(),
    findOne: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  };

  beforeEach(async () => {
    service = mockSessionService as any;
    controller = new SessionController(service);

    // Réinitialiser les mocks avant chaque test
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new session', async () => {
      const createSessionDto: CreateSessionDto = {
        label: "Session d'été 2023",
        startedAt: new Date('2023-06-01'),
        finishedAt: new Date('2023-08-31'),
      };
      const result = {
        id: '1',
        ...createSessionDto,
        createdAt: new Date(),
        updatedAt: new Date(),
        groups: [],
      };
      mockSessionService.create.mockResolvedValue(result);

      expect(await controller.create(createSessionDto)).toBe(result);
      expect(mockSessionService.create).toHaveBeenCalledWith(createSessionDto);
    });
  });

  describe('findAll', () => {
    it('should return all sessions with pagination', async () => {
      const result = {
        data: [
          {
            id: '1',
            label: "Session d'été 2023",
            startedAt: new Date('2023-06-01'),
            finishedAt: new Date('2023-08-31'),
            createdAt: new Date(),
            updatedAt: new Date(),
            groups: [],
          },
        ],
        meta: {
          total: 1,
          skip: 0,
          take: 10,
        },
      };
      mockSessionService.findAll.mockResolvedValue(result);

      // Test avec des paramètres individuels comme défini dans le contrôleur
      const skip = '0';
      const take = '10';
      const date = '2023-06-01';
      const groupId = '1';
      const periodId = '2';

      expect(
        await controller.findAll(skip, take, date, groupId, periodId),
      ).toBe(result);

      // Ne pas vérifier la structure exacte des paramètres, mais vérifier que la fonction a été appelée
      expect(mockSessionService.findAll).toHaveBeenCalled();

      // Vérifier les valeurs clés individuellement
      const callArgs = mockSessionService.findAll.mock.calls[0][0];
      expect(callArgs.skip).toBe(0);
      expect(callArgs.take).toBe(10);
      expect(callArgs.orderBy).toEqual({ startedAt: 'desc' });

      // Vérifier que la structure where contient les éléments attendus
      expect(callArgs.where.startedAt).toBeDefined();
      expect(callArgs.where.startedAt.gte instanceof Date).toBe(true);
      expect(callArgs.where.startedAt.lt instanceof Date).toBe(true);

      expect(callArgs.where.groups).toBeDefined();
      expect(callArgs.where.groups.some).toBeDefined();
      expect(callArgs.where.groups.some.periods).toBeDefined();
      expect(callArgs.where.groups.some.periods.some).toBeDefined();
      expect(callArgs.where.groups.some.periods.some.period_id).toBe('2');
    });
  });

  describe('findOne', () => {
    it('should return a session by id', async () => {
      const result = {
        id: '1',
        label: "Session d'été 2023",
        startedAt: new Date('2023-06-01'),
        finishedAt: new Date('2023-08-31'),
        createdAt: new Date(),
        updatedAt: new Date(),
        groups: [],
      };
      mockSessionService.findOne.mockResolvedValue(result);

      expect(await controller.findOne('1')).toBe(result);
      expect(mockSessionService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('should update a session', async () => {
      const updateSessionDto: UpdateSessionDto = {
        label: "Session d'été 2023 (mise à jour)",
      };
      const result = {
        id: '1',
        label: "Session d'été 2023 (mise à jour)",
        startedAt: new Date('2023-06-01'),
        finishedAt: new Date('2023-08-31'),
        createdAt: new Date(),
        updatedAt: new Date(),
        groups: [],
      };
      mockSessionService.update.mockResolvedValue(result);

      expect(await controller.update('1', updateSessionDto)).toBe(result);
      expect(mockSessionService.update).toHaveBeenCalledWith(
        '1',
        updateSessionDto,
      );
    });
  });

  describe('remove', () => {
    it('should remove a session', async () => {
      mockSessionService.remove.mockResolvedValue(undefined);

      await controller.remove('1');
      expect(mockSessionService.remove).toHaveBeenCalledWith('1');
    });
  });
});
