import { Test, TestingModule } from '@nestjs/testing';
import { StudentService } from '../../src/student/student.service';
import { CreateStudentDto } from '../../src/student/dto/create-student.dto';
import { UpdateStudentDto } from '../../src/student/dto/update-student.dto';
import { vi } from 'vitest';

describe('StudentService - Codes d\'erreur', () => {
  let service: StudentService;
  let module: TestingModule;

  const validUuid = 'c35fe727-d68e-4b1e-afe1-c5618ccf2cce';

  const mockStudent = {
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
    const mockStudentRepository = {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      findStudentDisabilities: vi.fn(),
      updateStudentDisabilities: vi.fn(),
      getStandardIncludes: vi.fn().mockReturnValue({}),
      getListIncludes: vi.fn().mockReturnValue({}),
      getDetailIncludes: vi.fn().mockReturnValue({}),
    };

         const mockLearnerHistoryService = {
       recordStudentChange: vi.fn().mockResolvedValue(undefined),
       recordChange: vi.fn().mockResolvedValue(undefined),
     };

    // Mock du StudentRepository en tant que classe si ça n'existe pas
    const StudentRepositoryMock = vi.fn().mockImplementation(() => mockStudentRepository);
    const LearnerHistoryServiceMock = vi.fn().mockImplementation(() => mockLearnerHistoryService);

    module = await Test.createTestingModule({
      providers: [
        StudentService,
        {
          provide: 'StudentRepository',
          useValue: mockStudentRepository,
        },
        {
          provide: 'LearnerHistoryService', 
          useValue: mockLearnerHistoryService,
        },
      ],
    }).compile();

    service = module.get<StudentService>(StudentService);
    
    // Forcer l'injection si elle n'a pas marché
    if (!service['studentRepository']) {
      service['studentRepository'] = mockStudentRepository;
    }
    if (!service['learnerHistoryService']) {
      service['learnerHistoryService'] = mockLearnerHistoryService;
    }
  });

  afterEach(async () => {
    await module.close();
    vi.clearAllMocks();
  });

  describe('create() - Création d\'étudiant', () => {
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

    it('devrait propager l\'erreur Prisma P2002 (contrainte unique)', async () => {
      const prismaError = new Error('Unique constraint violation');
      (prismaError as any).code = 'P2002';
      (prismaError as any).meta = { target: ['student_mail'] };

      service['studentRepository'].create.mockRejectedValue(prismaError);

      await expect(service.create(createDto)).rejects.toThrow(prismaError);
    });

    it('devrait propager l\'erreur Prisma P2003 (contrainte de clé étrangère)', async () => {
      const prismaError = new Error('Foreign key constraint violation');
      (prismaError as any).code = 'P2003';
      (prismaError as any).meta = { field_name: 'gender_uuid' };

      service['studentRepository'].create.mockRejectedValue(prismaError);

      await expect(service.create(createDto)).rejects.toThrow(prismaError);
    });

    it('devrait propager les erreurs de validation de base de données', async () => {
      const dbError = new Error('Check constraint violation');
      service['studentRepository'].create.mockRejectedValue(dbError);

      await expect(service.create(createDto)).rejects.toThrow(dbError);
    });

    it('devrait gérer les erreurs de connexion à la base de données', async () => {
      const connectionError = new Error('Connection lost');
      service['studentRepository'].create.mockRejectedValue(connectionError);

      await expect(service.create(createDto)).rejects.toThrow(connectionError);
    });

    it('devrait gérer les erreurs de timeout', async () => {
      const timeoutError = new Error('Request timeout');
      service['studentRepository'].create.mockRejectedValue(timeoutError);

      await expect(service.create(createDto)).rejects.toThrow(timeoutError);
    });
  });

  describe('findOne() - Recherche par ID', () => {
    it('devrait retourner null si étudiant non trouvé', async () => {
      service['studentRepository'].findUnique.mockResolvedValue(null);

      const result = await service.findOne({ student_uuid: validUuid });

      expect(result).toBeNull();
    });

    it('devrait propager les erreurs de base de données', async () => {
      const dbError = new Error('Database error');
      service['studentRepository'].findUnique.mockRejectedValue(dbError);

      await expect(service.findOne({ student_uuid: validUuid })).rejects.toThrow(dbError);
    });

    it('devrait gérer les erreurs de format UUID invalide', async () => {
      const prismaError = new Error('Invalid UUID format');
      service['studentRepository'].findUnique.mockRejectedValue(prismaError);

      await expect(service.findOne({ student_uuid: 'invalid-uuid' })).rejects.toThrow(prismaError);
    });
  });

  describe('update() - Mise à jour d\'étudiant', () => {
    const updateDto: UpdateStudentDto = {
      student_firstname: 'Jean-Pierre',
    };

    it('devrait propager l\'erreur si étudiant non trouvé', async () => {
      service['studentRepository'].findUnique.mockResolvedValue(null);

      await expect(service.update({
        where: { student_uuid: validUuid },
        data: updateDto,
      })).rejects.toThrow('Étudiant non trouvé');
    });

    it('devrait propager l\'erreur Prisma P2002 (contrainte unique)', async () => {
      const prismaError = new Error('Unique constraint violation');
      (prismaError as any).code = 'P2002';
      (prismaError as any).meta = { target: ['student_mail'] };

      service['studentRepository'].findUnique.mockResolvedValue(mockStudent);
      service['studentRepository'].update.mockRejectedValue(prismaError);

      await expect(service.update({
        where: { student_uuid: validUuid },
        data: { student_mail: 'existing@example.com' },
      })).rejects.toThrow(prismaError);
    });

    it('devrait propager l\'erreur Prisma P2003 (contrainte de clé étrangère)', async () => {
      const prismaError = new Error('Foreign key constraint violation');
      (prismaError as any).code = 'P2003';

      service['studentRepository'].findUnique.mockResolvedValue(mockStudent);
      service['studentRepository'].update.mockRejectedValue(prismaError);

      await expect(service.update({
        where: { student_uuid: validUuid },
        data: { gender_uuid: 'non-existent-uuid' },
      })).rejects.toThrow(prismaError);
    });
  });

  describe('remove() - Suppression d\'étudiant', () => {
    it('devrait propager l\'erreur si étudiant non trouvé', async () => {
      service['studentRepository'].findUnique.mockResolvedValue(null);

      await expect(service.remove({ student_uuid: validUuid })).rejects.toThrow('Étudiant non trouvé');
    });

    it('devrait propager l\'erreur Prisma P2003 (contrainte de clé étrangère)', async () => {
      const prismaError = new Error('Foreign key constraint violation');
      (prismaError as any).code = 'P2003';
      (prismaError as any).meta = { field_name: 'student_uuid' };

      service['studentRepository'].findUnique.mockResolvedValue(mockStudent);
      service['studentRepository'].delete.mockRejectedValue(prismaError);

      await expect(service.remove({ student_uuid: validUuid })).rejects.toThrow(prismaError);
    });
  });

  describe('findAll() - Liste des étudiants', () => {
    it('devrait retourner une liste vide si aucun étudiant', async () => {
      service['studentRepository'].findMany.mockResolvedValue([]);

      const result = await service.findAll({});

      expect(result).toEqual([]);
    });

    it('devrait propager les erreurs de base de données', async () => {
      const dbError = new Error('Database connection error');
      service['studentRepository'].findMany.mockRejectedValue(dbError);

      await expect(service.findAll({})).rejects.toThrow(dbError);
    });

    it('devrait gérer les erreurs de syntaxe dans les filtres', async () => {
      const invalidFilter = { where: { student_uuid: { invalid: 'filter' } } };
      const prismaError = new Error('Invalid filter syntax');
      service['studentRepository'].findMany.mockRejectedValue(prismaError);

      await expect(service.findAll(invalidFilter as any)).rejects.toThrow(prismaError);
    });

    it('devrait propager les erreurs réseau', async () => {
      const networkError = new Error('ECONNREFUSED');
      service['studentRepository'].findMany.mockRejectedValue(networkError);

      await expect(service.findAll({})).rejects.toThrow(networkError);
    });
  });

  describe('updateStudentDisabilities() - Gestion des handicaps', () => {
    const studentId = validUuid;
    const disabilityIds = [validUuid, 'another-uuid'];

    it('devrait propager les erreurs de repository', async () => {
      const repositoryError = new Error('Repository failed');
      service['studentRepository'].findStudentDisabilities.mockRejectedValue(repositoryError);

      await expect(service.updateStudentDisabilities(studentId, disabilityIds))
        .rejects.toThrow(repositoryError);
    });

    it('devrait propager l\'erreur P2003 (clé étrangère invalide)', async () => {
      const prismaError = new Error('Foreign key constraint violation');
      (prismaError as any).code = 'P2003';
      (prismaError as any).meta = { field_name: 'disability_uuid' };

      service['studentRepository'].findStudentDisabilities.mockResolvedValue([]);
      service['studentRepository'].updateStudentDisabilities.mockRejectedValue(prismaError);

      await expect(service.updateStudentDisabilities(studentId, ['invalid-disability-uuid']))
        .rejects.toThrow(prismaError);
    });
  });

  describe('Gestion des erreurs génériques', () => {
    it('devrait propager les erreurs de validation Prisma', async () => {
      const validationError = new Error('Field validation failed');
      service['studentRepository'].create.mockRejectedValue(validationError);

      await expect(service.create({
        student_firstname: 'Test',
        student_lastname: 'Test',
        student_birthdate: new Date(),
        gender_uuid: validUuid,
        french_level_uuid: validUuid,
        nationality_uuid: validUuid,
        financing_uuid: validUuid,
        status_uuid: validUuid,
        orientation_uuid: validUuid,
        exit_reason_uuid: validUuid,
      })).rejects.toThrow(validationError);
    });
  });
});