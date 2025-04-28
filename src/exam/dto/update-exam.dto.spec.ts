import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { UpdateExamDto } from './update-exam.dto';
import { describe, it, expect } from 'vitest';

describe('UpdateExamDto', () => {
  const validUUID = '123e4567-e89b-12d3-a456-426614174000';

  it('devrait valider un DTO sans aucun champ (tous étant optionnels)', async () => {
    const dto = {};
    const dtoObj = plainToInstance(UpdateExamDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBe(0);
  });

  it('devrait valider un DTO avec tous les champs correctement renseignés', async () => {
    const dto = {
      label: 'Examen final A1',
      taked_at: new Date('2023-09-15T10:00:00Z'),
      note: 'B1 - 14/20',
      student_id: validUUID
    };
    const dtoObj = plainToInstance(UpdateExamDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBe(0);
  });

  it('devrait valider un DTO avec uniquement label mis à jour', async () => {
    const dto = {
      label: 'Examen final mis à jour'
    };
    const dtoObj = plainToInstance(UpdateExamDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBe(0);
  });

  it('devrait valider un DTO avec uniquement taked_at mis à jour', async () => {
    const dto = {
      taked_at: new Date('2023-09-20T10:00:00Z')
    };
    const dtoObj = plainToInstance(UpdateExamDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBe(0);
  });

  it('devrait valider un DTO avec uniquement note mis à jour', async () => {
    const dto = {
      note: 'A2 - 16/20'
    };
    const dtoObj = plainToInstance(UpdateExamDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBe(0);
  });

  it('devrait valider un DTO avec uniquement student_id mis à jour', async () => {
    const dto = {
      student_id: validUUID
    };
    const dtoObj = plainToInstance(UpdateExamDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBe(0);
  });

  it('devrait échouer si label n\'est pas une chaîne', async () => {
    const dto = {
      label: 123
    };
    const dtoObj = plainToInstance(UpdateExamDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isString');
  });

  it('devrait échouer si taked_at n\'est pas au format date valide', async () => {
    const dto = {
      taked_at: 'not-a-date'
    };
    const dtoObj = plainToInstance(UpdateExamDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isDate');
  });

  it('devrait échouer si note n\'est pas une chaîne', async () => {
    const dto = {
      note: 123
    };
    const dtoObj = plainToInstance(UpdateExamDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isString');
  });

  it('devrait échouer si student_id n\'est pas un UUID valide', async () => {
    const dto = {
      student_id: 'not-a-uuid'
    };
    const dtoObj = plainToInstance(UpdateExamDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isUuid');
  });
}); 