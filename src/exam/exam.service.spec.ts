import { Test, TestingModule } from '@nestjs/testing';
import { ExamService } from './exam.service';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { describe, expect, it, beforeEach, vi } from 'vitest';

describe('ExamService', () => {
  let service: ExamService;

  const mockExam = {
    id: 'exam-id',
    label: 'Examen final A1',
    taked_at: new Date('2023-09-15T10:00:00Z'),
    note: 'B1 - 14/20',
    student_id: 'student-id',
    student: { id: 'student-id', firstname: 'John', lastname: 'Doe' },
  };

  const prismaMock = {
    exam: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  };

  beforeEach(async () => {
    service = new ExamService(prismaMock as unknown as PrismaService);

    // Réinitialisation des mocks à chaque test
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('devrait retourner tous les examens', async () => {
      prismaMock.exam.findMany.mockResolvedValue([mockExam]);

      const result = await service.findAll();

      expect(prismaMock.exam.findMany).toHaveBeenCalledWith({
        include: {
          student: true,
        },
      });
      expect(result).toEqual([mockExam]);
    });
  });

  describe('findOne', () => {
    it('devrait retourner un examen par son id', async () => {
      prismaMock.exam.findUnique.mockResolvedValue(mockExam);

      const result = await service.findOne('exam-id');

      expect(prismaMock.exam.findUnique).toHaveBeenCalledWith({
        where: { id: 'exam-id' },
        include: {
          student: true,
        },
      });
      expect(result).toEqual(mockExam);
    });

    it("devrait retourner null si l'examen n'existe pas", async () => {
      prismaMock.exam.findUnique.mockResolvedValue(null);

      const result = await service.findOne('nonexistent-id');

      expect(prismaMock.exam.findUnique).toHaveBeenCalledWith({
        where: { id: 'nonexistent-id' },
        include: {
          student: true,
        },
      });
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('devrait créer un nouvel examen', async () => {
      const createData: Prisma.ExamCreateInput = {
        label: 'Examen final A1',
        taked_at: new Date('2023-09-15T10:00:00Z'),
        note: 'B1 - 14/20',
        student: { connect: { id: 'student-id' } },
      };

      prismaMock.exam.create.mockResolvedValue(mockExam);

      const result = await service.create(createData);

      expect(prismaMock.exam.create).toHaveBeenCalledWith({
        data: createData,
        include: {
          student: true,
        },
      });
      expect(result).toEqual(mockExam);
    });
  });

  describe('update', () => {
    it('devrait mettre à jour un examen', async () => {
      const updateData: Prisma.ExamUpdateInput = {
        label: 'Examen final A2',
        note: 'A2 - 16/20',
      };

      const updatedExam = {
        ...mockExam,
        label: 'Examen final A2',
        note: 'A2 - 16/20',
      };

      prismaMock.exam.update.mockResolvedValue(updatedExam);

      const result = await service.update('exam-id', updateData);

      expect(prismaMock.exam.update).toHaveBeenCalledWith({
        where: { id: 'exam-id' },
        data: updateData,
        include: {
          student: true,
        },
      });
      expect(result.label).toBe('Examen final A2');
      expect(result.note).toBe('A2 - 16/20');
    });
  });

  describe('delete', () => {
    it('devrait supprimer un examen', async () => {
      prismaMock.exam.delete.mockResolvedValue(mockExam);

      const result = await service.delete('exam-id');

      expect(prismaMock.exam.delete).toHaveBeenCalledWith({
        where: { id: 'exam-id' },
      });
      expect(result).toEqual(mockExam);
    });
  });
});
