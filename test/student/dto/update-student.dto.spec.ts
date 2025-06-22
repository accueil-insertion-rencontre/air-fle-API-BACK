import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { UpdateStudentDto } from '../../../src/student/dto/update-student.dto';

describe('UpdateStudentDto', () => {
  const validUuid = 'c35fe727-d68e-4b1e-afe1-c5618ccf2cce';
  const invalidUuid = 'invalid-uuid';

  describe('Validation des champs optionnels', () => {
    it('devrait valider avec un objet vide (tous les champs sont optionnels)', async () => {
      const dto = plainToClass(UpdateStudentDto, {});
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('devrait valider avec des données partielles valides', async () => {
      const data = {
        student_firstname: 'Jean',
        student_mail: 'jean@example.com',
        gender_uuid: validUuid,
      };
      
      const dto = plainToClass(UpdateStudentDto, data);
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });
  });

  describe('Validation des formats', () => {
    it('devrait échouer avec un prénom trop long', async () => {
      const data = {
        student_firstname: 'a'.repeat(51),
      };
      
      const dto = plainToClass(UpdateStudentDto, data);
      const errors = await validate(dto);
      
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('student_firstname');
      expect(errors[0].constraints).toHaveProperty('maxLength');
    });

    it('devrait échouer avec un email invalide', async () => {
      const data = {
        student_mail: 'email-invalide',
      };
      
      const dto = plainToClass(UpdateStudentDto, data);
      const errors = await validate(dto);
      
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('student_mail');
      expect(errors[0].constraints).toHaveProperty('isEmail');
    });

    it('devrait échouer avec un UUID invalide', async () => {
      const data = {
        gender_uuid: invalidUuid,
      };
      
      const dto = plainToClass(UpdateStudentDto, data);
      const errors = await validate(dto);
      
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('gender_uuid');
      expect(errors[0].constraints).toHaveProperty('isUuid');
    });

    it('devrait échouer avec une date invalide', async () => {
      const data = {
        student_birthdate: 'date-invalide' as any,
      };
      
      const dto = plainToClass(UpdateStudentDto, data);
      const errors = await validate(dto);
      
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('student_birthdate');
      expect(errors[0].constraints).toHaveProperty('isDate');
    });
  });

  describe('Validation des types', () => {
    it('devrait échouer si student_firstname n\'est pas une string', async () => {
      const data = {
        student_firstname: 123 as any,
      };
      
      const dto = plainToClass(UpdateStudentDto, data);
      const errors = await validate(dto);
      
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('student_firstname');
      expect(errors[0].constraints).toHaveProperty('isString');
    });

    it('devrait accepter student_phone en tant que string (pas de validation stricte)', async () => {
      const data = {
        student_phone: 'not-a-number' as any,
      };
      
      const dto = plainToClass(UpdateStudentDto, data);
      const errors = await validate(dto);
      
      // Le DTO n'a pas de validation @IsNumber() donc il accepte les strings
      expect(errors).toHaveLength(0);
    });
  });

  describe('Validation de multiples erreurs', () => {
    it('devrait retourner plusieurs erreurs pour plusieurs champs invalides', async () => {
      const data = {
        student_firstname: 'a'.repeat(51), // Trop long
        student_mail: 'email-invalide',    // Format invalide
        gender_uuid: invalidUuid,          // UUID invalide
      };
      
      const dto = plainToClass(UpdateStudentDto, data);
      const errors = await validate(dto);
      
      expect(errors).toHaveLength(3);
      
      const propertyErrors = errors.map(error => error.property);
      expect(propertyErrors).toContain('student_firstname');
      expect(propertyErrors).toContain('student_mail');
      expect(propertyErrors).toContain('gender_uuid');
    });
  });
}); 