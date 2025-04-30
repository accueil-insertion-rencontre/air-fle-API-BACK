import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import * as argon2 from 'argon2';
import { TransformInterceptor } from '../src/common/interceptors/transform.interceptor';
import { AllExceptionsFilter } from '../src/common/filters/http-exception.filter';
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';

describe('AbsenceController (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let adminJwtToken: string;
  let teacherJwtToken: string;
  let studentJwtToken: string;
  let testUserId: string;
  let testStudentId: string;
  let testCourseId: string;
  let createdAbsenceId: string | null;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    // Configurer l'application comme dans main.ts
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    app.useGlobalInterceptors(new TransformInterceptor());
    app.useGlobalFilters(new AllExceptionsFilter());
    app.enableCors();
    
    await app.init();

    prismaService = app.get<PrismaService>(PrismaService);

    // Créer les rôles nécessaires
    const adminRole = await prismaService.role.upsert({
      where: { rolename: 'ADMIN' },
      update: {},
      create: { rolename: 'ADMIN' },
    });

    const teacherRole = await prismaService.role.upsert({
      where: { rolename: 'TEACHER' },
      update: {},
      create: { rolename: 'TEACHER' },
    });

    // Créer un utilisateur admin pour les tests
    const hashedPasswordAdmin = await argon2.hash('admin123');
    const adminUser = await prismaService.user.upsert({
      where: { email: 'admin-test@example.com' },
      update: { password: hashedPasswordAdmin },
      create: {
        firstname: 'Admin',
        lastname: 'Test',
        email: 'admin-test@example.com',
        password: hashedPasswordAdmin,
        role: {
          connect: {
            id: adminRole.id,
          },
        },
      },
    });

    // Créer un utilisateur enseignant pour les tests
    const hashedPasswordTeacher = await argon2.hash('teacher123');
    const teacherUser = await prismaService.user.upsert({
      where: { email: 'teacher-test@example.com' },
      update: { password: hashedPasswordTeacher },
      create: {
        firstname: 'Teacher',
        lastname: 'Test',
        email: 'teacher-test@example.com',
        password: hashedPasswordTeacher,
        role: {
          connect: {
            id: teacherRole.id,
          },
        },
      },
    });

    testUserId = teacherUser.id;

    // Créer les éléments de référence pour les tests d'absence
    // Créer une nationalité
    const nationality = await prismaService.nationality.upsert({
      where: { id: 'test-nationality' },
      update: {},
      create: {
        id: 'test-nationality',
        label: 'Test Nationality',
      },
    });

    // Créer un niveau de français
    const frenchLevel = await prismaService.frenchLevel.upsert({
      where: { id: 'test-french-level' },
      update: {},
      create: {
        id: 'test-french-level',
        code: 'A1',
        description: 'Test Level',
      },
    });

    // Créer un genre
    const gender = await prismaService.gender.upsert({
      where: { id: 'test-gender' },
      update: {},
      create: {
        id: 'test-gender',
        label: 'Test Gender',
      },
    });

    // Créer un statut
    const status = await prismaService.status.upsert({
      where: { id: 'test-status' },
      update: {},
      create: {
        id: 'test-status',
        label: 'Test Status',
      },
    });

    // Créer un financement
    const financing = await prismaService.financing.upsert({
      where: { id: 'test-financing' },
      update: {},
      create: {
        id: 'test-financing',
        type: 'Test Financing',
      },
    });

    // Créer un étudiant pour les tests
    const student = await prismaService.student.upsert({
      where: { id: 'test-student-id' },
      update: {},
      create: {
        id: 'test-student-id',
        firstname: 'Test',
        lastname: 'Student',
        birthdate: new Date('1990-01-01'),
        gender: { connect: { id: gender.id } },
        initialLevel: { connect: { id: frenchLevel.id } },
        nationality: { connect: { id: nationality.id } },
        status: { connect: { id: status.id } },
        financing: { connect: { id: financing.id } },
      },
    });

    testStudentId = student.id;

    // Créer une session
    const session = await prismaService.session.upsert({
      where: { id: 'test-session' },
      update: {},
      create: {
        id: 'test-session',
        label: 'Test Session',
        startedAt: new Date(),
        finishedAt: new Date(new Date().setMonth(new Date().getMonth() + 3)),
      },
    });

    // Créer un groupe
    const group = await prismaService.group.upsert({
      where: { id: 'test-group' },
      update: {},
      create: {
        id: 'test-group',
        label: 'Test Group',
        session: { connect: { id: session.id } },
      },
    });

    // Créer un cours
    const course = await prismaService.course.upsert({
      where: { course_id: 'test-course-id' },
      update: {},
      create: {
        course_id: 'test-course-id',
        intitule: 'Test Course',
        day: new Date(),
        start_hour: new Date(),
        end_hour: new Date(new Date().setHours(new Date().getHours() + 2)),
        group: { connect: { id: group.id } },
      },
    });

    testCourseId = course.course_id;

    // Obtenir les tokens JWT pour les tests
    try {
      // Admin token
      const adminLoginResponse = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: 'admin-test@example.com',
          password: 'admin123',
        });

      adminJwtToken = adminLoginResponse.body.data.access_token;

      // Teacher token
      const teacherLoginResponse = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: 'teacher-test@example.com',
          password: 'teacher123',
        });

      teacherJwtToken = teacherLoginResponse.body.data.access_token;
    } catch (error) {
      console.error('Erreur lors de l\'obtention des tokens JWT:', error);
    }
  });

  afterEach(async () => {
    // Nettoyer les données de test
    if (createdAbsenceId) {
      await prismaService.absence.delete({
        where: { id: createdAbsenceId },
      }).catch(() => { /* Ignorer les erreurs si l'absence n'existe pas */ });
    }

    await prismaService.user.deleteMany({
      where: {
        OR: [
          { email: 'admin-test@example.com' },
          { email: 'teacher-test@example.com' }
        ]
      }
    });

    await app.close();
  });

  it('devrait créer une nouvelle absence (POST /api/v1/absences)', async () => {
    const createAbsenceDto = {
      student_id: testStudentId,
      course_id: testCourseId,
      reason: 'Test Reason',
    };

    const response = await request(app.getHttpServer())
      .post('/api/v1/absences')
      .set('Authorization', `Bearer ${adminJwtToken}`)
      .send(createAbsenceDto)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.student_id).toBe(testStudentId);
    expect(response.body.data.course_id).toBe(testCourseId);
    expect(response.body.data.reason).toBe('Test Reason');

    createdAbsenceId = response.body.data.id;
  });

  it('devrait récupérer toutes les absences (GET /api/v1/absences)', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/absences')
      .set('Authorization', `Bearer ${adminJwtToken}`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it('devrait filtrer les absences par étudiant (GET /api/v1/absences?studentId=...)', async () => {
    // D'abord créer une absence
    const createAbsenceDto = {
      student_id: testStudentId,
      course_id: testCourseId,
      reason: 'Test Reason',
    };

    const createResponse = await request(app.getHttpServer())
      .post('/api/v1/absences')
      .set('Authorization', `Bearer ${adminJwtToken}`)
      .send(createAbsenceDto);

    createdAbsenceId = createResponse.body.data.id;

    // Ensuite tester le filtrage
    const response = await request(app.getHttpServer())
      .get(`/api/v1/absences?studentId=${testStudentId}`)
      .set('Authorization', `Bearer ${adminJwtToken}`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();
    expect(Array.isArray(response.body.data)).toBe(true);
    
    // Si des résultats sont retournés, vérifier qu'ils correspondent bien à l'étudiant demandé
    if (response.body.data.length > 0) {
      expect(response.body.data.every(absence => absence.student_id === testStudentId)).toBe(true);
    }
  });

  it('devrait récupérer une absence par ID (GET /api/v1/absences/:id)', async () => {
    // D'abord créer une absence
    const createAbsenceDto = {
      student_id: testStudentId,
      course_id: testCourseId,
      reason: 'Test Reason',
    };

    const createResponse = await request(app.getHttpServer())
      .post('/api/v1/absences')
      .set('Authorization', `Bearer ${adminJwtToken}`)
      .send(createAbsenceDto);

    createdAbsenceId = createResponse.body.data.id;

    // Ensuite tester la récupération par ID
    const response = await request(app.getHttpServer())
      .get(`/api/v1/absences/${createdAbsenceId}`)
      .set('Authorization', `Bearer ${adminJwtToken}`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.id).toBe(createdAbsenceId);
    expect(response.body.data.student_id).toBe(testStudentId);
    expect(response.body.data.course_id).toBe(testCourseId);
  });

  it('devrait mettre à jour une absence (PATCH /api/v1/absences/:id)', async () => {
    // D'abord créer une absence
    const createAbsenceDto = {
      student_id: testStudentId,
      course_id: testCourseId,
      reason: 'Test Reason',
    };

    const createResponse = await request(app.getHttpServer())
      .post('/api/v1/absences')
      .set('Authorization', `Bearer ${adminJwtToken}`)
      .send(createAbsenceDto);

    createdAbsenceId = createResponse.body.data.id;

    // Ensuite tester la mise à jour
    const updateDto = {
      reason: 'Updated Test Reason',
    };

    const response = await request(app.getHttpServer())
      .patch(`/api/v1/absences/${createdAbsenceId}`)
      .set('Authorization', `Bearer ${adminJwtToken}`)
      .send(updateDto)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.id).toBe(createdAbsenceId);
    expect(response.body.data.reason).toBe('Updated Test Reason');
  });

  it('devrait supprimer une absence (DELETE /api/v1/absences/:id)', async () => {
    // D'abord créer une absence
    const createAbsenceDto = {
      student_id: testStudentId,
      course_id: testCourseId,
      reason: 'Test Reason',
    };

    const createResponse = await request(app.getHttpServer())
      .post('/api/v1/absences')
      .set('Authorization', `Bearer ${adminJwtToken}`)
      .send(createAbsenceDto);

    createdAbsenceId = createResponse.body.data.id;

    // Ensuite tester la suppression
    const response = await request(app.getHttpServer())
      .delete(`/api/v1/absences/${createdAbsenceId}`)
      .set('Authorization', `Bearer ${adminJwtToken}`)
      .expect(200);

    expect(response.body.success).toBe(true);

    // Vérifier que l'absence a bien été supprimée
    const checkResponse = await request(app.getHttpServer())
      .get(`/api/v1/absences/${createdAbsenceId}`)
      .set('Authorization', `Bearer ${adminJwtToken}`)
      .expect(404);

    // L'absence a été supprimée, donc on ne doit plus la trouver
    createdAbsenceId = null;  // Réinitialiser pour éviter une tentative de suppression dans afterEach
  });

  it('devrait refuser l\'accès si l\'utilisateur n\'a pas les droits requis', async () => {
    // Créer un utilisateur étudiant avec un rôle sans droits d'absence
    const studentRole = await prismaService.role.upsert({
      where: { rolename: 'STUDENT' },
      update: {},
      create: { rolename: 'STUDENT' },
    });

    const hashedPasswordStudent = await argon2.hash('student123');
    const studentUser = await prismaService.user.upsert({
      where: { email: 'student-test@example.com' },
      update: { password: hashedPasswordStudent },
      create: {
        firstname: 'Student',
        lastname: 'User',
        email: 'student-test@example.com',
        password: hashedPasswordStudent,
        role: {
          connect: {
            id: studentRole.id,
          },
        },
      },
    });

    // Obtenir un token pour l'étudiant
    const studentLoginResponse = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        email: 'student-test@example.com',
        password: 'student123',
      });

    studentJwtToken = studentLoginResponse.body.data.access_token;

    // Tenter de créer une absence avec le token étudiant
    const createAbsenceDto = {
      student_id: testStudentId,
      course_id: testCourseId,
      reason: 'Test Reason',
    };

    await request(app.getHttpServer())
      .post('/api/v1/absences')
      .set('Authorization', `Bearer ${studentJwtToken}`)
      .send(createAbsenceDto)
      .expect(403);  // Forbidden - pas les droits nécessaires
    
    // Nettoyer l'utilisateur étudiant
    await prismaService.user.delete({
      where: { email: 'student-test@example.com' }
    });
  });
}); 