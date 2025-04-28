import { Test, TestingModule } from '@nestjs/testing';
import { AddressService } from './address.service';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('AddressService', () => {
  let service: AddressService;

  const mockAddress = {
    id: 'address-id',
    street: '12 rue de Paris',
    complement: 'Appartement 4B',
    zipcode: 75001,
    city: 'Paris',
    country: 'France'
  };

  const prismaMock = {
    address: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn()
    }
  };

  beforeEach(async () => {
    service = new AddressService(prismaMock as unknown as PrismaService);
    
    // Réinitialisation des mocks à chaque test
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('devrait retourner toutes les adresses', async () => {
      prismaMock.address.findMany.mockResolvedValue([mockAddress]);

      const result = await service.findAll();
      
      expect(prismaMock.address.findMany).toHaveBeenCalled();
      expect(result).toEqual([mockAddress]);
    });
  });

  describe('findOne', () => {
    it('devrait retourner une adresse par son id', async () => {
      prismaMock.address.findUnique.mockResolvedValue(mockAddress);

      const result = await service.findOne('address-id');
      
      expect(prismaMock.address.findUnique).toHaveBeenCalledWith({
        where: { id: 'address-id' }
      });
      expect(result).toEqual(mockAddress);
    });

    it('devrait retourner null si l\'adresse n\'existe pas', async () => {
      prismaMock.address.findUnique.mockResolvedValue(null);

      const result = await service.findOne('nonexistent-id');
      
      expect(prismaMock.address.findUnique).toHaveBeenCalledWith({
        where: { id: 'nonexistent-id' }
      });
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('devrait créer une nouvelle adresse', async () => {
      const createData: Prisma.AddressCreateInput = {
        street: '12 rue de Paris',
        complement: 'Appartement 4B',
        zipcode: 75001,
        city: 'Paris',
        country: 'France'
      };

      prismaMock.address.create.mockResolvedValue(mockAddress);

      const result = await service.create(createData);
      
      expect(prismaMock.address.create).toHaveBeenCalledWith({
        data: createData
      });
      expect(result).toEqual(mockAddress);
    });
  });

  describe('update', () => {
    it('devrait mettre à jour une adresse', async () => {
      const updateData: Prisma.AddressUpdateInput = {
        city: 'Lyon'
      };

      const updatedAddress = {
        ...mockAddress,
        city: 'Lyon'
      };

      prismaMock.address.update.mockResolvedValue(updatedAddress);

      const result = await service.update('address-id', updateData);
      
      expect(prismaMock.address.update).toHaveBeenCalledWith({
        where: { id: 'address-id' },
        data: updateData
      });
      expect(result.city).toBe('Lyon');
    });
  });

  describe('delete', () => {
    it('devrait supprimer une adresse', async () => {
      prismaMock.address.delete.mockResolvedValue(mockAddress);

      const result = await service.delete('address-id');
      
      expect(prismaMock.address.delete).toHaveBeenCalledWith({
        where: { id: 'address-id' }
      });
      expect(result).toEqual(mockAddress);
    });
  });
}); 