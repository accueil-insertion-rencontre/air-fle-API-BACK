import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { CreateStudentDto } from './create-student.dto';

describe('CreateStudentDto', () => {
  const validUuid = 'c35fe727-d68e-4b1e-afe1-c5618ccf2cce';
  const invalidUuid = 'invalid-uuid';

  const validData = {
    student_firstname: 'Jean',
    student_lastname: 'Dupont',
    student_birthdate: new Date('1990-01-01'),
    gender_uuid: validUuid,
    french_level_uuid: validUuid,
    nationality_uuid: validUuid,
    financing_uuid: validUuid,
    status_uuid: validUuid,
    orientation_uuid: validUuid,
    exit_reason_uuid: validUuid,
  };

  describe('Validation des champs obligatoires', () => {
    it('devrait valider avec des données valides', async () => {
      const dto = plainToClass(CreateStudentDto, validData);
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('devrait échouer si student_firstname est manquant', async () => {
      const data = { ...validData };
      delete data.student_firstname;
      
      const dto = plainToClass(CreateStudentDto, data);
      const errors = await validate(dto);
      
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('student_firstname');
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('devrait échouer si student_lastname est manquant', async () => {
      const data = { ...validData };
      delete data.student_lastname;
      
      const dto = plainToClass(CreateStudentDto, data);
      const errors = await validate(dto);
      
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('student_lastname');
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('devrait échouer si student_birthdate est manquant', async () => {
      const data = { ...validData };
      delete data.student_birthdate;
      
      const dto = plainToClass(CreateStudentDto, data);
      const errors = await validate(dto);
      
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('student_birthdate');
      expect(errors[0].constraints).toHaveProperty('isDate');
    });

    it('devrait échouer si gender_uuid est manquant', async () => {
      const data = { ...validData };
      delete data.gender_uuid;
      
      const dto = plainToClass(CreateStudentDto, data);
      const errors = await validate(dto);
      
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('gender_uuid');
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });
  });

  describe('Validation des formats', () => {
    it('devrait échouer avec un prénom trop long (>50 caractères)', async () => {
      const data = {
        ...validData,
        student_firstname: 'a'.repeat(51),
      };
      
      const dto = plainToClass(CreateStudentDto, data);
      const errors = await validate(dto);
      
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('student_firstname');
      expect(errors[0].constraints).toHaveProperty('maxLength');
    });

    it('devrait échouer avec un nom trop long (>50 caractères)', async () => {
      const data = {
        ...validData,
        student_lastname: 'a'.repeat(51),
      };
      
      const dto = plainToClass(CreateStudentDto, data);
      const errors = await validate(dto);
      
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('student_lastname');
      expect(errors[0].constraints).toHaveProperty('maxLength');
    });

    it('devrait échouer avec un email invalide', async () => {
      const data = {
        ...validData,
        student_mail: 'email-invalide',
      };
      
      const dto = plainToClass(CreateStudentDto, data);
      const errors = await validate(dto);
      
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('student_mail');
      expect(errors[0].constraints).toHaveProperty('isEmail');
    });

    it('devrait échouer avec un UUID invalide pour gender_uuid', async () => {
      const data = {
        ...validData,
        gender_uuid: invalidUuid,
      };
      
      const dto = plainToClass(CreateStudentDto, data);
      const errors = await validate(dto);
      
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('gender_uuid');
      expect(errors[0].constraints).toHaveProperty('isUuid');
    });

    it('devrait échouer avec un UUID invalide pour french_level_uuid', async () => {
      const data = {
        ...validData,
        french_level_uuid: invalidUuid,
      };
      
      const dto = plainToClass(CreateStudentDto, data);
      const errors = await validate(dto);
      
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('french_level_uuid');
      expect(errors[0].constraints).toHaveProperty('isUuid');
    });

    it('devrait échouer avec une date de naissance invalide', async () => {
      const data = {
        ...validData,
        student_birthdate: 'date-invalide' as any,
      };
      
      const dto = plainToClass(CreateStudentDto, data);
      const errors = await validate(dto);
      
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('student_birthdate');
      expect(errors[0].constraints).toHaveProperty('isDate');
    });
  });

  describe('Validation des champs optionnels', () => {
    it('devrait valider avec des champs optionnels valides', async () => {
      const data = {
        ...validData,
        student_mail: 'test@example.com',
        student_phone: 123456789,
        student_place_of_birth: 'Paris',
        student_commentary: 'Très motivé',
      };
      
      const dto = plainToClass(CreateStudentDto, data);
      const errors = await validate(dto);
      
      expect(errors).toHaveLength(0);
    });

    it('devrait valider sans les champs optionnels', async () => {
      const dto = plainToClass(CreateStudentDto, validData);
      const errors = await validate(dto);
      
      expect(errors).toHaveLength(0);
    });

    it('devrait échouer avec un commentaire trop long', async () => {
      const data = {
        ...validData,
        student_commentary: 'a'.repeat(257), // Plus que 256 caractères
      };
      
      const dto = plainToClass(CreateStudentDto, data);
      const errors = await validate(dto);
      
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('student_commentary');
      expect(errors[0].constraints).toHaveProperty('maxLength');
    });
  });

  describe('Validation des types', () => {
    it('devrait échouer si student_firstname n\'est pas une string', async () => {
      const data = {
        ...validData,
        student_firstname: 123 as any,
      };
      
      const dto = plainToClass(CreateStudentDto, data);
      const errors = await validate(dto);
      
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('student_firstname');
      expect(errors[0].constraints).toHaveProperty('isString');
    });

    it('devrait échouer si student_lastname n\'est pas une string', async () => {
      const data = {
        ...validData,
        student_lastname: 123 as any,
      };
      
      const dto = plainToClass(CreateStudentDto, data);
      const errors = await validate(dto);
      
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('student_lastname');
      expect(errors[0].constraints).toHaveProperty('isString');
    });
  });

  describe('Tous les UUID obligatoires', () => {
    const requiredUuidFields = [
      'gender_uuid',
      'french_level_uuid', 
      'nationality_uuid',
      'financing_uuid',
      'status_uuid',
      'orientation_uuid',
      'exit_reason_uuid'
    ];

    requiredUuidFields.forEach(field => {
      it(`devrait échouer si ${field} est manquant`, async () => {
        const data = { ...validData };
        delete data[field];
        
        const dto = plainToClass(CreateStudentDto, data);
        const errors = await validate(dto);
        
        expect(errors).toHaveLength(1);
        expect(errors[0].property).toBe(field);
        expect(errors[0].constraints).toHaveProperty('isNotEmpty');
      });

      it(`devrait échouer si ${field} a un format UUID invalide`, async () => {
        const data = {
          ...validData,
          [field]: invalidUuid,
        };
        
        const dto = plainToClass(CreateStudentDto, data);
        const errors = await validate(dto);
        
        expect(errors).toHaveLength(1);
        expect(errors[0].property).toBe(field);
        expect(errors[0].constraints).toHaveProperty('isUuid');
      });
    });
  });
});