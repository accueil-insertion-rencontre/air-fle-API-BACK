import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { UpdateFinancingDto } from './update-financing.dto';
import { describe, it, expect } from 'vitest';

describe('UpdateFinancingDto', () => {
  it('devrait valider un DTO sans aucun champ (tous étant optionnels)', async () => {
    const dto = {};
    const dtoObj = plainToInstance(UpdateFinancingDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBe(0);
  });

  it('devrait valider un DTO avec type correctement renseigné', async () => {
    const dto = {
      type: 'Financement personnel',
    };
    const dtoObj = plainToInstance(UpdateFinancingDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBe(0);
  });

  it("devrait échouer si type n'est pas une chaîne", async () => {
    const dto = {
      type: 123,
    };
    const dtoObj = plainToInstance(UpdateFinancingDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isString');
  });
});
