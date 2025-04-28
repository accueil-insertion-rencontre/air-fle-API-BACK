import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { UpdateAddressDto } from './update-address.dto';
import { describe, it, expect, beforeEach } from 'vitest';

describe('UpdateAddressDto', () => {
  let dto: UpdateAddressDto;

  beforeEach(() => {
    dto = {
      street: '12 rue de Paris',
      zipcode: 75001,
      city: 'Paris',
      complement: 'Appartement 4B',
      qpv: 'Centre',
      country: 'France'
    };
  });

  it('devrait valider un DTO avec tous les champs', async () => {
    const dtoObj = plainToInstance(UpdateAddressDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBe(0);
  });

  it('devrait valider un DTO vide', async () => {
    const emptyDto = {};
    const dtoObj = plainToInstance(UpdateAddressDto, emptyDto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBe(0);
  });

  it('devrait valider un DTO avec seulement street', async () => {
    const partialDto = { street: '14 rue de Lyon' };
    const dtoObj = plainToInstance(UpdateAddressDto, partialDto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBe(0);
  });

  it('devrait valider un DTO avec seulement zipcode', async () => {
    const partialDto = { zipcode: 69001 };
    const dtoObj = plainToInstance(UpdateAddressDto, partialDto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBe(0);
  });

  it('devrait valider un DTO avec seulement city', async () => {
    const partialDto = { city: 'Lyon' };
    const dtoObj = plainToInstance(UpdateAddressDto, partialDto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBe(0);
  });

  // Tests de validation des types
  it('devrait échouer si street n\'est pas une chaîne', async () => {
    dto.street = 123 as any;
    const dtoObj = plainToInstance(UpdateAddressDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isString');
  });

  it('devrait convertir une chaîne numérique en nombre pour zipcode', async () => {
    // Note: class-transformer avec @Type(() => Number) convertit automatiquement
    // les chaînes numériques en nombres
    const testDto = { ...dto, zipcode: '75001' };
    const dtoObj = plainToInstance(UpdateAddressDto, testDto);
    const errors = await validate(dtoObj);
    
    // Aucune erreur car '75001' est converti en nombre 75001
    expect(errors.length).toBe(0);
    expect(typeof dtoObj.zipcode).toBe('number');
  });

  it('devrait échouer si zipcode est une chaîne non-numérique', async () => {
    const testDto = { ...dto, zipcode: 'abc' };
    const dtoObj = plainToInstance(UpdateAddressDto, testDto);
    const errors = await validate(dtoObj);
    
    // Doit échouer car 'abc' ne peut pas être converti en nombre valide
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isInt');
  });

  it('devrait échouer si city n\'est pas une chaîne', async () => {
    dto.city = 123 as any;
    const dtoObj = plainToInstance(UpdateAddressDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isString');
  });

  // Test de combinaison de champs
  it('devrait valider un DTO avec plusieurs champs', async () => {
    const partialDto = { 
      street: '15 avenue des Champs-Élysées',
      city: 'Paris',
      country: 'France'
    };
    const dtoObj = plainToInstance(UpdateAddressDto, partialDto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBe(0);
  });
}); 