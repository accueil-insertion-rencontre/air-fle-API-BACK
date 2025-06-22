import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateUserDto } from './create-user.dto';
import { describe, it, expect, beforeEach } from 'vitest';

describe('CreateUserDto', () => {
  let dto: CreateUserDto;

  beforeEach(() => {
    dto = {
      firstname: 'Jean',
      lastname: 'Dupont',
      email: 'jean.dupont@example.com',
      password: 'password123',
      role_id: '550e8400-e29b-41d4-a716-446655440000',
    };
  });

  it('devrait valider un DTO correct', async () => {
    const dtoObj = plainToInstance(CreateUserDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBe(0);
  });

  // Tests pour le prénom
  it('devrait échouer si le prénom est vide', async () => {
    dto.firstname = '';
    const dtoObj = plainToInstance(CreateUserDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('devrait échouer si le prénom contient des caractères interdits', async () => {
    dto.firstname = 'Jean<script>';
    const dtoObj = plainToInstance(CreateUserDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('matches');
  });

  it('devrait échouer si le prénom est trop long', async () => {
    dto.firstname = 'a'.repeat(101);
    const dtoObj = plainToInstance(CreateUserDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('maxLength');
  });

  // Tests pour le nom
  it('devrait échouer si le nom est vide', async () => {
    dto.lastname = '';
    const dtoObj = plainToInstance(CreateUserDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('devrait échouer si le nom contient des caractères interdits', async () => {
    dto.lastname = 'Dupont<script>';
    const dtoObj = plainToInstance(CreateUserDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('matches');
  });

  // Tests pour l'email
  it("devrait échouer si l'email est invalide", async () => {
    dto.email = 'not-an-email';
    const dtoObj = plainToInstance(CreateUserDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isEmail');
  });

  it("devrait échouer si l'email est trop long", async () => {
    dto.email = `${'a'.repeat(247)}@test.com`;
    const dtoObj = plainToInstance(CreateUserDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('maxLength');
  });

  // Tests pour le mot de passe
  it('devrait échouer si le mot de passe est trop court', async () => {
    dto.password = '12345';
    const dtoObj = plainToInstance(CreateUserDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('minLength');
  });

  it('devrait échouer si le mot de passe contient des caractères interdits', async () => {
    dto.password = 'password€';
    const dtoObj = plainToInstance(CreateUserDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('matches');
  });

  // Tests pour le role_id
  it("devrait échouer si le role_id n'est pas un UUID valide", async () => {
    dto.role_id = 'not-a-uuid';
    const dtoObj = plainToInstance(CreateUserDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isUuid');
  });

  it('devrait échouer si le role_id est vide', async () => {
    dto.role_id = '';
    const dtoObj = plainToInstance(CreateUserDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  // Tests critiques supplémentaires pour la sécurité
  it('devrait valider un email avec caractères internationaux', async () => {
    dto.email = 'user@école.fr';
    const dtoObj = plainToInstance(CreateUserDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBe(0);
  });

  it('devrait échouer si le mot de passe contient une injection SQL', async () => {
    dto.password = "password' OR 1=1--";
    const dtoObj = plainToInstance(CreateUserDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('matches');
  });

  it('devrait échouer si le prénom contient une injection XSS', async () => {
    dto.firstname = '<img src="x" onerror="alert(1)">';
    const dtoObj = plainToInstance(CreateUserDto, dto);
    const errors = await validate(dtoObj);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('matches');
  });
});
