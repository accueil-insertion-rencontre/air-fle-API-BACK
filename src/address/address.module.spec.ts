import { Test, TestingModule } from '@nestjs/testing';
import { AddressModule } from './address.module';
import { AddressController } from './address.controller';
import { AddressService } from './address.service';
import { PrismaModule } from '../prisma/prisma.module';
import { describe, expect, it, beforeEach } from 'vitest';

describe('AddressModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [AddressModule],
    }).compile();
  });

  it('devrait être défini', () => {
    expect(module).toBeDefined();
  });

  it('devrait exporter le AddressService', () => {
    const addressService = module.get<AddressService>(AddressService);
    expect(addressService).toBeDefined();
  });

  it('devrait contenir le AddressController', () => {
    const addressController = module.get<AddressController>(AddressController);
    expect(addressController).toBeDefined();
  });

  it('devrait importer le PrismaModule', () => {
    // Vérification indirecte: si le PrismaModule n'était pas importé,
    // le AddressService ne pourrait pas être instancié car il dépend de PrismaService
    const addressService = module.get<AddressService>(AddressService);
    expect(addressService).toBeDefined();
  });
}); 