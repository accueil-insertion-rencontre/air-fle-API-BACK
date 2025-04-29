import { Test, type TestingModule } from '@nestjs/testing';
import { SessionService } from './session.service';
import { PrismaService } from '../prisma/prisma.service';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NotFoundException } from '@nestjs/common';

describe('SessionService', () => {
  let service: SessionService;
  let prisma: PrismaService;

  const mockPrismaService = {
    session: {
      findMany: vi.fn(),
      count: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  };

  beforeEach(async () => {
    prisma = mockPrismaService as any;
    service = new SessionService(prisma);

    // Réinitialiser les mocks avant chaque test
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return sessions with pagination metadata', async () => {
      const mockSessions = [
        {
          id: '1',
          label: 'Session d\'été 2023',
          startedAt: new Date('2023-06-01'),
          finishedAt: new Date('2023-08-31'),
          createdAt: new Date(),
          updatedAt: new Date(),
          groups: [],
        },
      ];
      const mockTotal = 1;
      mockPrismaService.session.findMany.mockResolvedValue(mockSessions);
      mockPrismaService.session.count.mockResolvedValue(mockTotal);

      const params = { skip: 0, take: 10 };
      const result = await service.findAll(params);

      expect(result).toEqual({
        data: mockSessions,
        meta: {
          total: mockTotal,
          skip: params.skip,
          take: params.take,
        },
      });
      expect(mockPrismaService.session.findMany).toHaveBeenCalledWith({
        skip: params.skip,
        take: params.take,
        where: undefined,
        orderBy: undefined,
        include: {
          groups: true,
        },
      });
      expect(mockPrismaService.session.count).toHaveBeenCalledWith({
        where: undefined,
      });
    });
  });

  describe('findOne', () => {
    it('should return a session by id', async () => {
      const mockSession = {
        id: '1',
        label: 'Session d\'été 2023',
        startedAt: new Date('2023-06-01'),
        finishedAt: new Date('2023-08-31'),
        createdAt: new Date(),
        updatedAt: new Date(),
        groups: [],
      };
      mockPrismaService.session.findUnique.mockResolvedValue(mockSession);

      const result = await service.findOne('1');

      expect(result).toBe(mockSession);
      expect(mockPrismaService.session.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: {
          groups: true,
        },
      });
    });

    it('should throw NotFoundException when session not found', async () => {
      mockPrismaService.session.findUnique.mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
      await expect(service.findOne('999')).rejects.toThrow('Session with ID 999 not found');
    });
  });

  describe('create', () => {
    it('should create a new session', async () => {
      const createDto = {
        label: 'Session d\'hiver 2023',
        startedAt: new Date('2023-12-01'),
        finishedAt: new Date('2023-12-31'),
      };
      const mockSession = {
        id: '2',
        ...createDto,
        createdAt: new Date(),
        updatedAt: new Date(),
        groups: [],
      };
      mockPrismaService.session.create.mockResolvedValue(mockSession);

      const result = await service.create(createDto);

      expect(result).toBe(mockSession);
      expect(mockPrismaService.session.create).toHaveBeenCalledWith({
        data: createDto,
        include: {
          groups: true,
        },
      });
    });
  });

  describe('update', () => {
    it('should update a session', async () => {
      const updateDto = {
        label: 'Session d\'été 2023 (mise à jour)',
      };
      const mockSession = {
        id: '1',
        label: 'Session d\'été 2023 (mise à jour)',
        startedAt: new Date('2023-06-01'),
        finishedAt: new Date('2023-08-31'),
        createdAt: new Date(),
        updatedAt: new Date(),
        groups: [],
      };
      mockPrismaService.session.update.mockResolvedValue(mockSession);

      const result = await service.update('1', updateDto);

      expect(result).toBe(mockSession);
      expect(mockPrismaService.session.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: updateDto,
        include: {
          groups: true,
        },
      });
    });

    it('should throw NotFoundException when session not found during update', async () => {
      const updateDto = { label: 'Updated Label' };
      const mockError = { code: 'P2025' };
      mockPrismaService.session.update.mockRejectedValue(mockError);

      await expect(service.update('999', updateDto)).rejects.toThrow(NotFoundException);
      await expect(service.update('999', updateDto)).rejects.toThrow('Session with ID 999 not found');
    });
  });

  describe('remove', () => {
    it('should delete a session', async () => {
      mockPrismaService.session.delete.mockResolvedValue({});

      await service.remove('1');

      expect(mockPrismaService.session.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should throw NotFoundException when session not found during removal', async () => {
      const mockError = { code: 'P2025' };
      mockPrismaService.session.delete.mockRejectedValue(mockError);

      await expect(service.remove('999')).rejects.toThrow(NotFoundException);
      await expect(service.remove('999')).rejects.toThrow('Session with ID 999 not found');
    });
  });
});
