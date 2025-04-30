import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { UpdateDisabilityDto } from './update-disability.dto';
import { describe, it, expect } from 'vitest';

describe('UpdateDisabilityDto', () => {
  it('devrait valider un DTO sans aucun champ (tous étant optionnels)', async () => {
    const dto = {};
    const dtoObj = plainToInstance(UpdateDisabilityDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBe(0);
  });

  it('devrait valider un DTO avec tous les champs correctement renseignés', async () => {
    const dto = {
      label: 'Moteur',
      description: 'Handicap affectant la mobilité'
    };
    const dtoObj = plainToInstance(UpdateDisabilityDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBe(0);
  });

  it('devrait valider un DTO avec uniquement label', async () => {
    const dto = {
      label: 'Visuel'
    };
    const dtoObj = plainToInstance(UpdateDisabilityDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBe(0);
  });

  it('devrait valider un DTO avec uniquement description', async () => {
    const dto = {
      description: 'Handicap affectant la vision'
    };
    const dtoObj = plainToInstance(UpdateDisabilityDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBe(0);
  });

  it('devrait échouer si label n\'est pas une chaîne', async () => {
    const dto = {
      label: 123
    };
    const dtoObj = plainToInstance(UpdateDisabilityDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isString');
  });

  it('devrait échouer si description n\'est pas une chaîne', async () => {
    const dto = {
      description: 123
    };
    const dtoObj = plainToInstance(UpdateDisabilityDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isString');
  });
}); 