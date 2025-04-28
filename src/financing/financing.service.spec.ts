import { Test, TestingModule } from '@nestjs/testing';
import { FinancingService } from './financing.service';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { describe, expect, it, beforeEach, vi } from 'vitest';

describe('FinancingService', () => {
  let service: FinancingService;

  const mockFinancing = {
    id: 'financing-id',
    type: 'Pôle Emploi'
  };

  const prismaMock = {
    financing: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn()
    }
  };

  beforeEach(async () => {
    service = new FinancingService(prismaMock as unknown as PrismaService);
    
    // Réinitialisation des mocks à chaque test
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('devrait retourner tous les financements', async () => {
      prismaMock.financing.findMany.mockResolvedValue([mockFinancing]);

      const result = await service.findAll();
      
      expect(prismaMock.financing.findMany).toHaveBeenCalled();
      expect(result).toEqual([mockFinancing]);
    });
  });

  describe('findOne', () => {
    it('devrait retourner un financement par son id', async () => {
      prismaMock.financing.findUnique.mockResolvedValue(mockFinancing);

      const result = await service.findOne('financing-id');
      
      expect(prismaMock.financing.findUnique).toHaveBeenCalledWith({
        where: { id: 'financing-id' }
      });
      expect(result).toEqual(mockFinancing);
    });

    it('devrait retourner null si le financement n\'existe pas', async () => {
      prismaMock.financing.findUnique.mockResolvedValue(null);

      const result = await service.findOne('nonexistent-id');
      
      expect(prismaMock.financing.findUnique).toHaveBeenCalledWith({
        where: { id: 'nonexistent-id' }
      });
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('devrait créer un nouveau financement', async () => {
      const createData: Prisma.FinancingCreateInput = {
        type: 'Pôle Emploi'
      };

      prismaMock.financing.create.mockResolvedValue(mockFinancing);

      const result = await service.create(createData);
      
      expect(prismaMock.financing.create).toHaveBeenCalledWith({
        data: createData
      });
      expect(result).toEqual(mockFinancing);
    });
  });

  describe('update', () => {
    it('devrait mettre à jour un financement', async () => {
      const updateData: Prisma.FinancingUpdateInput = {
        type: 'Financement personnel'
      };

      const updatedFinancing = {
        ...mockFinancing,
        type: 'Financement personnel'
      };

      prismaMock.financing.update.mockResolvedValue(updatedFinancing);

      const result = await service.update('financing-id', updateData);
      
      expect(prismaMock.financing.update).toHaveBeenCalledWith({
        where: { id: 'financing-id' },
        data: updateData
      });
      expect(result.type).toBe('Financement personnel');
    });
  });

  describe('delete', () => {
    it('devrait supprimer un financement', async () => {
      prismaMock.financing.delete.mockResolvedValue(mockFinancing);

      const result = await service.delete('financing-id');
      
      expect(prismaMock.financing.delete).toHaveBeenCalledWith({
        where: { id: 'financing-id' }
      });
      expect(result).toEqual(mockFinancing);
    });
  });
}); 