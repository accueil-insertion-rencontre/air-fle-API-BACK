import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateAbsenceDto } from './create-absence.dto';
import { describe, it, expect, beforeEach } from 'vitest';

describe('CreateAbsenceDto', () => {
  let dto: CreateAbsenceDto;

  beforeEach(() => {
    dto = {
      student_id: '550e8400-e29b-41d4-a716-446655440000',
      course_id: '550e8400-e29b-41d4-a716-446655440001',
      reason: 'Maladie',
    };
  });

  it('devrait valider un DTO correct', async () => {
    const dtoObj = plainToInstance(CreateAbsenceDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBe(0);
  });

  it('devrait valider un DTO sans raison', async () => {
    const { reason, ...dtoWithoutReason } = dto;
    const dtoObj = plainToInstance(CreateAbsenceDto, dtoWithoutReason);
    const errors = await validate(dtoObj);
    expect(errors.length).toBe(0);
  });

  // Tests pour student_id
  it("devrait échouer si student_id n'est pas un UUID valide", async () => {
    dto.student_id = 'not-a-uuid';
    const dtoObj = plainToInstance(CreateAbsenceDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isUuid');
  });

  it('devrait échouer si student_id est vide', async () => {
    dto.student_id = '';
    const dtoObj = plainToInstance(CreateAbsenceDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('devrait échouer si student_id est absent', async () => {
    const { student_id, ...dtoWithoutStudentId } = dto;
    const dtoObj = plainToInstance(CreateAbsenceDto, dtoWithoutStudentId);
    const errors = await validate(dtoObj);
    expect(errors.length).toBeGreaterThan(0);
  });

  // Tests pour course_id
  it("devrait échouer si course_id n'est pas un UUID valide", async () => {
    dto.course_id = 'not-a-uuid';
    const dtoObj = plainToInstance(CreateAbsenceDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isUuid');
  });

  it('devrait échouer si course_id est vide', async () => {
    dto.course_id = '';
    const dtoObj = plainToInstance(CreateAbsenceDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('devrait échouer si course_id est absent', async () => {
    const { course_id, ...dtoWithoutCourseId } = dto;
    const dtoObj = plainToInstance(CreateAbsenceDto, dtoWithoutCourseId);
    const errors = await validate(dtoObj);
    expect(errors.length).toBeGreaterThan(0);
  });

  // Tests pour reason
  it("devrait échouer si reason n'est pas une chaîne de caractères", async () => {
    dto.reason = 123 as any;
    const dtoObj = plainToInstance(CreateAbsenceDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isString');
  });

  // Tests critiques de sécurité
  it('devrait valider une raison avec caractères spéciaux autorisés', async () => {
    dto.reason = 'Maladie: grippe saisonnière';
    const dtoObj = plainToInstance(CreateAbsenceDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBe(0);
  });
});
