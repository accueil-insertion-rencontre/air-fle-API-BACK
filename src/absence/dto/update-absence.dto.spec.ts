import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { UpdateAbsenceDto } from './update-absence.dto';
import { describe, it, expect, beforeEach } from 'vitest';

describe('UpdateAbsenceDto', () => {
  let dto: UpdateAbsenceDto;

  beforeEach(() => {
    dto = {
      reason: 'Rendez-vous médical',
    };
  });

  it('devrait valider un DTO avec seulement une raison', async () => {
    const dtoObj = plainToInstance(UpdateAbsenceDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBe(0);
  });

  it('devrait valider un DTO avec student_id et course_id', async () => {
    dto.student_id = '550e8400-e29b-41d4-a716-446655440000';
    dto.course_id = '550e8400-e29b-41d4-a716-446655440001';
    const dtoObj = plainToInstance(UpdateAbsenceDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBe(0);
  });

  it('devrait valider un DTO vide', async () => {
    const emptyDto = {};
    const dtoObj = plainToInstance(UpdateAbsenceDto, emptyDto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBe(0);
  });

  // Tests pour student_id optionnel
  it("devrait échouer si student_id n'est pas un UUID valide", async () => {
    dto.student_id = 'not-a-uuid';
    const dtoObj = plainToInstance(UpdateAbsenceDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isUuid');
  });

  // Tests pour course_id optionnel
  it("devrait échouer si course_id n'est pas un UUID valide", async () => {
    dto.course_id = 'not-a-uuid';
    const dtoObj = plainToInstance(UpdateAbsenceDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isUuid');
  });

  // Tests pour reason optionnel
  it("devrait échouer si reason n'est pas une chaîne de caractères", async () => {
    dto.reason = 123 as any;
    const dtoObj = plainToInstance(UpdateAbsenceDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isString');
  });
});
