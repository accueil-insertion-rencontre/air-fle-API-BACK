import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateOrientationDto } from './create-orientation.dto';
import { describe, it, expect } from 'vitest';

describe('CreateOrientationDto', () => {
  it('should validate with correct data (with description)', async () => {
    const dto = plainToInstance(CreateOrientationDto, {
      type: 'Professionnelle',
      description: 'Orientation vers une formation professionnelle'
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should validate with correct data (without description)', async () => {
    const dto = plainToInstance(CreateOrientationDto, {
      type: 'Professionnelle'
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  describe('type validation', () => {
    it('should validate with correct type', async () => {
      const dto = plainToInstance(CreateOrientationDto, {
        type: 'Académique'
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail when type is missing', async () => {
      const dto = plainToInstance(CreateOrientationDto, {
        description: 'Orientation vers une formation académique'
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('type');
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('should fail when type is empty', async () => {
      const dto = plainToInstance(CreateOrientationDto, {
        type: '',
        description: 'Orientation vers une formation académique'
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('type');
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('should fail when type is not a string', async () => {
      const dto = plainToInstance(CreateOrientationDto, {
        type: 123,
        description: 'Orientation vers une formation académique'
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('type');
      expect(errors[0].constraints).toHaveProperty('isString');
    });

    it('should fail when type exceeds max length', async () => {
      const dto = plainToInstance(CreateOrientationDto, {
        type: 'a'.repeat(101),
        description: 'Orientation vers une formation académique'
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('type');
      expect(errors[0].constraints).toHaveProperty('maxLength');
    });
  });

  describe('description validation', () => {
    it('should validate with correct description', async () => {
      const dto = plainToInstance(CreateOrientationDto, {
        type: 'Professionnelle',
        description: 'Orientation vers une formation professionnelle'
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should validate without description', async () => {
      const dto = plainToInstance(CreateOrientationDto, {
        type: 'Professionnelle'
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should validate with empty description', async () => {
      const dto = plainToInstance(CreateOrientationDto, {
        type: 'Professionnelle',
        description: ''
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail when description is not a string', async () => {
      const dto = plainToInstance(CreateOrientationDto, {
        type: 'Professionnelle',
        description: 123
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('description');
      expect(errors[0].constraints).toHaveProperty('isString');
    });

    it('should fail when description exceeds max length', async () => {
      const dto = plainToInstance(CreateOrientationDto, {
        type: 'Professionnelle',
        description: 'a'.repeat(256)
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('description');
      expect(errors[0].constraints).toHaveProperty('maxLength');
    });
  });
}); 