import { describe, it, expect } from 'vitest';
import { validate } from 'class-validator';
import { CreateSessionDto } from './create-session.dto';
import { plainToInstance } from 'class-transformer';

describe('CreateSessionDto', () => {
  it('should be valid if all required properties are provided', async () => {
    const dto = plainToInstance(CreateSessionDto, {
      label: "Session d'été 2023",
      startedAt: '2023-06-01T00:00:00.000Z',
      finishedAt: '2023-08-31T00:00:00.000Z',
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should be valid if only required properties are provided (no label)', async () => {
    const dto = plainToInstance(CreateSessionDto, {
      startedAt: '2023-06-01T00:00:00.000Z',
      finishedAt: '2023-08-31T00:00:00.000Z',
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should be invalid if startedAt is missing', async () => {
    const dto = plainToInstance(CreateSessionDto, {
      label: "Session d'été 2023",
      finishedAt: '2023-08-31T00:00:00.000Z',
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('startedAt');
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('should be invalid if finishedAt is missing', async () => {
    const dto = plainToInstance(CreateSessionDto, {
      label: "Session d'été 2023",
      startedAt: '2023-06-01T00:00:00.000Z',
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('finishedAt');
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('should be invalid if startedAt is not a valid date', async () => {
    const dto = plainToInstance(CreateSessionDto, {
      label: "Session d'été 2023",
      startedAt: 'invalid-date',
      finishedAt: '2023-08-31T00:00:00.000Z',
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('startedAt');
    expect(errors[0].constraints).toHaveProperty('isDateString');
  });

  it('should be invalid if finishedAt is not a valid date', async () => {
    const dto = plainToInstance(CreateSessionDto, {
      label: "Session d'été 2023",
      startedAt: '2023-06-01T00:00:00.000Z',
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

    const dto = plainToInstance(CreateSessionDto, {
      label: longLabel,
      startedAt: '2023-06-01T00:00:00.000Z',
      finishedAt: '2023-08-31T00:00:00.000Z',
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('label');
    expect(errors[0].constraints).toHaveProperty('maxLength');
  });

  it('should be invalid if label is not a string', async () => {
    const dto = plainToInstance(CreateSessionDto, {
      label: 123, // Non-string value
      startedAt: '2023-06-01T00:00:00.000Z',
      finishedAt: '2023-08-31T00:00:00.000Z',
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('label');
    expect(errors[0].constraints).toHaveProperty('isString');
  });
});
