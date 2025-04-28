import { Test, TestingModule } from '@nestjs/testing';
import { AddressController } from './address.controller';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { describe, expect, it, beforeEach, vi } from 'vitest';

describe('AddressController', () => {
  let controller: AddressController;

  const mockAddress = {
    id: 'address-id',
    street: '12 rue de Paris',
    complement: 'Appartement 4B',
    zipcode: 75001,
    city: 'Paris',
    country: 'France'
  };

  const addressServiceMock = {
    findAll: vi.fn(),
    findOne: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn()
  };

  beforeEach(async () => {
    controller = new AddressController(addressServiceMock as unknown as AddressService);
    
    // Reset les mocks après chaque test
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('devrait retourner toutes les adresses', async () => {
      addressServiceMock.findAll.mockResolvedValue([mockAddress]);

      const result = await controller.findAll();

      expect(addressServiceMock.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockAddress]);
    });
  });

  describe('findOne', () => {
    it('devrait retourner une adresse par son id', async () => {
      addressServiceMock.findOne.mockResolvedValue(mockAddress);

      const result = await controller.findOne('address-id');

      expect(addressServiceMock.findOne).toHaveBeenCalledWith('address-id');
      expect(result).toEqual(mockAddress);
    });

    it('devrait retourner null si l\'adresse n\'existe pas', async () => {
      addressServiceMock.findOne.mockResolvedValue(null);

      const result = await controller.findOne('nonexistent-id');

      expect(addressServiceMock.findOne).toHaveBeenCalledWith('nonexistent-id');
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('devrait créer une nouvelle adresse', async () => {
      const createAddressDto: CreateAddressDto = {
        street: '12 rue de Paris',
        complement: 'Appartement 4B',
        zipcode: 75001,
        city: 'Paris',
        country: 'France'
      };

      addressServiceMock.create.mockResolvedValue(mockAddress);

      const result = await controller.create(createAddressDto);

      expect(addressServiceMock.create).toHaveBeenCalledWith(createAddressDto);
      expect(result).toEqual(mockAddress);
    });
  });

  describe('update', () => {
    it('devrait mettre à jour une adresse', async () => {
      const updateAddressDto: UpdateAddressDto = {
        city: 'Lyon'
      };

      const updatedAddress = {
        ...mockAddress,
        city: 'Lyon'
      };

      addressServiceMock.update.mockResolvedValue(updatedAddress);

      const result = await controller.update('address-id', updateAddressDto);

      expect(addressServiceMock.update).toHaveBeenCalledWith('address-id', updateAddressDto);
      expect(result.city).toBe('Lyon');
    });
  });

  describe('delete', () => {
    it('devrait supprimer une adresse', async () => {
      addressServiceMock.delete.mockResolvedValue(mockAddress);

      const result = await controller.delete('address-id');

      expect(addressServiceMock.delete).toHaveBeenCalledWith('address-id');
      expect(result).toEqual(mockAddress);
    });
  });
}); 