import { validate } from 'class-validator';
import { UpdateTodolistDto } from './update-todolist.dto';
import { plainToInstance } from 'class-transformer';
import { describe, it, expect, beforeEach } from 'vitest';

describe('UpdateTodolistDto', () => {
  let dto: UpdateTodolistDto;

  beforeEach(() => {
    dto = new UpdateTodolistDto();
  });

  it('should be defined', () => {
    expect(dto).toBeDefined();
  });

  it('should validate with empty object (all fields optional)', async () => {
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should validate with some fields', async () => {
    dto.title = 'Updated title';
    dto.description = 'Updated description';
    
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should validate with completionPercentage', async () => {
    dto.completionPercentage = '50';
    
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should validate with dueAt', async () => {
    dto.dueAt = '2024-12-31T00:00:00.000Z';
    
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should validate with user_id', async () => {
    dto.user_id = '123e4567-e89b-42d3-a456-426614174000';
    
    const errors = await validate(dto);
    console.log('user_id validation errors:', errors);
    expect(errors.length).toBe(0);
  });

  it('should validate with all fields', async () => {
    dto.title = 'Updated title';
    dto.description = 'Updated description';
    dto.completionPercentage = '50';
    dto.dueAt = '2024-12-31T00:00:00.000Z';
    dto.user_id = '123e4567-e89b-42d3-a456-426614174000';
    
    const errors = await validate(dto);
    console.log('All fields validation errors:', errors);
    expect(errors.length).toBe(0);
  });

  it('should reject if title is not a string', async () => {
    const plain = { title: 123 };
    
    const dtoObj = plainToInstance(UpdateTodolistDto, plain);
    const errors = await validate(dtoObj);
    
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('title');
    expect(errors[0].constraints).toHaveProperty('isString');
  });

  it('should reject if completionPercentage is not a decimal', async () => {
    const plain = { completionPercentage: 'not-a-decimal' };
    
    const dtoObj = plainToInstance(UpdateTodolistDto, plain);
    const errors = await validate(dtoObj);
    
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('completionPercentage');
    expect(errors[0].constraints).toHaveProperty('isDecimal');
  });

  it('should reject if dueAt is not a valid date string', async () => {
    const plain = { dueAt: 'not-a-date' };
    
    const dtoObj = plainToInstance(UpdateTodolistDto, plain);
    const errors = await validate(dtoObj);
    
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('dueAt');
    expect(errors[0].constraints).toHaveProperty('isDateString');
  });

  it('should reject if user_id is not a valid UUID', async () => {
    const plain = { user_id: 'not-a-uuid' };
    
    const dtoObj = plainToInstance(UpdateTodolistDto, plain);
    const errors = await validate(dtoObj);
    
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('user_id');
    expect(errors[0].constraints).toHaveProperty('isUuid');
  });

  it('should reject if title exceeds max length', async () => {
    const plain = { title: 'A'.repeat(101) }; // MaxLength est 100
    
    const dtoObj = plainToInstance(UpdateTodolistDto, plain);
    const errors = await validate(dtoObj);
    
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('title');
    expect(errors[0].constraints).toHaveProperty('maxLength');
  });
}); 