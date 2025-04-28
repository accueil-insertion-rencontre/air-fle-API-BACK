import { Test, TestingModule } from '@nestjs/testing';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { NotFoundException } from '@nestjs/common';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import { Prisma } from '@prisma/client';

describe('CourseController', () => {
  let controller: CourseController;

  const mockCourse = {
    course_id: 'course-id',
    day: new Date('2023-09-01T00:00:00.000Z'),
    start_hour: new Date('2023-09-01T09:00:00.000Z'),
    end_hour: new Date('2023-09-01T11:00:00.000Z'),
    intitule: 'Français - Niveau A1',
    group_id: 'group-id',
    users: [],
    absences: []
  };

  const courseServiceMock = {
    create: vi.fn(),
    findAll: vi.fn(),
    findOne: vi.fn(),
    update: vi.fn(),
    remove: vi.fn()
  };

  beforeEach(async () => {
    controller = new CourseController(courseServiceMock as unknown as CourseService);
    
    // Reset les mocks après chaque test
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('devrait créer un nouveau cours', async () => {
      const createCourseData = {
        day: new Date('2023-09-01T00:00:00.000Z'),
        start_hour: new Date('2023-09-01T09:00:00.000Z'),
        end_hour: new Date('2023-09-01T11:00:00.000Z'),
        intitule: 'Français - Niveau A1',
        group: { connect: { id: 'group-id' } }
      };

      courseServiceMock.create.mockResolvedValue(mockCourse);

      const result = await controller.create(createCourseData);

      expect(courseServiceMock.create).toHaveBeenCalledWith(createCourseData);
      expect(result).toEqual(mockCourse);
    });
  });

  describe('findAll', () => {
    it('devrait retourner tous les cours sans paramètres', async () => {
      courseServiceMock.findAll.mockResolvedValue([mockCourse]);

      const result = await controller.findAll();

      expect(courseServiceMock.findAll).toHaveBeenCalledWith({
        skip: undefined,
        take: undefined,
        where: {},
        orderBy: { day: 'desc' }
      });
      expect(result).toEqual([mockCourse]);
    });

    it('devrait retourner les cours avec filtres', async () => {
      courseServiceMock.findAll.mockResolvedValue([mockCourse]);

      const result = await controller.findAll(
        '0',
        '10',
        '{"day":"asc"}',
        'Français',
        'group-id',
        '2023-09-01'
      );

      const searchDate = new Date('2023-09-01');
      expect(courseServiceMock.findAll).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        where: {
          intitule: { contains: 'Français', mode: 'insensitive' },
          group_id: 'group-id',
          day: {
            gte: new Date(searchDate.setHours(0, 0, 0, 0)),
            lt: new Date(searchDate.setHours(23, 59, 59, 999)),
          }
        },
        orderBy: { day: 'asc' }
      });
      expect(result).toEqual([mockCourse]);
    });
  });

  describe('findOne', () => {
    it('devrait retourner un cours par son id', async () => {
      courseServiceMock.findOne.mockResolvedValue(mockCourse);

      const result = await controller.findOne('course-id');

      expect(courseServiceMock.findOne).toHaveBeenCalledWith('course-id');
      expect(result).toEqual(mockCourse);
    });

    it('devrait propager l\'erreur si le cours n\'existe pas', async () => {
      courseServiceMock.findOne.mockRejectedValue(
        new NotFoundException(`Cours avec l'ID nonexistent-id non trouvé`)
      );

      await expect(controller.findOne('nonexistent-id')).rejects.toThrow(
        new NotFoundException(`Cours avec l'ID nonexistent-id non trouvé`)
      );
    });
  });

  describe('update', () => {
    it('devrait mettre à jour un cours', async () => {
      const updateCourseData = {
        intitule: 'Français - Niveau A2'
      };

      const updatedCourse = {
        ...mockCourse,
        intitule: 'Français - Niveau A2'
      };

      courseServiceMock.update.mockResolvedValue(updatedCourse);

      const result = await controller.update('course-id', updateCourseData);

      expect(courseServiceMock.update).toHaveBeenCalledWith('course-id', updateCourseData);
      expect(result).toEqual(updatedCourse);
    });
  });

  describe('remove', () => {
    it('devrait supprimer un cours', async () => {
      courseServiceMock.remove.mockResolvedValue(undefined);

      await controller.remove('course-id');

      expect(courseServiceMock.remove).toHaveBeenCalledWith('course-id');
    });

    it('devrait propager l\'erreur si le cours n\'existe pas', async () => {
      courseServiceMock.remove.mockRejectedValue(
        new NotFoundException(`Cours avec l'ID nonexistent-id non trouvé`)
      );

      await expect(controller.remove('nonexistent-id')).rejects.toThrow(
        new NotFoundException(`Cours avec l'ID nonexistent-id non trouvé`)
      );
    });
  });
});
