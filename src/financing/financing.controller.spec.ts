import { Test, TestingModule } from '@nestjs/testing';
import { FinancingController } from './financing.controller';
import { FinancingService } from './financing.service';
import { describe, expect, it, beforeEach, vi } from 'vitest';

describe('FinancingController', () => {
  let controller: FinancingController;
  let financingService: FinancingService;

  const mockFinancing = {
    id: 'financing-id',
    type: 'Pôle Emploi'
  };

  const financingServiceMock = {
    findAll: vi.fn(),
    findOne: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn()
  };

  beforeEach(async () => {
    controller = new FinancingController(financingServiceMock as unknown as FinancingService);
    financingService = financingServiceMock as unknown as FinancingService;
    
    // Reset les mocks après chaque test
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('devrait retourner tous les financements', async () => {
      financingServiceMock.findAll.mockResolvedValue([mockFinancing]);

      const result = await controller.findAll();

      expect(financingServiceMock.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockFinancing]);
    });
  });

  describe('findOne', () => {
    it('devrait retourner un financement par son id', async () => {
      financingServiceMock.findOne.mockResolvedValue(mockFinancing);

      const result = await controller.findOne('financing-id');

      expect(financingServiceMock.findOne).toHaveBeenCalledWith('financing-id');
      expect(result).toEqual(mockFinancing);
    });

    it('devrait retourner null si le financement n\'existe pas', async () => {
      financingServiceMock.findOne.mockResolvedValue(null);

      const result = await controller.findOne('nonexistent-id');

      expect(financingServiceMock.findOne).toHaveBeenCalledWith('nonexistent-id');
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('devrait créer un nouveau financement', async () => {
      const createFinancingData = {
        type: 'Pôle Emploi'
      };

      financingServiceMock.create.mockResolvedValue(mockFinancing);

      const result = await controller.create(createFinancingData);

      expect(financingServiceMock.create).toHaveBeenCalledWith(createFinancingData);
      expect(result).toEqual(mockFinancing);
    });
  });

  describe('update', () => {
    it('devrait mettre à jour un financement', async () => {
      const updateFinancingData = {
        type: 'Financement personnel'
      };

      const updatedFinancing = {
        ...mockFinancing,
        type: 'Financement personnel'
      };

      financingServiceMock.update.mockResolvedValue(updatedFinancing);

      const result = await controller.update('financing-id', updateFinancingData);

      expect(financingServiceMock.update).toHaveBeenCalledWith('financing-id', updateFinancingData);
      expect(result.type).toBe('Financement personnel');
    });
  });

  describe('delete', () => {
    it('devrait supprimer un financement', async () => {
      financingServiceMock.delete.mockResolvedValue(mockFinancing);

      const result = await controller.delete('financing-id');

      expect(financingServiceMock.delete).toHaveBeenCalledWith('financing-id');
      expect(result).toEqual(mockFinancing);
    });
  });
}); 