import { describe, it, expect, beforeEach, vi } from 'vitest';
import { StudentService } from './student.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('StudentService', () => {
  let studentService: StudentService;
  let prismaService: any;

  const mockStudent = {
    id: 'test-id',
    firstname: 'Jean',
    lastname: 'Dupont',
    email: 'jean.dupont@example.com',
    birthdate: new Date('1990-01-01'),
    placeOfBirth: 'Paris',
    phone: '+33123456789',
    date_test_initial: '2023-01-01',
    commentaire: 'Commentaire test',
    date_entree_france: '2022-01-01',
    gender_id: 'gender-id-1',
    current_level_id: 'level-id-2',
    initial_level_id: 'level-id-1',
    nationality_id: 'nationality-id-1',
    financing_id: 'financing-id-1',
    status_id: 'status-id-1',
    orientation_id: 'orientation-id-1',
    exit_reason_id: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    // Relations
    gender: { id: 'gender-id-1', label: 'Homme' },
    currentLevel: { id: 'level-id-2', code: 'B1', description: 'Intermédiaire' },
    initialLevel: { id: 'level-id-1', code: 'A1', description: 'Débutant' },
    nationality: { id: 'nationality-id-1', label: 'Française' },
    addresses: [],
    orientation: { id: 'orientation-id-1', type: 'Formation professionnelle', description: 'Orientation vers une formation professionnelle' }
  };

  // Créer un mock pour PrismaService
  beforeEach(() => {
    prismaService = {
      student: {
        create: vi.fn(),
        findMany: vi.fn(),
        findUnique: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      }
    };

    studentService = new StudentService(prismaService as any);
  });

  // Tests pour create
  describe('create', () => {
    it('devrait créer un nouvel étudiant', async () => {
      const studentData = {
        firstname: 'Jean',
        lastname: 'Dupont',
        birthdate: new Date('1990-01-01'),
        gender_id: 'gender-id-1',
        initial_level_id: 'level-id-1',
        nationality_id: 'nationality-id-1',
        financing_id: 'financing-id-1',
        status_id: 'status-id-1',
      };

      prismaService.student.create.mockResolvedValue(mockStudent);
      
      const result = await studentService.create(studentData);

      expect(prismaService.student.create).toHaveBeenCalledWith({
        data: studentData
      });
      expect(result).toEqual(mockStudent);
    });

    it('devrait gérer les erreurs lors de la création', async () => {
      const studentData = {
        firstname: 'Jean',
        lastname: 'Dupont',
        // Données incomplètes, pas de champs obligatoires
      };

      const dbError = new Error('Required field missing');
      prismaService.student.create.mockRejectedValue(dbError);
      
      await expect(studentService.create(studentData)).rejects.toThrow(Error);
    });
  });

  // Tests pour findAll
  describe('findAll', () => {
    it('devrait retourner tous les étudiants', async () => {
      prismaService.student.findMany.mockResolvedValue([mockStudent]);
      
      const result = await studentService.findAll();

      expect(prismaService.student.findMany).toHaveBeenCalledWith({
        skip: undefined,
        take: undefined,
        where: undefined,
        orderBy: undefined,
        include: {
          gender: true,
          currentLevel: true,
          initialLevel: true,
          nationality: true,
          addresses: true,
          orientation: true,
        }
      });
      expect(result).toEqual([mockStudent]);
    });

    it('devrait appliquer les filtres fournis', async () => {
      const params = {
        skip: 0,
        take: 10,
        where: { firstname: { contains: 'Jean' } },
        orderBy: { createdAt: 'desc' }
      };

      prismaService.student.findMany.mockResolvedValue([mockStudent]);
      
      const result = await studentService.findAll(params);

      expect(prismaService.student.findMany).toHaveBeenCalledWith({
        ...params,
        include: {
          gender: true,
          currentLevel: true,
          initialLevel: true,
          nationality: true,
          addresses: true,
          orientation: true,
        }
      });
      expect(result).toEqual([mockStudent]);
    });

    it('devrait retourner un tableau vide si aucun étudiant ne correspond', async () => {
      prismaService.student.findMany.mockResolvedValue([]);
      
      const result = await studentService.findAll({ where: { firstname: 'Inconnu' } });
      
      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });
  });

  // Tests pour findOne
  describe('findOne', () => {
    it('devrait trouver un étudiant par ID', async () => {
      prismaService.student.findUnique.mockResolvedValue(mockStudent);
      
      const result = await studentService.findOne({ id: 'test-id' });

      expect(prismaService.student.findUnique).toHaveBeenCalledWith({
        where: { id: 'test-id' },
        include: {
          gender: true,
          currentLevel: true,
          initialLevel: true,
          nationality: true,
          addresses: true,
          orientation: true,
        }
      });
      expect(result).toEqual(mockStudent);
    });

    it('devrait retourner null si aucun étudiant n\'est trouvé', async () => {
      prismaService.student.findUnique.mockResolvedValue(null);

      const result = await studentService.findOne({ id: 'non-existent-id' });

      expect(result).toBeNull();
    });
  });

  // Tests pour update
  describe('update', () => {
    it('devrait mettre à jour un étudiant', async () => {
      const updateData = {
        firstname: 'Jacques',
        phone: '+33987654321'
      };

      prismaService.student.update.mockResolvedValue({
        ...mockStudent,
        firstname: 'Jacques',
        phone: '+33987654321'
      });
      
      const result = await studentService.update({
        where: { id: 'test-id' },
        data: updateData
      });
      
      expect(prismaService.student.update).toHaveBeenCalledWith({
        where: { id: 'test-id' },
        data: updateData
      });
      expect(result.firstname).toBe('Jacques');
      expect(result.phone).toBe('+33987654321');
    });

    it('devrait gérer les erreurs si l\'étudiant n\'existe pas', async () => {
      const updateData = {
        firstname: 'Jacques'
      };

      const error = new Error('Student not found');
      (error as any).code = 'P2025';
      prismaService.student.update.mockRejectedValue(error);
      
      await expect(studentService.update({
        where: { id: 'non-existent-id' },
        data: updateData
      })).rejects.toThrow(Error);
    });

    it('devrait gérer les erreurs de validation', async () => {
      const updateData = {
        email: 'not-an-email' // Email invalide
      };

      const validationError = new Error('Validation failed');
      prismaService.student.update.mockRejectedValue(validationError);
      
      await expect(studentService.update({
        where: { id: 'test-id' },
        data: updateData
      })).rejects.toThrow(Error);
    });
  });

  // Tests pour remove
  describe('remove', () => {
    it('devrait supprimer un étudiant', async () => {
      prismaService.student.delete.mockResolvedValue(mockStudent);
      
      const result = await studentService.remove({ id: 'test-id' });

      expect(prismaService.student.delete).toHaveBeenCalledWith({
        where: { id: 'test-id' }
      });
      expect(result).toEqual(mockStudent);
    });

    it('devrait gérer les erreurs si l\'étudiant n\'existe pas', async () => {
      const error = new Error('Student not found');
      (error as any).code = 'P2025';
      prismaService.student.delete.mockRejectedValue(error);
      
      await expect(studentService.remove({ id: 'non-existent-id' }))
        .rejects.toThrow(Error);
    });

    it('devrait gérer les erreurs de contraintes relationnelles', async () => {
      const constraintError = new Error('Foreign key constraint failed');
      prismaService.student.delete.mockRejectedValue(constraintError);
      
      await expect(studentService.remove({ id: 'test-id' }))
        .rejects.toThrow(Error);
    });
  });

  // Tests de cas critiques
  describe('cas critiques', () => {
    it('devrait gérer la création d\'un étudiant avec des caractères spéciaux dans le nom', async () => {
      const studentData = {
        firstname: 'Jean-François',
        lastname: 'O\'Connor',
        birthdate: new Date('1990-01-01'),
        gender_id: 'gender-id-1',
        initial_level_id: 'level-id-1',
        nationality_id: 'nationality-id-1',
        financing_id: 'financing-id-1',
        status_id: 'status-id-1',
      };

      const expectedStudent = {
        ...mockStudent,
        firstname: 'Jean-François',
        lastname: 'O\'Connor',
      };

      prismaService.student.create.mockResolvedValue(expectedStudent);
      
      const result = await studentService.create(studentData);
      
      expect(result.firstname).toBe('Jean-François');
      expect(result.lastname).toBe('O\'Connor');
    });

    it('devrait correctement mettre à jour les relations d\'un étudiant', async () => {
      const updateData = {
        current_level_id: 'level-id-3',
        orientation_id: 'orientation-id-2'
      };

      const updatedStudent = {
        ...mockStudent,
        current_level_id: 'level-id-3',
        orientation_id: 'orientation-id-2'
      };

      prismaService.student.update.mockResolvedValue(updatedStudent);
      
      const result = await studentService.update({
        where: { id: 'test-id' },
        data: updateData
      });
      
      expect(result.current_level_id).toBe('level-id-3');
      expect(result.orientation_id).toBe('orientation-id-2');
    });
  });
});
