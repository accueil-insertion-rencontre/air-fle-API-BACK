import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { UpdateUserDto } from './update-user.dto';
import { describe, it, expect, beforeEach } from 'vitest';

describe('UpdateUserDto', () => {
  let dto: UpdateUserDto;

  beforeEach(() => {
    dto = {
      firstname: 'Jean',
      lastname: 'Dupont',
      email: 'jean.dupont@example.com',
      role_id: '550e8400-e29b-41d4-a716-446655440000',
    };
  });

  it('devrait valider un DTO correct sans mot de passe', async () => {
    const dtoObj = plainToInstance(UpdateUserDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBe(0);
  });

  it('devrait valider un DTO correct avec mot de passe valide', async () => {
    dto.password = 'nouveauMotDePasse123';
    const dtoObj = plainToInstance(UpdateUserDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBe(0);
  });

  // Tests pour le prénom optionnel
  it('devrait échouer si le prénom contient des caractères interdits', async () => {
    dto.firstname = 'Jean<script>';
    const dtoObj = plainToInstance(UpdateUserDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('matches');
  });

  it('devrait échouer si le prénom est trop long', async () => {
    dto.firstname = 'a'.repeat(101);
    const dtoObj = plainToInstance(UpdateUserDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('maxLength');
  });

  // Tests pour le nom optionnel
  it('devrait échouer si le nom contient des caractères interdits', async () => {
    dto.lastname = 'Dupont<script>';
    const dtoObj = plainToInstance(UpdateUserDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('matches');
  });

  // Tests pour l'email optionnel
  it("devrait échouer si l'email est invalide", async () => {
    dto.email = 'not-an-email';
    const dtoObj = plainToInstance(UpdateUserDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isEmail');
  });

  // Tests pour le mot de passe optionnel
  it('devrait échouer si le mot de passe est trop court', async () => {
    dto.password = '12345';
    const dtoObj = plainToInstance(UpdateUserDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('minLength');
  });

  it('devrait échouer si le mot de passe contient des caractères interdits', async () => {
    dto.password = 'password€';
    const dtoObj = plainToInstance(UpdateUserDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('matches');
  });

  // Test pour les champs vides
  it('devrait accepter un objet vide car tous les champs sont optionnels', async () => {
    const emptyDto = {};
    const dtoObj = plainToInstance(UpdateUserDto, emptyDto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBe(0);
  });

  // Tests pour le role_id optionnel
  it("devrait échouer si le role_id n'est pas un UUID valide", async () => {
    dto.role_id = 'not-a-uuid';
    const dtoObj = plainToInstance(UpdateUserDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isUuid');
  });

  // Test pour vérifier que seuls les champs autorisés sont présents
  it('devrait ignorer les champs non définis dans le DTO', async () => {
    const extendedDto = {
      ...dto,
      unknownField: 'this should be ignored',
    };
    const dtoObj = plainToInstance(UpdateUserDto, extendedDto, {
      excludeExtraneousValues: true,
    });
    expect((dtoObj as any).unknownField).toBeUndefined();
  });
});
