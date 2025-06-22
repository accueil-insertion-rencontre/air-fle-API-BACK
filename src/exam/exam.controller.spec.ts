import { Test, TestingModule } from '@nestjs/testing';
import { ExamController } from './exam.controller';
import { ExamService } from './exam.service';
import { describe, expect, it, beforeEach, vi } from 'vitest';

describe('ExamController', () => {
  let controller: ExamController;
  let examService: ExamService;

  const mockExam = {
    id: 'exam-id',
    label: 'Examen final A1',
    taked_at: new Date('2023-09-15T10:00:00Z'),
    note: 'B1 - 14/20',
    student_id: 'student-id',
    student: { id: 'student-id', firstname: 'John', lastname: 'Doe' },
  };

  const examServiceMock = {
    findAll: vi.fn(),
    findOne: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };

  beforeEach(async () => {
    controller = new ExamController(examServiceMock as unknown as ExamService);
    examService = examServiceMock as unknown as ExamService;

    // Reset les mocks après chaque test
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('devrait retourner tous les examens', async () => {
      examServiceMock.findAll.mockResolvedValue([mockExam]);

      const result = await controller.findAll();

      expect(examServiceMock.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockExam]);
    });
  });

  describe('findOne', () => {
    it('devrait retourner un examen par son id', async () => {
      examServiceMock.findOne.mockResolvedValue(mockExam);

      const result = await controller.findOne('exam-id');

      expect(examServiceMock.findOne).toHaveBeenCalledWith('exam-id');
      expect(result).toEqual(mockExam);
    });

    it("devrait retourner null si l'examen n'existe pas", async () => {
      examServiceMock.findOne.mockResolvedValue(null);

      const result = await controller.findOne('nonexistent-id');

      expect(examServiceMock.findOne).toHaveBeenCalledWith('nonexistent-id');
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('devrait créer un nouvel examen', async () => {
      const createExamData = {
        label: 'Examen final A1',
        taked_at: new Date('2023-09-15T10:00:00Z'),
        note: 'B1 - 14/20',
        student: { connect: { id: 'student-id' } },
      };

      examServiceMock.create.mockResolvedValue(mockExam);

      const result = await controller.create(createExamData);

      expect(examServiceMock.create).toHaveBeenCalledWith(createExamData);
      expect(result).toEqual(mockExam);
    });
  });

  describe('update', () => {
    it('devrait mettre à jour un examen', async () => {
      const updateExamData = {
        label: 'Examen final A2',
        note: 'A2 - 16/20',
      };

      const updatedExam = {
        ...mockExam,
        label: 'Examen final A2',
        note: 'A2 - 16/20',
      };

      examServiceMock.update.mockResolvedValue(updatedExam);

      const result = await controller.update('exam-id', updateExamData);

      expect(examServiceMock.update).toHaveBeenCalledWith(
        'exam-id',
        updateExamData,
      );
      expect(result.label).toBe('Examen final A2');
      expect(result.note).toBe('A2 - 16/20');
    });
  });

  describe('delete', () => {
    it('devrait supprimer un examen', async () => {
      examServiceMock.delete.mockResolvedValue(mockExam);

      const result = await controller.delete('exam-id');

      expect(examServiceMock.delete).toHaveBeenCalledWith('exam-id');
      expect(result).toEqual(mockExam);
    });
  });
});
