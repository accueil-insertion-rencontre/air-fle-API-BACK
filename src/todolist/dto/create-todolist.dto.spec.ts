import { validate } from 'class-validator';
import { CreateTodolistDto } from './create-todolist.dto';
import { plainToInstance } from 'class-transformer';
import { describe, it, expect, beforeEach } from 'vitest';

describe('CreateTodolistDto', () => {
  let dto: CreateTodolistDto;

  beforeEach(() => {
    dto = new CreateTodolistDto();
  });

  it('should be defined', () => {
    expect(dto).toBeDefined();
  });

  it('should validate with all required fields', async () => {
    dto.title = 'Test todolist';
    dto.user_id = '123e4567-e89b-42d3-a456-426614174000'; // UUID v4 valide corrigé

    const errors = await validate(dto);
    console.log('Required fields validation errors:', errors);
    expect(errors.length).toBe(0);
  });

  it('should validate with all fields', async () => {
    dto.title = 'Test todolist';
    dto.description = 'Description of the test todolist';
    dto.completionPercentage = '0';
    dto.dueAt = '2023-12-31T00:00:00.000Z';
    dto.user_id = '123e4567-e89b-42d3-a456-426614174000'; // UUID v4 valide corrigé

    const errors = await validate(dto);
    console.log('All fields validation errors:', errors);
    expect(errors.length).toBe(0);
  });

  it('should reject if title is missing', async () => {
    dto.user_id = '123e4567-e89b-42d3-a456-426614174000'; // UUID v4 valide corrigé

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('title');
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('should reject if user_id is missing', async () => {
    dto.title = 'Test todolist';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('user_id');
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('should reject if title is not a string', async () => {
    const plain = {
      title: 123,
      user_id: '123e4567-e89b-42d3-a456-426614174000' // UUID v4 valide corrigé
    };
    
    const dtoObj = plainToInstance(CreateTodolistDto, plain);
    const errors = await validate(dtoObj);
    
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('title');
    expect(errors[0].constraints).toHaveProperty('isString');
  });

  it('should reject if completionPercentage is not a decimal', async () => {
    const plain = {
      title: 'Test todolist',
      completionPercentage: 'not-a-decimal',
      user_id: '123e4567-e89b-42d3-a456-426614174000' // UUID v4 valide corrigé
    };
    
    const dtoObj = plainToInstance(CreateTodolistDto, plain);
    const errors = await validate(dtoObj);
    
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('completionPercentage');
    expect(errors[0].constraints).toHaveProperty('isDecimal');
  });

  it('should reject if user_id is not a valid UUID', async () => {
    const plain = {
      title: 'Test todolist',
      user_id: 'not-a-uuid'
    };
    
    const dtoObj = plainToInstance(CreateTodolistDto, plain);
    const errors = await validate(dtoObj);
    
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('user_id');
    expect(errors[0].constraints).toHaveProperty('isUuid');
  });

  it('should reject if dueAt is not a valid date string', async () => {
    const plain = {
      title: 'Test todolist',
      dueAt: 'not-a-date',
      user_id: '123e4567-e89b-42d3-a456-426614174000' // UUID v4 valide corrigé
    };
    
    const dtoObj = plainToInstance(CreateTodolistDto, plain);
    const errors = await validate(dtoObj);
    
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('dueAt');
    expect(errors[0].constraints).toHaveProperty('isDateString');
  });

  it('should reject if title exceeds max length', async () => {
    const plain = {
      title: 'A'.repeat(101), // MaxLength est 100
      user_id: '123e4567-e89b-42d3-a456-426614174000' // UUID v4 valide corrigé
    };
    
    const dtoObj = plainToInstance(CreateTodolistDto, plain);
    const errors = await validate(dtoObj);
    
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('title');
    expect(errors[0].constraints).toHaveProperty('maxLength');
  });
}); 