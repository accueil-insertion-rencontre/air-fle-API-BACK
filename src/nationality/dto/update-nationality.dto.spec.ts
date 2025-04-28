import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { UpdateNationalityDto } from './update-nationality.dto';
import { describe, it, expect } from 'vitest';

describe('UpdateNationalityDto', () => {
  it('should validate with correct data', async () => {
    const dto = plainToInstance(UpdateNationalityDto, {
      label: 'Allemande',
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should validate with empty object (all fields optional)', async () => {
    const dto = plainToInstance(UpdateNationalityDto, {});

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  describe('label validation', () => {
    it('should validate with correct label', async () => {
      const dto = plainToInstance(UpdateNationalityDto, {
        label: 'Portugaise',
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail when label is empty string', async () => {
      const dto = plainToInstance(UpdateNationalityDto, {
        label: '',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('label');
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('should fail when label is not a string', async () => {
      const dto = plainToInstance(UpdateNationalityDto, {
        label: 123,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('label');
      expect(errors[0].constraints).toHaveProperty('isString');
    });

    it('should fail when label exceeds max length', async () => {
      const dto = plainToInstance(UpdateNationalityDto, {
        label: 'a'.repeat(101), // Crée une chaîne de 101 caractères
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('label');
      expect(errors[0].constraints).toHaveProperty('maxLength');
    });

    it('should pass when label is exactly max length', async () => {
      const dto = plainToInstance(UpdateNationalityDto, {
        label: 'a'.repeat(100), // Crée une chaîne de 100 caractères
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });
  });
}); 