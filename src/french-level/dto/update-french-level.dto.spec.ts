import { validate } from 'class-validator';
import { UpdateFrenchLevelDto } from './update-french-level.dto';
import { plainToInstance } from 'class-transformer';
import { describe, it, expect, beforeEach } from 'vitest';

describe('UpdateFrenchLevelDto', () => {
  let dto: UpdateFrenchLevelDto;

  beforeEach(() => {
    dto = new UpdateFrenchLevelDto();
  });

  it('should be defined', () => {
    expect(dto).toBeDefined();
  });

  it('should validate when all fields are provided', async () => {
    dto.code = 'A1';
    dto.description = 'Niveau débutant';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should validate when only code is provided', async () => {
    dto.code = 'A1';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should validate when only description is provided', async () => {
    dto.description = 'Niveau débutant';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should validate when no fields are provided', async () => {
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should reject if code is not a string', async () => {
    const plain = {
      code: 123,
    };

    const dtoObj = plainToInstance(UpdateFrenchLevelDto, plain);
    const errors = await validate(dtoObj);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('code');
    expect(errors[0].constraints).toHaveProperty('isString');
  });

  it('should reject if code exceeds max length', async () => {
    dto.code = 'A'.repeat(11); // Max is 10

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('code');
    expect(errors[0].constraints).toHaveProperty('maxLength');
  });

  it('should reject if description is not a string', async () => {
    const plain = {
      description: 123,
    };

    const dtoObj = plainToInstance(UpdateFrenchLevelDto, plain);
    const errors = await validate(dtoObj);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('description');
    expect(errors[0].constraints).toHaveProperty('isString');
  });

  it('should reject if description exceeds max length', async () => {
    dto.description = 'A'.repeat(256); // Max is 255

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('description');
    expect(errors[0].constraints).toHaveProperty('maxLength');
  });
});
