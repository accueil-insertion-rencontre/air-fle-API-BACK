import { validate } from 'class-validator';
import { CreateFrenchLevelDto } from './create-french-level.dto';
import { plainToInstance } from 'class-transformer';
import { describe, it, expect, beforeEach } from 'vitest';

describe('CreateFrenchLevelDto', () => {
  let dto: CreateFrenchLevelDto;

  beforeEach(() => {
    dto = new CreateFrenchLevelDto();
  });

  it('should be defined', () => {
    expect(dto).toBeDefined();
  });

  it('should validate with optional fields only', async () => {
    dto.code = 'A1';
    dto.description = 'Niveau débutant';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should validate when all fields are provided', async () => {
    dto.code = 'A1';
    dto.description = 'Niveau débutant';
    
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should validate when no fields are provided (all are optional)', async () => {
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should reject if code is not a string', async () => {
    const plain = {
      code: 123,
      description: 'Niveau débutant'
    };
    
    const dtoObj = plainToInstance(CreateFrenchLevelDto, plain);
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
      code: 'A1',
      description: 123
    };
    
    const dtoObj = plainToInstance(CreateFrenchLevelDto, plain);
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