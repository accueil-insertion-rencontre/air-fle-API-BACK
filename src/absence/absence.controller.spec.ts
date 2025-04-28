import { Test, TestingModule } from '@nestjs/testing';
import { AbsenceController } from './absence.controller';
import { AbsenceService } from './absence.service';
import { NotFoundException } from '@nestjs/common';
import { CreateAbsenceDto } from './dto/create-absence.dto';
import { UpdateAbsenceDto } from './dto/update-absence.dto';
import { describe, expect, it, beforeEach, vi } from 'vitest';

describe('AbsenceController', () => {
  let controller: AbsenceController;
  let absenceService: AbsenceService;

  const mockAbsence = {
    id: 'absence-id',
    student_id: 'student-id',
    course_id: 'course-id',
    reason: 'Maladie',
    student: { id: 'student-id', firstname: 'John', lastname: 'Doe' },
    course: { course_id: 'course-id', intitule: 'Français A1' }
  };

  const absenceServiceMock = {
    create: vi.fn(),
    findAll: vi.fn(),
    findOne: vi.fn(),
    update: vi.fn(),
    remove: vi.fn()
  };

  beforeEach(async () => {
    controller = new AbsenceController(absenceServiceMock as unknown as AbsenceService);
    absenceService = absenceServiceMock as unknown as AbsenceService;
    
    // Reset les mocks après chaque test
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('devrait créer une nouvelle absence', async () => {
      const createAbsenceDto: CreateAbsenceDto = {
        student_id: 'student-id',
        course_id: 'course-id',
        reason: 'Maladie'
      };

      absenceServiceMock.create.mockResolvedValue(mockAbsence);

      const result = await controller.create(createAbsenceDto);

      expect(absenceServiceMock.create).toHaveBeenCalledWith({
        student: { connect: { id: 'student-id' } },
        course: { connect: { course_id: 'course-id' } },
        reason: 'Maladie'
      });
      expect(result).toEqual(mockAbsence);
    });
  });

  describe('findAll', () => {
    it('devrait retourner toutes les absences', async () => {
      const mockPaginatedResponse = {
        data: [mockAbsence],
        meta: {
          total: 1,
          skip: 0,
          take: 10
        }
      };

      absenceServiceMock.findAll.mockResolvedValue(mockPaginatedResponse);

      const result = await controller.findAll('0', '10', 'student-id', 'course-id');

      expect(absenceServiceMock.findAll).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        where: {
          student_id: 'student-id',
          course_id: 'course-id'
        }
      });
      
      expect(result.data).toBeDefined();
      expect(result.meta).toBeDefined();
      expect(result.data.length).toBe(1);
    });

    it('devrait gérer les requêtes sans paramètres de pagination', async () => {
      const mockPaginatedResponse = {
        data: [mockAbsence],
        meta: {
          total: 1,
          skip: 0,
          take: 1
        }
      };

      absenceServiceMock.findAll.mockResolvedValue(mockPaginatedResponse);

      const result = await controller.findAll(undefined, undefined, undefined, undefined);

      expect(absenceServiceMock.findAll).toHaveBeenCalledWith({
        skip: undefined,
        take: undefined,
        where: {}
      });
    });
  });

  describe('findOne', () => {
    it('devrait retourner une absence par son id', async () => {
      absenceServiceMock.findOne.mockResolvedValue(mockAbsence);

      const result = await controller.findOne('absence-id');

      expect(absenceServiceMock.findOne).toHaveBeenCalledWith('absence-id');
      expect(result).toMatchObject({
        id: 'absence-id',
        student_id: 'student-id',
        course_id: 'course-id',
        reason: 'Maladie'
      });
    });

    it('devrait propager l\'erreur si l\'absence n\'existe pas', async () => {
      absenceServiceMock.findOne.mockRejectedValue(
        new NotFoundException('Absence with ID nonexistent-id not found')
      );

      await expect(controller.findOne('nonexistent-id')).rejects.toThrow(
        new NotFoundException('Absence with ID nonexistent-id not found')
      );
    });
  });

  describe('update', () => {
    it('devrait mettre à jour une absence', async () => {
      const updateAbsenceDto: UpdateAbsenceDto = {
        reason: 'Rendez-vous médical'
      };

      const updatedAbsence = {
        ...mockAbsence,
        reason: 'Rendez-vous médical'
      };

      absenceServiceMock.update.mockResolvedValue(updatedAbsence);

      const result = await controller.update('absence-id', updateAbsenceDto);

      expect(absenceServiceMock.update).toHaveBeenCalledWith('absence-id', {
        reason: 'Rendez-vous médical'
      });
      expect(result.reason).toBe('Rendez-vous médical');
    });

    it('devrait gérer la mise à jour des relations étudiant et cours', async () => {
      const updateAbsenceDto: UpdateAbsenceDto = {
        student_id: 'new-student-id',
        course_id: 'new-course-id'
      };

      const updatedAbsence = {
        ...mockAbsence,
        student_id: 'new-student-id',
        course_id: 'new-course-id'
      };

      absenceServiceMock.update.mockResolvedValue(updatedAbsence);

      const result = await controller.update('absence-id', updateAbsenceDto);

      expect(absenceServiceMock.update).toHaveBeenCalledWith('absence-id', {
        student: { connect: { id: 'new-student-id' } },
        course: { connect: { course_id: 'new-course-id' } }
      });
    });
  });

  describe('remove', () => {
    it('devrait supprimer une absence', async () => {
      absenceServiceMock.remove.mockResolvedValue(mockAbsence);

      const result = await controller.remove('absence-id');

      expect(absenceServiceMock.remove).toHaveBeenCalledWith('absence-id');
      expect(result).toEqual(mockAbsence);
    });

    it('devrait propager l\'erreur si l\'absence n\'existe pas', async () => {
      absenceServiceMock.remove.mockRejectedValue(
        new NotFoundException('Absence with ID nonexistent-id not found')
      );

      await expect(controller.remove('nonexistent-id')).rejects.toThrow(
        new NotFoundException('Absence with ID nonexistent-id not found')
      );
    });
  });
});
