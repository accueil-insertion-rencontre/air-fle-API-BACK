import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { StudentDisabilityDto } from './student-disability.dto';
import { describe, it, expect, beforeEach } from 'vitest';

describe('StudentDisabilityDto', () => {
  let dto: StudentDisabilityDto;
  const validUUIDs = [
    '550e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440001'
  ];

  beforeEach(() => {
    dto = {
      disability_ids: validUUIDs
    };
  });

  it('devrait valider un DTO correct avec plusieurs UUIDs', async () => {
    const dtoObj = plainToInstance(StudentDisabilityDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBe(0);
  });

  it('devrait valider un DTO avec un seul UUID', async () => {
    dto.disability_ids = [validUUIDs[0]];
    const dtoObj = plainToInstance(StudentDisabilityDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBe(0);
  });

  it('devrait valider un DTO avec un tableau vide', async () => {
    dto.disability_ids = [];
    const dtoObj = plainToInstance(StudentDisabilityDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBe(0);
  });

  it('devrait échouer si disability_ids est absent', async () => {
    const { disability_ids, ...dtoWithoutIds } = dto;
    const dtoObj = plainToInstance(StudentDisabilityDto, dtoWithoutIds);
    const errors = await validate(dtoObj);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isArray');
  });

  it('devrait échouer si disability_ids n\'est pas un tableau', async () => {
    dto.disability_ids = 'invalid' as any;
    const dtoObj = plainToInstance(StudentDisabilityDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isArray');
  });

  it('devrait échouer si un élément du tableau n\'est pas un UUID valide', async () => {
    dto.disability_ids = [...validUUIDs, 'invalid-uuid'];
    const dtoObj = plainToInstance(StudentDisabilityDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isUuid');
  });
}); 