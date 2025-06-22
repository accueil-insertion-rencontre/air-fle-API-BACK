import { Test, type TestingModule } from '@nestjs/testing';
import { GenderController } from './gender.controller';
import { GenderService } from './gender.service';
import { CreateGenderDto } from './dto/create-gender.dto';
import { UpdateGenderDto } from './dto/update-gender.dto';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('GenderController', () => {
  let controller: GenderController;
  let service: GenderService;

  const mockGenderService = {
    findAll: vi.fn(),
    findOne: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };

  beforeEach(async () => {
    service = mockGenderService as any;
    controller = new GenderController(service);

    // Réinitialiser les mocks avant chaque test
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of genders', async () => {
      const result = [
        {
          id: '1',
          label: 'Masculin',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      mockGenderService.findAll.mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
      expect(mockGenderService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single gender', async () => {
      const result = {
        id: '1',
        label: 'Masculin',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockGenderService.findOne.mockResolvedValue(result);

      expect(await controller.findOne('1')).toBe(result);
      expect(mockGenderService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('create', () => {
    it('should create a new gender', async () => {
      const createDto: CreateGenderDto = {
        label: 'Féminin',
      };
      const result = {
        id: '2',
        label: 'Féminin',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockGenderService.create.mockResolvedValue(result);

      expect(await controller.create(createDto)).toBe(result);
      expect(mockGenderService.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('update', () => {
    it('should update a gender', async () => {
      const updateDto: UpdateGenderDto = {
        label: 'Non-binaire',
      };
      const result = {
        id: '3',
        label: 'Non-binaire',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockGenderService.update.mockResolvedValue(result);

      expect(await controller.update('3', updateDto)).toBe(result);
      expect(mockGenderService.update).toHaveBeenCalledWith('3', updateDto);
    });
  });

  describe('delete', () => {
    it('should delete a gender', async () => {
      const result = {
        id: '1',
        label: 'Masculin',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockGenderService.delete.mockResolvedValue(result);

      expect(await controller.delete('1')).toBe(result);
      expect(mockGenderService.delete).toHaveBeenCalledWith('1');
    });
  });
});
