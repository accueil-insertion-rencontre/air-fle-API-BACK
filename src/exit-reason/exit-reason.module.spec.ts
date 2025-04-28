import { Test, TestingModule } from '@nestjs/testing';
import { ExitReasonModule } from './exit-reason.module';
import { ExitReasonService } from './exit-reason.service';
import { ExitReasonController } from './exit-reason.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { describe, expect, it, beforeEach } from 'vitest';

describe('ExitReasonModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [ExitReasonModule],
    }).compile();
  });

  it('devrait être défini', () => {
    expect(module).toBeDefined();
  });

  it('devrait exporter le service ExitReasonService', () => {
    const service = module.get<ExitReasonService>(ExitReasonService);
    expect(service).toBeDefined();
  });

  it('devrait avoir le contrôleur ExitReasonController', () => {
    const controller = module.get<ExitReasonController>(ExitReasonController);
    expect(controller).toBeDefined();
  });

  it('devrait importer le module PrismaModule', () => {
    // Vérification indirecte en contrôlant que le module a bien accès au service Prisma
    // via le service de raisons de sortie qui l'utilise
    const service = module.get<ExitReasonService>(ExitReasonService);
    expect(service).toBeDefined();
  });
}); 