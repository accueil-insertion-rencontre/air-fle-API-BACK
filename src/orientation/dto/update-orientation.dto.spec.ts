import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { UpdateOrientationDto } from './update-orientation.dto';
import { describe, it, expect } from 'vitest';

describe('UpdateOrientationDto', () => {
  it('should validate with correct data', async () => {
    const dto = plainToInstance(UpdateOrientationDto, {
      type: 'Académique',
      description: 'Orientation vers une formation académique',
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should validate with empty object (all fields optional)', async () => {
    const dto = plainToInstance(UpdateOrientationDto, {});

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should validate with partial data (only type)', async () => {
    const dto = plainToInstance(UpdateOrientationDto, {
      type: 'Académique',
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should validate with partial data (only description)', async () => {
    const dto = plainToInstance(UpdateOrientationDto, {
      description: 'Orientation vers une formation académique',
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  describe('type validation', () => {
    it('should validate with correct type', async () => {
      const dto = plainToInstance(UpdateOrientationDto, {
        type: 'Professionnelle',
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail when type is empty string', async () => {
      const dto = plainToInstance(UpdateOrientationDto, {
        type: '',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('type');
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('should fail when type is not a string', async () => {
      const dto = plainToInstance(UpdateOrientationDto, {
        type: 123,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('type');
      expect(errors[0].constraints).toHaveProperty('isString');
    });

    it('should fail when type exceeds max length', async () => {
      const dto = plainToInstance(UpdateOrientationDto, {
        type: 'a'.repeat(101),
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('type');
      expect(errors[0].constraints).toHaveProperty('maxLength');
    });
  });

  describe('description validation', () => {
    it('should validate with correct description', async () => {
      const dto = plainToInstance(UpdateOrientationDto, {
        description: 'Orientation vers une formation professionnelle',
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should validate with empty description', async () => {
      const dto = plainToInstance(UpdateOrientationDto, {
        description: '',
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail when description is not a string', async () => {
      const dto = plainToInstance(UpdateOrientationDto, {
        description: 123,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('description');
      expect(errors[0].constraints).toHaveProperty('isString');
    });

    it('should fail when description exceeds max length', async () => {
      const dto = plainToInstance(UpdateOrientationDto, {
        description: 'a'.repeat(256),
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('description');
      expect(errors[0].constraints).toHaveProperty('maxLength');
    });
  });
});
