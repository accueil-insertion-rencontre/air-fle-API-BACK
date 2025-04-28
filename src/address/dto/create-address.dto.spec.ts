import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateAddressDto } from './create-address.dto';
import { describe, it, expect, beforeEach } from 'vitest';

describe('CreateAddressDto', () => {
  let dto: CreateAddressDto;

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

  it('devrait valider un DTO correct', async () => {
    const dtoObj = plainToInstance(CreateAddressDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBe(0);
  });

  it('devrait valider un DTO sans champs optionnels', async () => {
    const { complement, qpv, country, ...requiredFields } = dto;
    const dtoObj = plainToInstance(CreateAddressDto, requiredFields);
    const errors = await validate(dtoObj);
    expect(errors.length).toBe(0);
  });

  // Tests pour street
  it('devrait échouer si street est absent', async () => {
    const { street, ...dtoWithoutStreet } = dto;
    const dtoObj = plainToInstance(CreateAddressDto, dtoWithoutStreet);
    const errors = await validate(dtoObj);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isString');
  });

  it('devrait échouer si street n\'est pas une chaîne', async () => {
    dto.street = 123 as any;
    const dtoObj = plainToInstance(CreateAddressDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isString');
  });

  // Tests pour zipcode
  it('devrait échouer si zipcode est absent', async () => {
    const { zipcode, ...dtoWithoutZipcode } = dto;
    const dtoObj = plainToInstance(CreateAddressDto, dtoWithoutZipcode);
    const errors = await validate(dtoObj);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isInt');
  });

  it('devrait convertir une chaîne numérique en nombre pour zipcode', async () => {
    // Note: class-transformer avec @Type(() => Number) convertit automatiquement
    // les chaînes numériques en nombres
    const testDto = { ...dto, zipcode: '75001' };
    const dtoObj = plainToInstance(CreateAddressDto, testDto);
    const errors = await validate(dtoObj);
    
    // Aucune erreur car '75001' est converti en nombre 75001
    expect(errors.length).toBe(0);
    expect(typeof dtoObj.zipcode).toBe('number');
  });

  it('devrait échouer si zipcode est une chaîne non-numérique', async () => {
    const testDto = { ...dto, zipcode: 'abc' };
    const dtoObj = plainToInstance(CreateAddressDto, testDto);
    const errors = await validate(dtoObj);
    
    // Doit échouer car 'abc' ne peut pas être converti en nombre valide
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isInt');
  });

  // Tests pour city
  it('devrait échouer si city est absent', async () => {
    const { city, ...dtoWithoutCity } = dto;
    const dtoObj = plainToInstance(CreateAddressDto, dtoWithoutCity);
    const errors = await validate(dtoObj);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isString');
  });

  it('devrait échouer si city n\'est pas une chaîne', async () => {
    dto.city = 123 as any;
    const dtoObj = plainToInstance(CreateAddressDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isString');
  });

  // Tests pour complement (optionnel)
  it('devrait valider un complement de type string', async () => {
    dto.complement = 'Bâtiment A';
    const dtoObj = plainToInstance(CreateAddressDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBe(0);
  });

  it('devrait valider un complement null', async () => {
    dto.complement = null;
    const dtoObj = plainToInstance(CreateAddressDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBe(0);
  });

  it('devrait échouer si complement n\'est pas une chaîne ou null', async () => {
    dto.complement = 123 as any;
    const dtoObj = plainToInstance(CreateAddressDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isString');
  });

  // Tests pour qpv (optionnel)
  it('devrait valider un qpv de type string', async () => {
    dto.qpv = 'Zone prioritaire';
    const dtoObj = plainToInstance(CreateAddressDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBe(0);
  });

  it('devrait valider un qpv null', async () => {
    dto.qpv = null;
    const dtoObj = plainToInstance(CreateAddressDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBe(0);
  });

  // Tests pour country (optionnel)
  it('devrait valider un country spécifique', async () => {
    dto.country = 'Belgique';
    const dtoObj = plainToInstance(CreateAddressDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBe(0);
  });
}); 