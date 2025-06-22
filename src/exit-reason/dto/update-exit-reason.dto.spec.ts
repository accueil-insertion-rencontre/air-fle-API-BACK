import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { UpdateExitReasonDto } from './update-exit-reason.dto';
import { describe, it, expect } from 'vitest';

describe('UpdateExitReasonDto', () => {
  it('devrait valider un DTO sans aucun champ (tous étant optionnels)', async () => {
    const dto = {};
    const dtoObj = plainToInstance(UpdateExitReasonDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBe(0);
  });

  it('devrait valider un DTO avec reason correctement renseigné', async () => {
    const dto = {
      reason: 'Nouvelle raison de sortie',
    };
    const dtoObj = plainToInstance(UpdateExitReasonDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBe(0);
  });

  it("devrait échouer si reason n'est pas une chaîne", async () => {
    const dto = {
      reason: 123,
    };
    const dtoObj = plainToInstance(UpdateExitReasonDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isString');
  });
});
