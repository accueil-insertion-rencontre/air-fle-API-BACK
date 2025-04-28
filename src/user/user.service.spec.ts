import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import * as argon2 from 'argon2';

// Mock pour argon2
vi.mock('argon2', () => ({
  hash: vi.fn().mockResolvedValue('hashed_password')
}));

describe('UserService', () => {
  let userService: UserService;
  let prismaService: any;

  const mockUser = {
    id: 'test-id',
    firstname: 'Jean',
    lastname: 'Dupont',
    email: 'jean.dupont@example.com',
    password: 'hashed_password',
    role_id: 'role-id',
    birthdate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    role: {
      id: 'role-id',
      rolename: 'USER'
    }
  };

  // Créer un mock pour PrismaService
  beforeEach(() => {
    prismaService = {
      user: {
        findUnique: vi.fn(),
        findMany: vi.fn(),
        count: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn()
      }
    };

    userService = new UserService(prismaService as any);
  });

  // Tests pour findByEmail
  describe('findByEmail', () => {
    it('devrait retourner un utilisateur par email', async () => {
      prismaService.user.findUnique.mockResolvedValue(mockUser);
      
      const result = await userService.findByEmail('jean.dupont@example.com');
      
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'jean.dupont@example.com' },
        include: { role: true }
      });
      expect(result).toEqual(mockUser);
    });

    it('devrait retourner null si aucun utilisateur n\'est trouvé', async () => {
      prismaService.user.findUnique.mockResolvedValue(null);
      
      const result = await userService.findByEmail('inconnu@example.com');
      
      expect(result).toBeNull();
    });
  });

  // Tests pour findById
  describe('findById', () => {
    it('devrait retourner un utilisateur par ID', async () => {
      prismaService.user.findUnique.mockResolvedValue(mockUser);
      
      const result = await userService.findById('test-id');
      
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'test-id' },
        include: { role: true }
      });
      expect(result).toEqual(mockUser);
    });
  });

  // Tests pour findAll
  describe('findAll', () => {
    it('devrait retourner tous les utilisateurs avec pagination', async () => {
      // Créer une copie du mockUser pour le mock de findMany
      const userForFindMany = {...mockUser};
      
      prismaService.user.findMany.mockResolvedValue([userForFindMany]);
      prismaService.user.count.mockResolvedValue(1);
      
      const result = await userService.findAll({ skip: 0, take: 10 });
      
      expect(prismaService.user.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        where: undefined,
        orderBy: undefined,
        include: {
          role: true,
          courses: true
        }
      });
      
      // Vérifier que chaque utilisateur dans le résultat a le mot de passe défini à undefined
      // et non pas supprimé de l'objet (car dans le service c'est password: undefined)
      expect(result.data[0].password).toBeUndefined();
      expect(result.meta).toEqual({
        total: 1,
        skip: 0,
        take: 10
      });
    });

    it('devrait gérer une liste vide d\'utilisateurs', async () => {
      prismaService.user.findMany.mockResolvedValue([]);
      prismaService.user.count.mockResolvedValue(0);
      
      const result = await userService.findAll({ skip: 0, take: 10 });
      
      expect(result.data).toHaveLength(0);
      expect(result.meta).toEqual({
        total: 0,
        skip: 0,
        take: 10
      });
    });

    it('devrait filtrer les utilisateurs selon les critères fournis', async () => {
      prismaService.user.findMany.mockResolvedValue([]);
      prismaService.user.count.mockResolvedValue(0);
      
      const whereClause = { email: { contains: 'example.com' } };
      await userService.findAll({ where: whereClause });
      
      expect(prismaService.user.findMany).toHaveBeenCalledWith({
        skip: undefined,
        take: undefined,
        where: whereClause,
        orderBy: undefined,
        include: {
          role: true,
          courses: true
        }
      });
      expect(prismaService.user.count).toHaveBeenCalledWith({ where: whereClause });
    });
  });

  // Tests pour create
  describe('create', () => {
    const createUserData = {
      firstname: 'Jean',
      lastname: 'Dupont',
      email: 'jean.dupont@example.com',
      password: 'password123',
      role_id: 'role-id'
    };

    it('devrait créer un nouvel utilisateur', async () => {
      // Correctement configurer le mock pour findUnique
      prismaService.user.findUnique.mockResolvedValue(null);
      prismaService.user.create.mockResolvedValue(mockUser);
      
      const result = await userService.create(createUserData);
      
      // Vérifier l'appel à findUnique
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'jean.dupont@example.com' },
        include: { role: true }
      });
      
      expect(argon2.hash).toHaveBeenCalledWith('password123');
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: {
          firstname: 'Jean',
          lastname: 'Dupont',
          email: 'jean.dupont@example.com',
          password: 'hashed_password',
          role: {
            connect: {
              id: 'role-id'
            }
          }
        },
        include: {
          role: true
        }
      });
      expect(result).not.toHaveProperty('password');
    });

    it('devrait lancer une exception si l\'email existe déjà', async () => {
      prismaService.user.findUnique.mockResolvedValue(mockUser);
      
      await expect(userService.create(createUserData)).rejects.toThrow(ConflictException);
    });

    it('devrait gérer les erreurs de base de données lors de la création', async () => {
      prismaService.user.findUnique.mockResolvedValue(null);
      const dbError = new Error('Database error');
      prismaService.user.create.mockRejectedValue(dbError);
      
      await expect(userService.create(createUserData)).rejects.toThrow(Error);
    });

    it('devrait créer un utilisateur avec un email en majuscules et le normaliser', async () => {
      prismaService.user.findUnique.mockResolvedValue(null);
      prismaService.user.create.mockResolvedValue({
        ...mockUser,
        email: 'jean.dupont@example.com' // email normalisé
      });
      
      const result = await userService.create({
        ...createUserData,
        email: 'JEAN.DUPONT@EXAMPLE.COM' // email en majuscules
      });
      
      expect(result.email).toBe('jean.dupont@example.com');
    });
  });

  // Tests pour update
  describe('update', () => {
    it('devrait mettre à jour un utilisateur', async () => {
      // Créer une copie du mockUser sans le mot de passe pour le résultat attendu
      const { password, ...userWithoutPassword } = mockUser;
      
      prismaService.user.update.mockResolvedValue(mockUser);
      
      const result = await userService.update('test-id', { firstname: 'Jacques' });
      
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: 'test-id' },
        data: { firstname: 'Jacques' },
        include: { role: true }
      });
      expect(result).not.toHaveProperty('password');
    });

    it('devrait hasher le mot de passe lors de la mise à jour', async () => {
      // Créer une copie du mockUser sans le mot de passe pour le résultat attendu
      const { password, ...userWithoutPassword } = mockUser;
      
      prismaService.user.update.mockResolvedValue(mockUser);
      
      await userService.update('test-id', { password: 'nouveauMotDePasse' });
      
      expect(argon2.hash).toHaveBeenCalledWith('nouveauMotDePasse');
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: 'test-id' },
        data: { password: 'hashed_password' },
        include: { role: true }
      });
    });

    it('devrait lancer une NotFoundException si l\'utilisateur n\'existe pas', async () => {
      const error = new Error('User not found');
      (error as any).code = 'P2025';
      prismaService.user.update.mockRejectedValue(error);
      
      await expect(userService.update('invalid-id', { firstname: 'Jacques' }))
        .rejects.toThrow(NotFoundException);
    });

    it('devrait propager les erreurs inattendues de la base de données', async () => {
      const unexpectedError = new Error('Unexpected database error');
      prismaService.user.update.mockRejectedValue(unexpectedError);
      
      await expect(userService.update('test-id', { firstname: 'Jacques' }))
        .rejects.toThrow(Error);
    });
  });

  // Tests pour remove
  describe('remove', () => {
    it('devrait supprimer un utilisateur', async () => {
      prismaService.user.delete.mockResolvedValue(mockUser);
      
      const result = await userService.remove('test-id');
      
      expect(prismaService.user.delete).toHaveBeenCalledWith({
        where: { id: 'test-id' }
      });
      expect(result).toEqual({
        success: true,
        message: 'Utilisateur supprimé avec succès'
      });
    });

    it('devrait lancer une NotFoundException si l\'utilisateur n\'existe pas', async () => {
      const error = new Error('User not found');
      (error as any).code = 'P2025';
      prismaService.user.delete.mockRejectedValue(error);
      
      await expect(userService.remove('invalid-id'))
        .rejects.toThrow(NotFoundException);
    });

    it('devrait propager les erreurs inattendues de la base de données', async () => {
      const unexpectedError = new Error('Unexpected database error');
      prismaService.user.delete.mockRejectedValue(unexpectedError);
      
      await expect(userService.remove('test-id'))
        .rejects.toThrow(Error);
    });
  });
});
