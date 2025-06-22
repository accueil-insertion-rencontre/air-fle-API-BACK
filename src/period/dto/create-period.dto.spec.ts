import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreatePeriodDto } from './create-period.dto';
import { describe, it, expect } from 'vitest';

describe('CreatePeriodDto', () => {
  it('should validate with correct data', async () => {
    const dto = plainToInstance(CreatePeriodDto, {
      label: 'Semestre 1',
      startedAt: '2023-09-01T00:00:00.000Z',
      endedAt: '2023-12-31T00:00:00.000Z',
      actual_period: true,
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  describe('label validation', () => {
    it('should validate with correct label', async () => {
      const dto = plainToInstance(CreatePeriodDto, {
        label: 'Semestre 1',
        startedAt: '2023-09-01T00:00:00.000Z',
        endedAt: '2023-12-31T00:00:00.000Z',
        actual_period: false,
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail when label is missing', async () => {
      const dto = plainToInstance(CreatePeriodDto, {
        startedAt: '2023-09-01T00:00:00.000Z',
        endedAt: '2023-12-31T00:00:00.000Z',
        actual_period: false,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('label');
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('should fail when label is empty', async () => {
      const dto = plainToInstance(CreatePeriodDto, {
        label: '',
        startedAt: '2023-09-01T00:00:00.000Z',
        endedAt: '2023-12-31T00:00:00.000Z',
        actual_period: false,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('label');
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('should fail when label is not a string', async () => {
      const dto = plainToInstance(CreatePeriodDto, {
        label: 123,
        startedAt: '2023-09-01T00:00:00.000Z',
        endedAt: '2023-12-31T00:00:00.000Z',
        actual_period: false,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('label');
      expect(errors[0].constraints).toHaveProperty('isString');
    });

    it('should fail when label exceeds max length', async () => {
      const dto = plainToInstance(CreatePeriodDto, {
        label: 'a'.repeat(101),
        startedAt: '2023-09-01T00:00:00.000Z',
        endedAt: '2023-12-31T00:00:00.000Z',
        actual_period: false,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('label');
      expect(errors[0].constraints).toHaveProperty('maxLength');
    });
  });

  describe('startedAt validation', () => {
    it('should validate with correct startedAt', async () => {
      const dto = plainToInstance(CreatePeriodDto, {
        label: 'Semestre 1',
        startedAt: '2023-09-01T00:00:00.000Z',
        endedAt: '2023-12-31T00:00:00.000Z',
        actual_period: false,
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail when startedAt is missing', async () => {
      const dto = plainToInstance(CreatePeriodDto, {
        label: 'Semestre 1',
        endedAt: '2023-12-31T00:00:00.000Z',
        actual_period: false,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('startedAt');
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('should fail when startedAt is not a valid date string', async () => {
      const dto = plainToInstance(CreatePeriodDto, {
        label: 'Semestre 1',
        startedAt: 'not-a-date',
        endedAt: '2023-12-31T00:00:00.000Z',
        actual_period: false,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('startedAt');
      expect(errors[0].constraints).toHaveProperty('isDateString');
    });
  });

  describe('endedAt validation', () => {
    it('should validate with correct endedAt', async () => {
      const dto = plainToInstance(CreatePeriodDto, {
        label: 'Semestre 1',
        startedAt: '2023-09-01T00:00:00.000Z',
        endedAt: '2023-12-31T00:00:00.000Z',
        actual_period: false,
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail when endedAt is missing', async () => {
      const dto = plainToInstance(CreatePeriodDto, {
        label: 'Semestre 1',
        startedAt: '2023-09-01T00:00:00.000Z',
        actual_period: false,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('endedAt');
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('should fail when endedAt is not a valid date string', async () => {
      const dto = plainToInstance(CreatePeriodDto, {
        label: 'Semestre 1',
        startedAt: '2023-09-01T00:00:00.000Z',
        endedAt: 'not-a-date',
        actual_period: false,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('endedAt');
      expect(errors[0].constraints).toHaveProperty('isDateString');
    });
  });

  describe('actual_period validation', () => {
    it('should validate with actual_period set to true', async () => {
      const dto = plainToInstance(CreatePeriodDto, {
        label: 'Semestre 1',
        startedAt: '2023-09-01T00:00:00.000Z',
        endedAt: '2023-12-31T00:00:00.000Z',
        actual_period: true,
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should validate with actual_period set to false', async () => {
      const dto = plainToInstance(CreatePeriodDto, {
        label: 'Semestre 1',
        startedAt: '2023-09-01T00:00:00.000Z',
        endedAt: '2023-12-31T00:00:00.000Z',
        actual_period: false,
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should validate without actual_period (using default)', async () => {
      const dto = plainToInstance(CreatePeriodDto, {
        label: 'Semestre 1',
        startedAt: '2023-09-01T00:00:00.000Z',
        endedAt: '2023-12-31T00:00:00.000Z',
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
      expect(dto.actual_period).toBe(false);
    });

    it('should fail when actual_period is not a boolean', async () => {
      const dto = plainToInstance(CreatePeriodDto, {
        label: 'Semestre 1',
        startedAt: '2023-09-01T00:00:00.000Z',
        endedAt: '2023-12-31T00:00:00.000Z',
        actual_period: 'yes' as any,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('actual_period');
      expect(errors[0].constraints).toHaveProperty('isBoolean');
    });
  });
});
