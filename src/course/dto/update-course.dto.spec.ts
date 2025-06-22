import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { UpdateCourseDto } from './update-course.dto';
import { describe, it, expect } from 'vitest';

describe('UpdateCourseDto', () => {
  const validUUID = '123e4567-e89b-12d3-a456-426614174000';

  it('devrait valider un DTO sans aucun champ (tous étant optionnels)', async () => {
    const dto = {};
    const dtoObj = plainToInstance(UpdateCourseDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBe(0);
  });

  it('devrait valider un DTO avec tous les champs correctement renseignés', async () => {
    const dto = {
      day: new Date('2023-09-01T00:00:00Z'),
      start_hour: new Date('2023-09-01T09:00:00Z'),
      end_hour: new Date('2023-09-01T11:00:00Z'),
      intitule: 'Français débutant - Module A1',
      group_id: validUUID,
    };
    const dtoObj = plainToInstance(UpdateCourseDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBe(0);
  });

  it('devrait valider un DTO avec uniquement day mis à jour', async () => {
    const dto = {
      day: new Date('2023-09-02T00:00:00Z'),
    };
    const dtoObj = plainToInstance(UpdateCourseDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBe(0);
  });

  it('devrait valider un DTO avec uniquement start_hour mis à jour', async () => {
    const dto = {
      start_hour: new Date('2023-09-01T10:00:00Z'),
    };
    const dtoObj = plainToInstance(UpdateCourseDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBe(0);
  });

  it('devrait valider un DTO avec uniquement end_hour mis à jour', async () => {
    const dto = {
      end_hour: new Date('2023-09-01T12:00:00Z'),
    };
    const dtoObj = plainToInstance(UpdateCourseDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBe(0);
  });

  it('devrait valider un DTO avec uniquement intitule mis à jour', async () => {
    const dto = {
      intitule: 'Nouveau titre du cours',
    };
    const dtoObj = plainToInstance(UpdateCourseDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBe(0);
  });

  it('devrait valider un DTO avec uniquement group_id mis à jour', async () => {
    const dto = {
      group_id: validUUID,
    };
    const dtoObj = plainToInstance(UpdateCourseDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBe(0);
  });

  it("devrait échouer si day n'est pas au format date valide", async () => {
    const dto = {
      day: 'not-a-date',
    };
    const dtoObj = plainToInstance(UpdateCourseDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isDate');
  });

  it("devrait échouer si start_hour n'est pas au format date valide", async () => {
    const dto = {
      start_hour: 'not-a-date',
    };
    const dtoObj = plainToInstance(UpdateCourseDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isDate');
  });

  it("devrait échouer si end_hour n'est pas au format date valide", async () => {
    const dto = {
      end_hour: 'not-a-date',
    };
    const dtoObj = plainToInstance(UpdateCourseDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isDate');
  });

  it("devrait échouer si intitule n'est pas une chaîne", async () => {
    const dto = {
      intitule: 123,
    };
    const dtoObj = plainToInstance(UpdateCourseDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isString');
  });

  it("devrait échouer si group_id n'est pas un UUID valide", async () => {
    const dto = {
      group_id: 'not-a-uuid',
    };
    const dtoObj = plainToInstance(UpdateCourseDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isUuid');
  });
});
