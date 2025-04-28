import { Test, TestingModule } from '@nestjs/testing';
import { AbsenceModule } from './absence.module';
import { AbsenceController } from './absence.controller';
import { AbsenceService } from './absence.service';
import { PrismaModule } from '../prisma/prisma.module';
import { describe, expect, it, beforeEach } from 'vitest';

describe('AbsenceModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [AbsenceModule],
    }).compile();
  });

  it('devrait être défini', () => {
    expect(module).toBeDefined();
  });

  it('devrait exporter le AbsenceService', () => {
    const absenceService = module.get<AbsenceService>(AbsenceService);
    expect(absenceService).toBeDefined();
  });

  it('devrait contenir le AbsenceController', () => {
    const absenceController = module.get<AbsenceController>(AbsenceController);
    expect(absenceController).toBeDefined();
  });

  it('devrait importer le PrismaModule', () => {
    // Vérification indirecte: si le PrismaModule n'était pas importé,
    // le AbsenceService ne pourrait pas être instancié car il dépend de PrismaService
    const absenceService = module.get<AbsenceService>(AbsenceService);
    expect(absenceService).toBeDefined();
  });
}); 