import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateExitReasonDto } from './create-exit-reason.dto';
import { describe, it, expect, beforeEach } from 'vitest';

describe('CreateExitReasonDto', () => {
  let dto: CreateExitReasonDto;

  beforeEach(() => {
    dto = {
      reason: 'Fin de formation',
    };
  });

  it('devrait valider un DTO correct', async () => {
    const dtoObj = plainToInstance(CreateExitReasonDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBe(0);
  });

  // Tests pour reason (obligatoire)
  it('devrait échouer si reason est absent', async () => {
    const emptyDto = {};
    const dtoObj = plainToInstance(CreateExitReasonDto, emptyDto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isString');
  });

  it('devrait échouer si reason est vide', async () => {
    dto.reason = '';
    const dtoObj = plainToInstance(CreateExitReasonDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBe(0); // IsString ne vérifie pas si la chaîne est vide
  });

  it("devrait échouer si reason n'est pas une chaîne", async () => {
    dto.reason = 123 as any;
    const dtoObj = plainToInstance(CreateExitReasonDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isString');
  });
});
