import { Test, TestingModule } from '@nestjs/testing';
import { ExamModule } from './exam.module';
import { ExamService } from './exam.service';
import { ExamController } from './exam.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { describe, expect, it, beforeEach } from 'vitest';

describe('ExamModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [ExamModule],
    }).compile();
  });

  it('devrait être défini', () => {
    expect(module).toBeDefined();
  });

  it('devrait exporter le service ExamService', () => {
    const service = module.get<ExamService>(ExamService);
    expect(service).toBeDefined();
  });

  it('devrait avoir le contrôleur ExamController', () => {
    const controller = module.get<ExamController>(ExamController);
    expect(controller).toBeDefined();
  });

  it('devrait importer le module PrismaModule', () => {
    // Vérification indirecte en contrôlant que le module a bien accès au service Prisma
    // via le service d'examens qui l'utilise
    const service = module.get<ExamService>(ExamService);
    expect(service).toBeDefined();
  });
}); 