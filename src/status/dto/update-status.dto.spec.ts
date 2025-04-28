import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { UpdateStatusDto } from './update-status.dto';
import { describe, it, expect } from 'vitest';

describe('UpdateStatusDto', () => {
  it('should validate with correct data', async () => {
    const dto = plainToInstance(UpdateStatusDto, {
      label: 'Inactif',
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should validate with empty object (all fields optional)', async () => {
    const dto = plainToInstance(UpdateStatusDto, {});

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  describe('label validation', () => {
    it('should validate with correct label', async () => {
      const dto = plainToInstance(UpdateStatusDto, {
        label: 'En attente',
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail when label is empty string', async () => {
      const dto = plainToInstance(UpdateStatusDto, {
        label: '',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('label');
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('should fail when label is not a string', async () => {
      const dto = plainToInstance(UpdateStatusDto, {
        label: 123,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('label');
      expect(errors[0].constraints).toHaveProperty('isString');
    });

    it('should fail when label exceeds max length', async () => {
      const dto = plainToInstance(UpdateStatusDto, {
        label: 'a'.repeat(101), // Crée une chaîne de 101 caractères
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('label');
      expect(errors[0].constraints).toHaveProperty('maxLength');
    });

    it('should pass when label is exactly max length', async () => {
      const dto = plainToInstance(UpdateStatusDto, {
        label: 'a'.repeat(100), // Crée une chaîne de 100 caractères
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });
  });
}); 