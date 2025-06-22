import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { UpdatePeriodDto } from './update-period.dto';
import { describe, it, expect } from 'vitest';

describe('UpdatePeriodDto', () => {
  it('should validate with correct data', async () => {
    const dto = plainToInstance(UpdatePeriodDto, {
      label: 'Semestre 2',
      startedAt: '2024-01-01T00:00:00.000Z',
      endedAt: '2024-06-30T00:00:00.000Z',
      actual_period: true,
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should validate with empty object (all fields optional)', async () => {
    const dto = plainToInstance(UpdatePeriodDto, {});

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should validate with partial data', async () => {
    const dto = plainToInstance(UpdatePeriodDto, {
      label: 'Semestre 2',
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  describe('label validation', () => {
    it('should validate with correct label', async () => {
      const dto = plainToInstance(UpdatePeriodDto, {
        label: 'Trimestre 1',
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail when label is empty string', async () => {
      const dto = plainToInstance(UpdatePeriodDto, {
        label: '',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('label');
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('should fail when label is not a string', async () => {
      const dto = plainToInstance(UpdatePeriodDto, {
        label: 123,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('label');
      expect(errors[0].constraints).toHaveProperty('isString');
    });

    it('should fail when label exceeds max length', async () => {
      const dto = plainToInstance(UpdatePeriodDto, {
        label: 'a'.repeat(101),
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('label');
      expect(errors[0].constraints).toHaveProperty('maxLength');
    });
  });

  describe('startedAt validation', () => {
    it('should validate with correct startedAt', async () => {
      const dto = plainToInstance(UpdatePeriodDto, {
        startedAt: '2024-01-01T00:00:00.000Z',
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail when startedAt is not a valid date string', async () => {
      const dto = plainToInstance(UpdatePeriodDto, {
        startedAt: 'not-a-date',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('startedAt');
      expect(errors[0].constraints).toHaveProperty('isDateString');
    });
  });

  describe('endedAt validation', () => {
    it('should validate with correct endedAt', async () => {
      const dto = plainToInstance(UpdatePeriodDto, {
        endedAt: '2024-06-30T00:00:00.000Z',
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail when endedAt is not a valid date string', async () => {
      const dto = plainToInstance(UpdatePeriodDto, {
        endedAt: 'not-a-date',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('endedAt');
      expect(errors[0].constraints).toHaveProperty('isDateString');
    });
  });

  describe('actual_period validation', () => {
    it('should validate with actual_period set to true', async () => {
      const dto = plainToInstance(UpdatePeriodDto, {
        actual_period: true,
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should validate with actual_period set to false', async () => {
      const dto = plainToInstance(UpdatePeriodDto, {
        actual_period: false,
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail when actual_period is not a boolean', async () => {
      const dto = plainToInstance(UpdatePeriodDto, {
        actual_period: 'yes' as any,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('actual_period');
      expect(errors[0].constraints).toHaveProperty('isBoolean');
    });
  });
});
