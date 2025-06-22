import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateExamDto } from './create-exam.dto';
import { describe, it, expect, beforeEach } from 'vitest';

describe('CreateExamDto', () => {
  let dto: CreateExamDto;
  const validUUID = '123e4567-e89b-12d3-a456-426614174000';

  beforeEach(() => {
    dto = {
      label: 'Examen final A1',
      taked_at: new Date('2023-09-15T10:00:00Z'),
      note: 'B1 - 14/20',
      student_id: validUUID,
    };
  });

  it('devrait valider un DTO correct', async () => {
    const dtoObj = plainToInstance(CreateExamDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBe(0);
  });

  it('devrait valider un DTO sans note (optionnel)', async () => {
    const { note, ...requiredFields } = dto;
    const dtoObj = plainToInstance(CreateExamDto, requiredFields);
    const errors = await validate(dtoObj);
    expect(errors.length).toBe(0);
  });

  // Tests pour label (obligatoire)
  it('devrait échouer si label est absent', async () => {
    const { label, ...dtoWithoutLabel } = dto;
    const dtoObj = plainToInstance(CreateExamDto, dtoWithoutLabel);
    const errors = await validate(dtoObj);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isString');
  });

  it("devrait échouer si label n'est pas une chaîne", async () => {
    dto.label = 123 as any;
    const dtoObj = plainToInstance(CreateExamDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isString');
  });

  // Tests pour taked_at (obligatoire)
  it('devrait échouer si taked_at est absent', async () => {
    const { taked_at, ...dtoWithoutTakedAt } = dto;
    const dtoObj = plainToInstance(CreateExamDto, dtoWithoutTakedAt);
    const errors = await validate(dtoObj);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isDate');
  });

  it('devrait valider taked_at au format date', async () => {
    const testDto = { ...dto, taked_at: '2023-09-15T10:00:00Z' };
    const dtoObj = plainToInstance(CreateExamDto, testDto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBe(0);
  });

  it("devrait échouer si taked_at n'est pas un format de date valide", async () => {
    const testDto = { ...dto, taked_at: 'not-a-date' };
    const dtoObj = plainToInstance(CreateExamDto, testDto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isDate');
  });

  // Tests pour note (optionnel)
  it('devrait valider une note de type string', async () => {
    dto.note = 'Réussite A2';
    const dtoObj = plainToInstance(CreateExamDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBe(0);
  });

  it("devrait échouer si note n'est pas une chaîne", async () => {
    dto.note = 123 as any;
    const dtoObj = plainToInstance(CreateExamDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isString');
  });

  it('devrait valider si note est null', async () => {
    dto.note = null;
    const dtoObj = plainToInstance(CreateExamDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBe(0);
  });

  // Tests pour student_id (obligatoire)
  it('devrait échouer si student_id est absent', async () => {
    const { student_id, ...dtoWithoutStudentId } = dto;
    const dtoObj = plainToInstance(CreateExamDto, dtoWithoutStudentId);
    const errors = await validate(dtoObj);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isUuid');
  });

  it("devrait échouer si student_id n'est pas un UUID valide", async () => {
    dto.student_id = 'not-a-uuid';
    const dtoObj = plainToInstance(CreateExamDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isUuid');
  });
});
