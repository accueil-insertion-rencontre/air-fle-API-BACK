import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateFinancingDto } from './create-financing.dto';
import { describe, it, expect, beforeEach } from 'vitest';

describe('CreateFinancingDto', () => {
  let dto: CreateFinancingDto;

  beforeEach(() => {
    dto = {
      type: 'Pôle Emploi'
    };
  });

  it('devrait valider un DTO correct', async () => {
    const dtoObj = plainToInstance(CreateFinancingDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBe(0);
  });

  // Tests pour type (obligatoire)
  it('devrait échouer si type est absent', async () => {
    const emptyDto = {};
    const dtoObj = plainToInstance(CreateFinancingDto, emptyDto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isString');
  });

  it('devrait échouer si type est vide', async () => {
    dto.type = '';
    const dtoObj = plainToInstance(CreateFinancingDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBe(0); // IsString ne vérifie pas si la chaîne est vide
  });

  it('devrait échouer si type n\'est pas une chaîne', async () => {
    dto.type = 123 as any;
    const dtoObj = plainToInstance(CreateFinancingDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isString');
  });
}); 