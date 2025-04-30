import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateDisabilityDto } from './create-disability.dto';
import { describe, it, expect, beforeEach } from 'vitest';

describe('CreateDisabilityDto', () => {
  let dto: CreateDisabilityDto;

  beforeEach(() => {
    dto = {
      label: 'Moteur',
      description: 'Handicap affectant la mobilité'
    };
  });

  it('devrait valider un DTO correct', async () => {
    const dtoObj = plainToInstance(CreateDisabilityDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBe(0);
  });

  it('devrait valider un DTO sans description (optionnelle)', async () => {
    const { description, ...requiredFields } = dto;
    const dtoObj = plainToInstance(CreateDisabilityDto, requiredFields);
    const errors = await validate(dtoObj);
    expect(errors.length).toBe(0);
  });

  // Tests pour label (obligatoire)
  it('devrait échouer si label est absent', async () => {
    const { label, ...dtoWithoutLabel } = dto;
    const dtoObj = plainToInstance(CreateDisabilityDto, dtoWithoutLabel);
    const errors = await validate(dtoObj);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isString');
  });

  it('devrait échouer si label n\'est pas une chaîne', async () => {
    dto.label = 123 as any;
    const dtoObj = plainToInstance(CreateDisabilityDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isString');
  });

  // Tests pour description (optionnelle)
  it('devrait échouer si description n\'est pas une chaîne', async () => {
    dto.description = 123 as any;
    const dtoObj = plainToInstance(CreateDisabilityDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isString');
  });
}); 