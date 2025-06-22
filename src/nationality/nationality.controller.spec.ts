import { Test, type TestingModule } from '@nestjs/testing';
import { NationalityController } from './nationality.controller';
import { NationalityService } from './nationality.service';
import { CreateNationalityDto } from './dto/create-nationality.dto';
import { UpdateNationalityDto } from './dto/update-nationality.dto';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('NationalityController', () => {
  let controller: NationalityController;
  let service: NationalityService;

  const mockNationalityService = {
    findAll: vi.fn(),
    findOne: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };

  beforeEach(async () => {
    service = mockNationalityService as any;
    controller = new NationalityController(service);

    // Réinitialiser les mocks avant chaque test
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of nationalities', async () => {
      const result = [
        {
          id: '1',
          label: 'Française',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      mockNationalityService.findAll.mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
      expect(mockNationalityService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single nationality', async () => {
      const result = {
        id: '1',
        label: 'Française',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockNationalityService.findOne.mockResolvedValue(result);

      expect(await controller.findOne('1')).toBe(result);
      expect(mockNationalityService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('create', () => {
    it('should create a new nationality', async () => {
      const createDto: CreateNationalityDto = {
        label: 'Espagnole',
      };
      const result = {
        id: '2',
        label: 'Espagnole',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockNationalityService.create.mockResolvedValue(result);

      expect(await controller.create(createDto)).toBe(result);
      expect(mockNationalityService.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('update', () => {
    it('should update a nationality', async () => {
      const updateDto: UpdateNationalityDto = {
        label: 'Italienne',
      };
      const result = {
        id: '3',
        label: 'Italienne',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockNationalityService.update.mockResolvedValue(result);

      expect(await controller.update('3', updateDto)).toBe(result);
      expect(mockNationalityService.update).toHaveBeenCalledWith(
        '3',
        updateDto,
      );
    });
  });

  describe('delete', () => {
    it('should delete a nationality', async () => {
      const result = {
        id: '1',
        label: 'Française',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockNationalityService.delete.mockResolvedValue(result);

      expect(await controller.delete('1')).toBe(result);
      expect(mockNationalityService.delete).toHaveBeenCalledWith('1');
    });
  });
});
