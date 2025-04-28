import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateStudentDto } from './create-student.dto';
import { describe, it, expect, beforeEach } from 'vitest';

describe('CreateStudentDto', () => {
  let dto: CreateStudentDto;

  beforeEach(() => {
    dto = {
      firstname: 'Jean',
      lastname: 'Dupont',
      birthdate: '1990-01-01T00:00:00.000Z',
      gender_id: '550e8400-e29b-41d4-a716-446655440000',
      initial_level_id: '550e8400-e29b-41d4-a716-446655440001',
      nationality_id: '550e8400-e29b-41d4-a716-446655440002',
      financing_id: '550e8400-e29b-41d4-a716-446655440003',
      status_id: '550e8400-e29b-41d4-a716-446655440004'
    };
  });

  it('devrait valider un DTO correct avec seulement les champs obligatoires', async () => {
    const dtoObj = plainToInstance(CreateStudentDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBe(0);
  });

  it('devrait valider un DTO correct avec tous les champs optionnels', async () => {
    dto.placeOfBirth = 'Paris';
    dto.email = 'jean.dupont@example.com';
    dto.phone = '+33123456789';
    dto.date_test_initial = '2023-01-01';
    dto.commentaire = 'Très motivé';
    dto.date_entree_france = '2022-01-01';
    dto.current_level_id = '550e8400-e29b-41d4-a716-446655440005';
    dto.orientation_id = '550e8400-e29b-41d4-a716-446655440006';
    dto.exit_reason_id = '550e8400-e29b-41d4-a716-446655440007';
    
    const dtoObj = plainToInstance(CreateStudentDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBe(0);
  });

  // Tests pour les champs obligatoires
  it('devrait échouer si le prénom est manquant', async () => {
    const { firstname, ...dtoWithoutFirstname } = dto;
    const dtoObj = plainToInstance(CreateStudentDto, dtoWithoutFirstname);
    const errors = await validate(dtoObj);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('firstname');
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('devrait échouer si le nom est manquant', async () => {
    const { lastname, ...dtoWithoutLastname } = dto;
    const dtoObj = plainToInstance(CreateStudentDto, dtoWithoutLastname);
    const errors = await validate(dtoObj);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('lastname');
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  // Tests pour le prénom
  it('devrait échouer si le prénom est trop long', async () => {
    dto.firstname = 'a'.repeat(101);
    const dtoObj = plainToInstance(CreateStudentDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('firstname');
    expect(errors[0].constraints).toHaveProperty('maxLength');
  });

  // Tests pour la date de naissance
  it('devrait échouer si la date de naissance n\'est pas au format ISO', async () => {
    dto.birthdate = 'not-a-date';
    const dtoObj = plainToInstance(CreateStudentDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('birthdate');
    expect(errors[0].constraints).toHaveProperty('isDateString');
  });

  // Tests pour l'email optionnel
  it('devrait échouer si l\'email est invalide', async () => {
    dto.email = 'not-an-email';
    const dtoObj = plainToInstance(CreateStudentDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('email');
    expect(errors[0].constraints).toHaveProperty('isEmail');
  });

  // Tests pour le téléphone optionnel
  it('devrait échouer si le téléphone contient des caractères non autorisés', async () => {
    dto.phone = '+33abc456789';
    const dtoObj = plainToInstance(CreateStudentDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('phone');
    expect(errors[0].constraints).toHaveProperty('matches');
  });

  // Tests pour le commentaire optionnel
  it('devrait échouer si le commentaire est trop long', async () => {
    dto.commentaire = 'a'.repeat(1001);
    const dtoObj = plainToInstance(CreateStudentDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('commentaire');
    expect(errors[0].constraints).toHaveProperty('maxLength');
  });

  // Tests pour les IDs obligatoires
  it('devrait échouer si gender_id n\'est pas un UUID valide', async () => {
    dto.gender_id = 'not-a-uuid';
    const dtoObj = plainToInstance(CreateStudentDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('gender_id');
    expect(errors[0].constraints).toHaveProperty('isUuid');
  });

  it('devrait échouer si nationality_id est manquant', async () => {
    const { nationality_id, ...dtoWithoutNationality } = dto;
    const dtoObj = plainToInstance(CreateStudentDto, dtoWithoutNationality);
    const errors = await validate(dtoObj);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('nationality_id');
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  // Tests pour les IDs optionnels
  it('devrait échouer si current_level_id n\'est pas un UUID valide', async () => {
    dto.current_level_id = 'not-a-uuid';
    const dtoObj = plainToInstance(CreateStudentDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('current_level_id');
    expect(errors[0].constraints).toHaveProperty('isUuid');
  });

  // Tests pour les caractères spéciaux valides
  it('devrait valider un prénom avec caractères accentués', async () => {
    dto.firstname = 'Éléonore';
    const dtoObj = plainToInstance(CreateStudentDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBe(0);
  });

  it('devrait valider un nom avec apostrophe', async () => {
    dto.lastname = 'O\'Connor';
    const dtoObj = plainToInstance(CreateStudentDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBe(0);
  });
}); 