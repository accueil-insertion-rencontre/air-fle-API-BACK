import { describe, it, expect } from 'vitest';
import { validate } from 'class-validator';
import { UpdateSessionDto } from './update-session.dto';
import { plainToInstance } from 'class-transformer';

describe('UpdateSessionDto', () => {
  it('should be valid with all properties', async () => {
    const dto = plainToInstance(UpdateSessionDto, {
      label: 'Session mise à jour',
      startedAt: '2023-06-01T00:00:00.000Z',
      finishedAt: '2023-08-31T00:00:00.000Z',
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should be valid with partial properties (only label)', async () => {
    const dto = plainToInstance(UpdateSessionDto, {
      label: 'Session mise à jour',
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should be valid with partial properties (only startedAt)', async () => {
    const dto = plainToInstance(UpdateSessionDto, {
      startedAt: '2023-06-01T00:00:00.000Z',
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should be valid with partial properties (only finishedAt)', async () => {
    const dto = plainToInstance(UpdateSessionDto, {
      finishedAt: '2023-08-31T00:00:00.000Z',
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should be valid with an empty object', async () => {
    const dto = plainToInstance(UpdateSessionDto, {});

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should be invalid if startedAt is not a valid date', async () => {
    const dto = plainToInstance(UpdateSessionDto, {
      startedAt: 'invalid-date',
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('startedAt');
    expect(errors[0].constraints).toHaveProperty('isDateString');
  });

  it('should be invalid if finishedAt is not a valid date', async () => {
    const dto = plainToInstance(UpdateSessionDto, {
      finishedAt: 'invalid-date',
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('finishedAt');
    expect(errors[0].constraints).toHaveProperty('isDateString');
  });

  it('should be invalid if label exceeds maximum length', async () => {
    // Créer une chaîne de 101 caractères (au-delà de la limite de 100)
    const longLabel = 'a'.repeat(101);
    
    const dto = plainToInstance(UpdateSessionDto, {
      label: longLabel,
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('label');
    expect(errors[0].constraints).toHaveProperty('maxLength');
  });

  it('should be invalid if label is not a string', async () => {
    const dto = plainToInstance(UpdateSessionDto, {
      label: 123, // Non-string value
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('label');
    expect(errors[0].constraints).toHaveProperty('isString');
  });
}); 