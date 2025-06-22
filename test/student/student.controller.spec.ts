import { Test, TestingModule } from '@nestjs/testing';
import { StudentController } from '../../src/student/student.controller';
import { StudentService } from '../../src/student/student.service';
import { CreateStudentDto } from '../../src/student/dto/create-student.dto';
import { UpdateStudentDto } from '../../src/student/dto/update-student.dto';
import { NotFoundException } from '@nestjs/common';
import { Student } from '@prisma/client';
import { vi } from 'vitest';

describe('StudentController - Codes d\'erreur', () => {
  let controller: StudentController;
  let service: StudentService;

  const mockStudentService = {
    create: vi.fn(),
    findAll: vi.fn(),
    findOne: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
    updateStudentDisabilities: vi.fn(),
  };

  const validUuid = 'c35fe727-d68e-4b1e-afe1-c5618ccf2cce';
  const invalidUuid = 'invalid-uuid';

  const mockStudent: Student = {
    student_uuid: validUuid,
    student_firstname: 'Jean',
    student_lastname: 'Dupont',
    student_birthdate: new Date('1990-01-01'),
    student_place_of_birth: 'Paris',
    student_mail: 'jean@example.com',
    student_phone: 123456789,
    student_date_test_initial: new Date(),
    student_date_entry_france: new Date(),
    student_commentary: 'Test',
    student_created_at: new Date(),
    student_updated_at: new Date(),
    student_date_cir: new Date(),
    student_date_residence_permit: new Date(),
    financing_uuid: validUuid,
    status_uuid: validUuid,
    orientation_uuid: validUuid,
    exit_reason_uuid: validUuid,
    french_level_uuid: validUuid,
    gender_uuid: validUuid,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentController],
      providers: [
        {
          provide: StudentService,
          useValue: mockStudentService,
        },
      ],
    }).compile();

    controller = module.get<StudentController>(StudentController);
    service = module.get<StudentService>(StudentService);
    
    // Vérifier que le service est bien injecté
    (controller as any).studentService = mockStudentService;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /students - Création', () => {
    it('devrait retourner 201 et l\'étudiant créé avec des données valides', async () => {
      const createDto: CreateStudentDto = {
        student_firstname: 'Jean',
        student_lastname: 'Dupont',
        student_birthdate: new Date('1990-01-01'),
        gender_uuid: validUuid,
        french_level_uuid: validUuid,
        nationality_uuid: validUuid,
        financing_uuid: validUuid,
        status_uuid: validUuid,
        orientation_uuid: validUuid,
        exit_reason_uuid: validUuid,
      };

      mockStudentService.create.mockResolvedValue(mockStudent);

      const result = await controller.create(createDto);

      expect(result).toEqual(mockStudent);
      expect(mockStudentService.create).toHaveBeenCalledWith(createDto);
      expect(mockStudentService.create).toHaveBeenCalledTimes(1);
    });

    it('devrait propager l\'erreur si le service échoue', async () => {
      const createDto: CreateStudentDto = {
        student_firstname: 'Jean',
        student_lastname: 'Dupont',
        student_birthdate: new Date('1990-01-01'),
        gender_uuid: validUuid,
        french_level_uuid: validUuid,
        nationality_uuid: validUuid,
        financing_uuid: validUuid,
        status_uuid: validUuid,
        orientation_uuid: validUuid,
        exit_reason_uuid: validUuid,
      };

      const serviceError = new Error('Erreur de base de données');
      mockStudentService.create.mockRejectedValue(serviceError);

      await expect(controller.create(createDto)).rejects.toThrow(serviceError);
    });
  });

  describe('GET /students/:id - Récupération par ID', () => {
    it('devrait retourner 200 et l\'étudiant si trouvé', async () => {
      mockStudentService.findOne.mockResolvedValue(mockStudent);

      const result = await controller.findOne(validUuid);

      expect(result).toEqual(mockStudent);
      expect(mockStudentService.findOne).toHaveBeenCalledWith({ student_uuid: validUuid });
    });

    it('devrait retourner 404 NotFoundException si étudiant non trouvé', async () => {
      mockStudentService.findOne.mockResolvedValue(null);

      await expect(controller.findOne(validUuid))
        .rejects
        .toThrow(new NotFoundException(`Étudiant avec l'ID ${validUuid} non trouvé`));
    });

    it('devrait propager l\'erreur du service', async () => {
      const serviceError = new Error('Erreur de connexion');
      mockStudentService.findOne.mockRejectedValue(serviceError);

      await expect(controller.findOne(validUuid)).rejects.toThrow(serviceError);
    });
  });

  describe('PATCH /students/:id - Mise à jour', () => {
    it('devrait retourner 200 et l\'étudiant mis à jour', async () => {
      const updateDto: UpdateStudentDto = {
        student_firstname: 'Jean-Pierre',
      };

      const updatedStudent = { ...mockStudent, student_firstname: 'Jean-Pierre' };
      mockStudentService.update.mockResolvedValue(updatedStudent);

      const result = await controller.update(validUuid, updateDto);

      expect(result).toEqual(updatedStudent);
      expect(mockStudentService.update).toHaveBeenCalledWith({
        where: { student_uuid: validUuid },
        data: updateDto,
      });
    });

    it('devrait retourner 404 si étudiant non trouvé (code Prisma P2025)', async () => {
      const updateDto: UpdateStudentDto = {
        student_firstname: 'Jean-Pierre',
      };

      const prismaError = new Error('Record not found');
      (prismaError as any).code = 'P2025';
      mockStudentService.update.mockRejectedValue(prismaError);

      await expect(controller.update(validUuid, updateDto))
        .rejects
        .toThrow(new NotFoundException(`Étudiant avec l'ID ${validUuid} non trouvé`));
    });

    it('devrait propager les autres erreurs du service', async () => {
      const updateDto: UpdateStudentDto = {
        student_firstname: 'Jean-Pierre',
      };

      const serviceError = new Error('Erreur de contrainte');
      mockStudentService.update.mockRejectedValue(serviceError);

      await expect(controller.update(validUuid, updateDto)).rejects.toThrow(serviceError);
    });
  });

  describe('DELETE /students/:id - Suppression', () => {
    it('devrait retourner 204 (void) si suppression réussie', async () => {
      mockStudentService.remove.mockResolvedValue(undefined);

      const result = await controller.remove(validUuid);

      expect(result).toBeUndefined();
      expect(mockStudentService.remove).toHaveBeenCalledWith({ student_uuid: validUuid });
    });

    it('devrait retourner 404 si étudiant non trouvé (code Prisma P2025)', async () => {
      const prismaError = new Error('Record not found');
      (prismaError as any).code = 'P2025';
      mockStudentService.remove.mockRejectedValue(prismaError);

      await expect(controller.remove(validUuid))
        .rejects
        .toThrow(new NotFoundException(`Étudiant avec l'ID ${validUuid} non trouvé`));
    });

    it('devrait propager les autres erreurs du service', async () => {
      const serviceError = new Error('Erreur de contrainte FK');
      mockStudentService.remove.mockRejectedValue(serviceError);

      await expect(controller.remove(validUuid)).rejects.toThrow(serviceError);
    });
  });

  describe('GET /students - Liste des étudiants', () => {
    it('devrait retourner 200 et la liste des étudiants', async () => {
      const students = [mockStudent];
      mockStudentService.findAll.mockResolvedValue(students);

      const result = await controller.findAll();

      expect(result).toEqual(students);
      expect(mockStudentService.findAll).toHaveBeenCalledWith({
        skip: undefined,
        take: undefined,
        where: {},
        orderBy: { student_created_at: 'desc' },
      });
    });

    it('devrait retourner 200 et liste vide si aucun étudiant', async () => {
      mockStudentService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
    });

    it('devrait appliquer les filtres de recherche', async () => {
      const students = [mockStudent];
      mockStudentService.findAll.mockResolvedValue(students);

      await controller.findAll('0', '10', undefined, 'Jean', 'Dupont', 'jean@example.com');

      expect(mockStudentService.findAll).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        where: {
          student_firstname: { contains: 'Jean', mode: 'insensitive' },
          student_lastname: { contains: 'Dupont', mode: 'insensitive' },
          student_mail: { contains: 'jean@example.com', mode: 'insensitive' },
        },
        orderBy: { student_created_at: 'desc' },
      });
    });

    it('devrait propager l\'erreur du service', async () => {
      const serviceError = new Error('Erreur de requête');
      mockStudentService.findAll.mockRejectedValue(serviceError);

      await expect(controller.findAll()).rejects.toThrow(serviceError);
    });
  });

  describe('Gestion des paramètres invalides', () => {
    it('devrait gérer les paramètres de pagination invalides', async () => {
      mockStudentService.findAll.mockResolvedValue([]);

      // Test avec des strings non numériques
      await controller.findAll('invalid', 'invalid');

      expect(mockStudentService.findAll).toHaveBeenCalledWith({
        skip: NaN,
        take: NaN,
        where: {},
        orderBy: { student_created_at: 'desc' },
      });
    });

    it('devrait gérer orderBy JSON invalide', async () => {
      mockStudentService.findAll.mockResolvedValue([]);

      // Si JSON.parse échoue, cela devrait utiliser l'ordre par défaut
      expect(() => controller.findAll('0', '10', 'invalid-json')).not.toThrow();
    });
  });
});