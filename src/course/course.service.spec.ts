import { Test, TestingModule } from '@nestjs/testing';
import { CourseService } from './course.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('CourseService', () => {
  let service: CourseService;

  const mockCourse = {
    course_id: 'course-id',
    day: new Date('2023-09-01T00:00:00.000Z'),
    start_hour: new Date('2023-09-01T09:00:00.000Z'),
    end_hour: new Date('2023-09-01T11:00:00.000Z'),
    intitule: 'Français - Niveau A1',
    group_id: 'group-id',
    users: [],
    absences: [],
  };

  const prismaMock = {
    course: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  };

  beforeEach(async () => {
    service = new CourseService(prismaMock as unknown as PrismaService);

    // Réinitialisation des mocks à chaque test
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('devrait créer un nouveau cours', async () => {
      const createData = {
        day: new Date('2023-09-01T00:00:00.000Z'),
        start_hour: new Date('2023-09-01T09:00:00.000Z'),
        end_hour: new Date('2023-09-01T11:00:00.000Z'),
        intitule: 'Français - Niveau A1',
        group: { connect: { group_id: 'group-id' } },
      };

      prismaMock.course.create.mockResolvedValue(mockCourse);

      const result = await service.create(createData);

      expect(prismaMock.course.create).toHaveBeenCalledWith({
        data: createData,
        include: {
          users: true,
          absences: {
            include: {
              student: true,
            },
          },
        },
      });
      expect(result).toEqual(mockCourse);
    });
  });

  describe('findAll', () => {
    it('devrait retourner tous les cours', async () => {
      prismaMock.course.findMany.mockResolvedValue([mockCourse]);

      const result = await service.findAll();

      expect(prismaMock.course.findMany).toHaveBeenCalledWith({
        skip: undefined,
        take: undefined,
        where: undefined,
        orderBy: undefined,
        include: {
          users: true,
          absences: {
            include: {
              student: true,
            },
          },
        },
      });
      expect(result).toEqual([mockCourse]);
    });

    it('devrait retourner les cours avec filtrage', async () => {
      const params = {
        skip: 0,
        take: 10,
        where: { intitule: { contains: 'Français', mode: 'insensitive' } },
        orderBy: { day: 'desc' as const },
      };

      prismaMock.course.findMany.mockResolvedValue([mockCourse]);

      const result = await service.findAll(params);

      expect(prismaMock.course.findMany).toHaveBeenCalledWith({
        ...params,
        include: {
          users: true,
          absences: {
            include: {
              student: true,
            },
          },
        },
      });
      expect(result).toEqual([mockCourse]);
    });
  });

  describe('findOne', () => {
    it('devrait retourner un cours par son id', async () => {
      prismaMock.course.findUnique.mockResolvedValue(mockCourse);

      const result = await service.findOne('course-id');

      expect(prismaMock.course.findUnique).toHaveBeenCalledWith({
        where: { course_id: 'course-id' },
        include: {
          users: true,
          absences: {
            include: {
              student: true,
            },
          },
        },
      });
      expect(result).toEqual(mockCourse);
    });

    it("devrait lancer une exception si le cours n'existe pas", async () => {
      prismaMock.course.findUnique.mockResolvedValue(null);

      await expect(service.findOne('nonexistent-id')).rejects.toThrow(
        new NotFoundException(`Cours avec l'ID nonexistent-id non trouvé`),
      );
    });
  });

  describe('update', () => {
    it('devrait mettre à jour un cours', async () => {
      const updateData = {
        intitule: 'Français - Niveau A2',
      };

      const updatedCourse = {
        ...mockCourse,
        intitule: 'Français - Niveau A2',
      };

      prismaMock.course.update.mockResolvedValue(updatedCourse);

      const result = await service.update('course-id', updateData);

      expect(prismaMock.course.update).toHaveBeenCalledWith({
        where: { course_id: 'course-id' },
        data: updateData,
        include: {
          users: true,
          absences: true,
        },
      });
      expect(result.intitule).toBe('Français - Niveau A2');
    });

    it("devrait lancer une exception si le cours n'existe pas", async () => {
      const prismaError = new Error('Record not found');
      (prismaError as any).code = 'P2025';

      prismaMock.course.update.mockRejectedValue(prismaError);

      await expect(service.update('nonexistent-id', {})).rejects.toThrow(
        new NotFoundException(`Cours avec l'ID nonexistent-id non trouvé`),
      );
    });
  });

  describe('remove', () => {
    it('devrait supprimer un cours', async () => {
      prismaMock.course.delete.mockResolvedValue(mockCourse);

      const result = await service.remove('course-id');

      expect(prismaMock.course.delete).toHaveBeenCalledWith({
        where: { course_id: 'course-id' },
      });
      expect(result).toEqual(mockCourse);
    });

    it("devrait lancer une exception si le cours n'existe pas", async () => {
      const prismaError = new Error('Record not found');
      (prismaError as any).code = 'P2025';

      prismaMock.course.delete.mockRejectedValue(prismaError);

      await expect(service.remove('nonexistent-id')).rejects.toThrow(
        new NotFoundException(`Cours avec l'ID nonexistent-id non trouvé`),
      );
    });
  });
});
