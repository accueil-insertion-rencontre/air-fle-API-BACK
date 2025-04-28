import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateCourseDto } from './create-course.dto';
import { describe, it, expect, beforeEach } from 'vitest';

describe('CreateCourseDto', () => {
  let dto: CreateCourseDto;
  const validUUID = '123e4567-e89b-12d3-a456-426614174000';

  beforeEach(() => {
    dto = {
      day: new Date('2023-09-01T00:00:00Z'),
      start_hour: new Date('2023-09-01T09:00:00Z'),
      end_hour: new Date('2023-09-01T11:00:00Z'),
      intitule: 'Français débutant - Module A1',
      group_id: validUUID
    };
  });

  it('devrait valider un DTO correct', async () => {
    const dtoObj = plainToInstance(CreateCourseDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBe(0);
  });

  it('devrait valider un DTO avec seulement les champs obligatoires', async () => {
    const { day, start_hour, end_hour, intitule, ...requiredFields } = dto;
    const dtoObj = plainToInstance(CreateCourseDto, requiredFields);
    const errors = await validate(dtoObj);
    expect(errors.length).toBe(0);
  });

  // Tests pour day (optionnel)
  it('devrait valider un day au format date', async () => {
    const testDto = { ...dto, day: '2023-09-01T00:00:00Z' };
    const dtoObj = plainToInstance(CreateCourseDto, testDto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBe(0);
  });

  it('devrait échouer si day n\'est pas un format de date valide', async () => {
    const testDto = { ...dto, day: 'not-a-date' };
    const dtoObj = plainToInstance(CreateCourseDto, testDto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isDate');
  });

  it('devrait valider si day est null', async () => {
    dto.day = null;
    const dtoObj = plainToInstance(CreateCourseDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBe(0);
  });

  // Tests pour start_hour (optionnel)
  it('devrait valider un start_hour au format date', async () => {
    const testDto = { ...dto, start_hour: '2023-09-01T09:00:00Z' };
    const dtoObj = plainToInstance(CreateCourseDto, testDto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBe(0);
  });

  it('devrait échouer si start_hour n\'est pas un format de date valide', async () => {
    const testDto = { ...dto, start_hour: 'not-a-date' };
    const dtoObj = plainToInstance(CreateCourseDto, testDto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isDate');
  });

  it('devrait valider si start_hour est null', async () => {
    dto.start_hour = null;
    const dtoObj = plainToInstance(CreateCourseDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBe(0);
  });

  // Tests pour end_hour (optionnel)
  it('devrait valider un end_hour au format date', async () => {
    const testDto = { ...dto, end_hour: '2023-09-01T11:00:00Z' };
    const dtoObj = plainToInstance(CreateCourseDto, testDto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBe(0);
  });

  it('devrait échouer si end_hour n\'est pas un format de date valide', async () => {
    const testDto = { ...dto, end_hour: 'not-a-date' };
    const dtoObj = plainToInstance(CreateCourseDto, testDto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isDate');
  });

  it('devrait valider si end_hour est null', async () => {
    dto.end_hour = null;
    const dtoObj = plainToInstance(CreateCourseDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBe(0);
  });

  // Tests pour intitule (optionnel)
  it('devrait valider un intitule de type string', async () => {
    dto.intitule = 'Cours de français';
    const dtoObj = plainToInstance(CreateCourseDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBe(0);
  });

  it('devrait échouer si intitule n\'est pas une chaîne', async () => {
    dto.intitule = 123 as any;
    const dtoObj = plainToInstance(CreateCourseDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isString');
  });

  it('devrait valider si intitule est null', async () => {
    dto.intitule = null;
    const dtoObj = plainToInstance(CreateCourseDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBe(0);
  });

  // Tests pour group_id (obligatoire)
  it('devrait échouer si group_id est absent', async () => {
    const { group_id, ...dtoWithoutGroupId } = dto;
    const dtoObj = plainToInstance(CreateCourseDto, dtoWithoutGroupId);
    const errors = await validate(dtoObj);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isUuid');
  });

  it('devrait échouer si group_id n\'est pas un UUID valide', async () => {
    dto.group_id = 'not-a-uuid';
    const dtoObj = plainToInstance(CreateCourseDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isUuid');
  });
}); 