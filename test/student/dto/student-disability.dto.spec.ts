import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { StudentDisabilityDto } from '../../../src/student/dto/student-disability.dto';

describe('StudentDisabilityDto', () => {
  const validUuid = 'c35fe727-d68e-4b1e-afe1-c5618ccf2cce';
  const invalidUuid = 'invalid-uuid';

  describe('Validation des champs obligatoires', () => {
    it('devrait valider avec des disability_ids valides', async () => {
      const data = {
        disability_ids: [validUuid, 'f54480bd-4893-41d6-831d-f6eb81dffce6'],
      };
      
      const dto = plainToClass(StudentDisabilityDto, data);
      const errors = await validate(dto);
      
      expect(errors).toHaveLength(0);
    });

    it('devrait valider avec un tableau vide', async () => {
      const data = {
        disability_ids: [],
      };
      
      const dto = plainToClass(StudentDisabilityDto, data);
      const errors = await validate(dto);
      
      expect(errors).toHaveLength(0);
    });

    it('devrait échouer si disability_ids est manquant', async () => {
      const data = {};
      
      const dto = plainToClass(StudentDisabilityDto, data);
      const errors = await validate(dto);
      
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('disability_ids');
      expect(errors[0].constraints).toHaveProperty('isArray');
    });

    it('devrait échouer si disability_ids n\'est pas un tableau', async () => {
      const data = {
        disability_ids: 'not-an-array',
      };
      
      const dto = plainToClass(StudentDisabilityDto, data);
      const errors = await validate(dto);
      
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('disability_ids');
      expect(errors[0].constraints).toHaveProperty('isArray');
    });
  });

  describe('Validation du contenu du tableau', () => {
    it('devrait échouer si un élément du tableau n\'est pas un UUID valide', async () => {
      const data = {
        disability_ids: [validUuid, invalidUuid],
      };
      
      const dto = plainToClass(StudentDisabilityDto, data);
      const errors = await validate(dto);
      
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('disability_ids');
      expect(errors[0].constraints).toHaveProperty('isUuid');
    });

    it('devrait échouer si tous les éléments sont des UUID invalides', async () => {
      const data = {
        disability_ids: ['invalid-1', 'invalid-2', 'invalid-3'],
      };
      
      const dto = plainToClass(StudentDisabilityDto, data);
      const errors = await validate(dto);
      
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('disability_ids');
      expect(errors[0].constraints).toHaveProperty('isUuid');
    });

    it('devrait échouer si le tableau contient des valeurs null ou undefined', async () => {
      const data = {
        disability_ids: [validUuid, null, undefined],
      };
      
      const dto = plainToClass(StudentDisabilityDto, data);
      const errors = await validate(dto);
      
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('disability_ids');
    });

    it('devrait échouer si le tableau contient des nombres', async () => {
      const data = {
        disability_ids: [validUuid, 123, 456],
      };
      
      const dto = plainToClass(StudentDisabilityDto, data);
      const errors = await validate(dto);
      
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('disability_ids');
    });

    it('devrait échouer si le tableau contient des objets', async () => {
      const data = {
        disability_ids: [validUuid, { id: 'test' }, { uuid: 'another' }],
      };
      
      const dto = plainToClass(StudentDisabilityDto, data);
      const errors = await validate(dto);
      
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('disability_ids');
    });
  });

  describe('Validation avec un seul UUID', () => {
    it('devrait valider avec un seul UUID valide', async () => {
      const data = {
        disability_ids: [validUuid],
      };
      
      const dto = plainToClass(StudentDisabilityDto, data);
      const errors = await validate(dto);
      
      expect(errors).toHaveLength(0);
    });

    it('devrait échouer avec un seul UUID invalide', async () => {
      const data = {
        disability_ids: [invalidUuid],
      };
      
      const dto = plainToClass(StudentDisabilityDto, data);
      const errors = await validate(dto);
      
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('disability_ids');
      expect(errors[0].constraints).toHaveProperty('isUuid');
    });
  });

  describe('Validation avec de multiples UUID', () => {
    it('devrait valider avec plusieurs UUID valides', async () => {
      const data = {
        disability_ids: [
          'c35fe727-d68e-4b1e-afe1-c5618ccf2cce',
          'f54480bd-4893-41d6-831d-f6eb81dffce6',
          'b1ab0950-a5fc-445a-851f-8060124d31c2',
        ],
      };
      
      const dto = plainToClass(StudentDisabilityDto, data);
      const errors = await validate(dto);
      
      expect(errors).toHaveLength(0);
    });

    it('devrait échouer si au moins un UUID est invalide dans une liste', async () => {
      const data = {
        disability_ids: [
          'c35fe727-d68e-4b1e-afe1-c5618ccf2cce',
          'invalid-uuid',
          'b1ab0950-a5fc-445a-851f-8060124d31c2',
        ],
      };
      
      const dto = plainToClass(StudentDisabilityDto, data);
      const errors = await validate(dto);
      
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('disability_ids');
      expect(errors[0].constraints).toHaveProperty('isUuid');
    });
  });

  describe('Cas particuliers', () => {
    it('devrait échouer avec une string vide dans le tableau', async () => {
      const data = {
        disability_ids: [validUuid, '', validUuid],
      };
      
      const dto = plainToClass(StudentDisabilityDto, data);
      const errors = await validate(dto);
      
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('disability_ids');
      expect(errors[0].constraints).toHaveProperty('isUuid');
    });

    it('devrait échouer avec des espaces dans le tableau', async () => {
      const data = {
        disability_ids: [validUuid, '   ', validUuid],
      };
      
      const dto = plainToClass(StudentDisabilityDto, data);
      const errors = await validate(dto);
      
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('disability_ids');
      expect(errors[0].constraints).toHaveProperty('isUuid');
    });

    it('devrait échouer avec un UUID trop court', async () => {
      const data = {
        disability_ids: [validUuid, 'too-short'],
      };
      
      const dto = plainToClass(StudentDisabilityDto, data);
      const errors = await validate(dto);
      
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('disability_ids');
      expect(errors[0].constraints).toHaveProperty('isUuid');
    });

    it('devrait échouer avec un UUID trop long', async () => {
      const data = {
        disability_ids: [validUuid, 'c35fe727-d68e-4b1e-afe1-c5618ccf2cce-too-long'],
      };
      
      const dto = plainToClass(StudentDisabilityDto, data);
      const errors = await validate(dto);
      
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('disability_ids');
      expect(errors[0].constraints).toHaveProperty('isUuid');
    });
  });
}); 