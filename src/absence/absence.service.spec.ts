import { Test, TestingModule } from '@nestjs/testing';
import { AbsenceService } from './absence.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('AbsenceService', () => {
  let service: AbsenceService;

  const mockAbsence = {
    id: 'absence-id',
    student_id: 'student-id',
    course_id: 'course-id',
    reason: 'Maladie',
    student: { id: 'student-id', firstname: 'John', lastname: 'Doe' },
    course: { course_id: 'course-id', intitule: 'Français A1' }
  };

  const prismaMock = {
    absence: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn()
    }
  };

  beforeEach(async () => {
    service = new AbsenceService(prismaMock as unknown as PrismaService);
    
    // Réinitialisation des mocks à chaque test
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('devrait créer une nouvelle absence', async () => {
      const createData: Prisma.AbsenceCreateInput = {
        student: { connect: { id: 'student-id' } },
        course: { connect: { course_id: 'course-id' } },
        reason: 'Maladie'
      };

      prismaMock.absence.create.mockResolvedValue(mockAbsence);

      const result = await service.create(createData);
      
      expect(prismaMock.absence.create).toHaveBeenCalledWith({
        data: createData,
        include: {
          student: true,
          course: true,
        },
      });
      expect(result).toEqual(mockAbsence);
    });
  });

  describe('findAll', () => {
    it('devrait retourner toutes les absences avec métadonnées', async () => {
      const params = {
        skip: 0,
        take: 10,
        where: { student_id: 'student-id' }
      };

      prismaMock.absence.findMany.mockResolvedValue([mockAbsence]);
      prismaMock.absence.count.mockResolvedValue(1);

      const result = await service.findAll(params);
      
      expect(prismaMock.absence.findMany).toHaveBeenCalledWith({
        skip: params.skip,
        take: params.take,
        where: params.where,
        orderBy: undefined,
        include: {
          student: true,
          course: true,
        },
      });
      expect(prismaMock.absence.count).toHaveBeenCalledWith({
        where: params.where
      });
      expect(result).toEqual({
        data: [mockAbsence],
        meta: {
          total: 1,
          skip: 0,
          take: 10,
        },
      });
    });
  });

  describe('findOne', () => {
    it('devrait retourner une absence par son id', async () => {
      prismaMock.absence.findUnique.mockResolvedValue(mockAbsence);

      const result = await service.findOne('absence-id');
      
      expect(prismaMock.absence.findUnique).toHaveBeenCalledWith({
        where: { id: 'absence-id' },
        include: {
          student: true,
          course: true,
        },
      });
      expect(result).toEqual(mockAbsence);
    });

    it('devrait lancer une exception si l\'absence n\'existe pas', async () => {
      prismaMock.absence.findUnique.mockResolvedValue(null);

      await expect(service.findOne('nonexistent-id')).rejects.toThrow(
        new NotFoundException('Absence with ID nonexistent-id not found')
      );
    });
  });

  describe('update', () => {
    it('devrait mettre à jour une absence', async () => {
      const updateData: Prisma.AbsenceUpdateInput = {
        reason: 'Rendez-vous médical'
      };

      prismaMock.absence.update.mockResolvedValue({
        ...mockAbsence,
        reason: 'Rendez-vous médical'
      });

      const result = await service.update('absence-id', updateData);
      
      expect(prismaMock.absence.update).toHaveBeenCalledWith({
        where: { id: 'absence-id' },
        data: updateData,
        include: {
          student: true,
          course: true,
        },
      });
      expect(result.reason).toBe('Rendez-vous médical');
    });

    it('devrait lancer une exception si l\'absence n\'existe pas', async () => {
      const prismaError = new Error('Record not found');
      (prismaError as any).code = 'P2025';
      
      prismaMock.absence.update.mockRejectedValue(prismaError);

      await expect(service.update('nonexistent-id', {})).rejects.toThrow(
        new NotFoundException('Absence with ID nonexistent-id not found')
      );
    });
  });

  describe('remove', () => {
    it('devrait supprimer une absence', async () => {
      prismaMock.absence.delete.mockResolvedValue(mockAbsence);

      const result = await service.remove('absence-id');
      
      expect(prismaMock.absence.delete).toHaveBeenCalledWith({
        where: { id: 'absence-id' },
      });
      expect(result).toEqual(mockAbsence);
    });

    it('devrait lancer une exception si l\'absence n\'existe pas', async () => {
      const prismaError = new Error('Record not found');
      (prismaError as any).code = 'P2025';
      
      prismaMock.absence.delete.mockRejectedValue(prismaError);

      await expect(service.remove('nonexistent-id')).rejects.toThrow(
        new NotFoundException('Absence with ID nonexistent-id not found')
      );
    });
  });
});
