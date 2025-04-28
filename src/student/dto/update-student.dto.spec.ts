import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { UpdateStudentDto } from './update-student.dto';
import { describe, it, expect, beforeEach } from 'vitest';

describe('UpdateStudentDto', () => {
  let dto: UpdateStudentDto;

  beforeEach(() => {
    // Créer un DTO vide, car tous les champs sont optionnels dans UpdateStudentDto
    dto = {};
  });

  it('devrait valider un DTO vide', async () => {
    const dtoObj = plainToInstance(UpdateStudentDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBe(0);
  });

  it('devrait valider un DTO avec quelques champs à mettre à jour', async () => {
    dto.firstname = 'Marie';
    dto.email = 'marie.dupont@example.com';
    
    const dtoObj = plainToInstance(UpdateStudentDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBe(0);
  });

  it('devrait valider un DTO avec tous les champs à mettre à jour', async () => {
    dto.firstname = 'Marie';
    dto.lastname = 'Dupont';
    dto.birthdate = '1995-01-01T00:00:00.000Z';
    dto.placeOfBirth = 'Lyon';
    dto.email = 'marie.dupont@example.com';
    dto.phone = '+33987654321';
    dto.date_test_initial = '2023-02-01';
    dto.commentaire = 'Très motivée';
    dto.date_entree_france = '2022-02-01';
    dto.gender_id = '550e8400-e29b-41d4-a716-446655440000';
    dto.initial_level_id = '550e8400-e29b-41d4-a716-446655440001';
    dto.nationality_id = '550e8400-e29b-41d4-a716-446655440002';
    dto.financing_id = '550e8400-e29b-41d4-a716-446655440003';
    dto.status_id = '550e8400-e29b-41d4-a716-446655440004';
    dto.current_level_id = '550e8400-e29b-41d4-a716-446655440005';
    dto.orientation_id = '550e8400-e29b-41d4-a716-446655440006';
    dto.exit_reason_id = '550e8400-e29b-41d4-a716-446655440007';
    
    const dtoObj = plainToInstance(UpdateStudentDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBe(0);
  });

  // Tests pour les validations spécifiques
  /* 
   * Note: La validation des caractères interdits est gérée par la fonction Escape 
   * qui nettoie les données mais ne lève pas d'erreur. Nous testons donc uniquement
   * les validations qui génèrent des erreurs.
   */
  it('devrait échouer si l\'email est invalide', async () => {
    dto.email = 'not-an-email';
    const dtoObj = plainToInstance(UpdateStudentDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('email');
    expect(errors[0].constraints).toHaveProperty('isEmail');
  });

  it('devrait échouer si la date de naissance n\'est pas au format ISO', async () => {
    dto.birthdate = 'not-a-date';
    const dtoObj = plainToInstance(UpdateStudentDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('birthdate');
    expect(errors[0].constraints).toHaveProperty('isDateString');
  });

  it('devrait échouer si le numéro de téléphone n\'est pas valide', async () => {
    dto.phone = '+33abc456789';
    const dtoObj = plainToInstance(UpdateStudentDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('phone');
    expect(errors[0].constraints).toHaveProperty('matches');
  });

  it('devrait échouer si gender_id n\'est pas un UUID valide', async () => {
    dto.gender_id = 'not-a-uuid';
    const dtoObj = plainToInstance(UpdateStudentDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('gender_id');
    expect(errors[0].constraints).toHaveProperty('isUuid');
  });

  // Tests sur les caractères spéciaux valides
  it('devrait valider un prénom avec caractères accentués', async () => {
    dto.firstname = 'Éléonore';
    const dtoObj = plainToInstance(UpdateStudentDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBe(0);
  });

  it('devrait valider un nom avec apostrophe', async () => {
    dto.lastname = 'O\'Connor';
    const dtoObj = plainToInstance(UpdateStudentDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBe(0);
  });

  // Test pour vérifier les valeurs par défaut et les transformations
  it('devrait accepter des valeurs telles quelles sans exclure les propriétés non définies', async () => {
    const extendedDto = {
      firstname: 'Marie',
      unknownField: 'this will not be excluded by default'
    };
    const dtoObj = plainToInstance(UpdateStudentDto, extendedDto);
    expect(dtoObj.firstname).toBe('Marie');
    expect((dtoObj as any).unknownField).toBe('this will not be excluded by default');
  });
}); 