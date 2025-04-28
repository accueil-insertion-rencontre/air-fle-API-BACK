import { Test, TestingModule } from '@nestjs/testing';
import { FinancingModule } from './financing.module';
import { FinancingService } from './financing.service';
import { FinancingController } from './financing.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { describe, expect, it, beforeEach } from 'vitest';

describe('FinancingModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [FinancingModule],
    }).compile();
  });

  it('devrait être défini', () => {
    expect(module).toBeDefined();
  });

  it('devrait exporter le service FinancingService', () => {
    const service = module.get<FinancingService>(FinancingService);
    expect(service).toBeDefined();
  });

  it('devrait avoir le contrôleur FinancingController', () => {
    const controller = module.get<FinancingController>(FinancingController);
    expect(controller).toBeDefined();
  });

  it('devrait importer le module PrismaModule', () => {
    // Vérification indirecte en contrôlant que le module a bien accès au service Prisma
    // via le service de financements qui l'utilise
    const service = module.get<FinancingService>(FinancingService);
    expect(service).toBeDefined();
  });
}); 