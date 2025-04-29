import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { UpdateGenderDto } from './update-gender.dto';
import { describe, it, expect } from 'vitest';

describe('UpdateGenderDto', () => {
  it('should validate with correct data', async () => {
    const dto = plainToInstance(UpdateGenderDto, {
      label: 'Féminin',
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should validate with empty object (all fields optional)', async () => {
    const dto = plainToInstance(UpdateGenderDto, {});

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  describe('label validation', () => {
    it('should validate with correct label', async () => {
      const dto = plainToInstance(UpdateGenderDto, {
        label: 'Non-binaire',
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail when label is empty string', async () => {
      const dto = plainToInstance(UpdateGenderDto, {
        label: '',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('label');
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('should fail when label is not a string', async () => {
      const dto = plainToInstance(UpdateGenderDto, {
        label: 123,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('label');
      expect(errors[0].constraints).toHaveProperty('isString');
    });

    it('should fail when label exceeds max length', async () => {
      const dto = plainToInstance(UpdateGenderDto, {
        label: 'a'.repeat(51), // Crée une chaîne de 51 caractères
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('label');
      expect(errors[0].constraints).toHaveProperty('maxLength');
    });

    it('should pass when label is exactly max length', async () => {
      const dto = plainToInstance(UpdateGenderDto, {
        label: 'a'.repeat(50), // Crée une chaîne de 50 caractères
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });
  });
}); 