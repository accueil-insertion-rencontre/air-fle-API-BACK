import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { HttpStatus } from '@nestjs/common';
import * as argon2 from 'argon2';

jest.mock('argon2');

describe('AuthController', () => {
  let controller: AuthController;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    role: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('test-jwt-token'),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getRoles', () => {
    it('should return all roles', async () => {
      const mockRoles = [
        { id: '1', rolename: 'admin' },
        { id: '2', rolename: 'teacher' },
      ];
      mockPrismaService.role.findMany.mockResolvedValue(mockRoles);

      const result = await controller.getRoles();
      
      expect(result).toEqual({ roles: mockRoles });
      expect(mockPrismaService.role.findMany).toHaveBeenCalled();
    });
  });

  describe('login', () => {
    const loginDto = { email: 'test@example.com', password: 'password123' };
    const mockUser = {
      id: 'user-id',
      email: 'test@example.com',
      firstname: 'Test',
      lastname: 'User',
      password: 'hashed-password',
      role: { id: 'role-id', rolename: 'teacher' },
    };

    it('should return success and token when credentials are valid', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      (argon2.verify as jest.Mock).mockResolvedValue(true);

      const result = await controller.login(loginDto, '127.0.0.1');

      expect(result).toEqual({
        success: true,
        access_token: 'test-jwt-token',
        user: {
          id: 'user-id',
          email: 'test@example.com',
          firstname: 'Test',
          lastname: 'User',
          role: 'teacher',
        },
      });

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
        include: { role: true },
      });

      expect(argon2.verify).toHaveBeenCalledWith('hashed-password', 'password123');
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        email: 'test@example.com',
        sub: 'user-id',
        role: 'teacher',
      });
    });

    it('should return failure when user is not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const result = await controller.login(loginDto, '127.0.0.1');

      expect(result).toEqual({
        success: false,
        message: 'Email ou mot de passe invalide',
      });
    });

    it('should return failure when password is invalid', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      (argon2.verify as jest.Mock).mockResolvedValue(false);

      const result = await controller.login(loginDto, '127.0.0.1');

      expect(result).toEqual({
        success: false,
        message: 'Email ou mot de passe invalide',
      });
    });

    it('should handle argon2 verification errors', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      (argon2.verify as jest.Mock).mockRejectedValue(new Error('Verification error'));

      const result = await controller.login(loginDto, '127.0.0.1');

      expect(result).toEqual({
        success: false,
        message: 'Email ou mot de passe invalide',
      });
    });

    it('should block IP after multiple failed attempts', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      (argon2.verify as jest.Mock).mockResolvedValue(false);

      const ip = '127.0.0.2';
      
      // Simulate 5 failed attempts
      for (let i = 0; i < 5; i++) {
        await controller.login(loginDto, ip);
      }

      // 6th attempt should be blocked
      const result = await controller.login(loginDto, ip);

      expect(result).toEqual({
        success: false,
        message: 'Trop de tentatives de connexion infructueuses. Veuillez réessayer dans 15 minutes.',
      });
    });
  });

  describe('register', () => {
    const registerDto = {
      firstname: 'New',
      lastname: 'User',
      email: 'new@example.com',
      password: 'password123',
    };

    const mockRole = { id: 'role-id', rolename: 'teacher' };
    const mockCreatedUser = {
      id: 'new-user-id',
      firstname: 'New',
      lastname: 'User',
      email: 'new@example.com',
      password: 'hashed-password',
      role: mockRole,
    };

    it('should create a new user and return success with token', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.role.findUnique.mockResolvedValue(mockRole);
      mockPrismaService.user.create.mockResolvedValue(mockCreatedUser);
      (argon2.hash as jest.Mock).mockResolvedValue('hashed-password');

      const result = await controller.register(registerDto);

      expect(result).toEqual({
        success: true,
        access_token: 'test-jwt-token',
        user: {
          id: 'new-user-id',
          email: 'new@example.com',
          firstname: 'New',
          lastname: 'User',
          role: 'teacher',
        },
      });

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'new@example.com' },
      });

      expect(mockPrismaService.role.findUnique).toHaveBeenCalledWith({
        where: { rolename: 'teacher' },
      });

      expect(argon2.hash).toHaveBeenCalledWith('password123');

      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: {
          firstname: 'New',
          lastname: 'User',
          email: 'new@example.com',
          password: 'hashed-password',
          role: {
            connect: {
              id: 'role-id',
            },
          },
        },
        include: {
          role: true,
        },
      });

      expect(mockJwtService.sign).toHaveBeenCalledWith({
        email: 'new@example.com',
        sub: 'new-user-id',
        role: 'teacher',
      });
    });

    it('should return failure when user already exists', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({ id: 'existing-user-id' });

      const result = await controller.register(registerDto);

      expect(result).toEqual({
        success: false,
        message: 'Un utilisateur avec cet email existe déjà',
      });

      expect(mockPrismaService.user.create).not.toHaveBeenCalled();
    });

    it('should return failure when role is not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.role.findUnique.mockResolvedValue(null);
      (argon2.hash as jest.Mock).mockResolvedValue('hashed-password');

      const result = await controller.register(registerDto);

      expect(result).toEqual({
        success: false,
        message: 'Rôle utilisateur introuvable',
      });

      expect(mockPrismaService.user.create).not.toHaveBeenCalled();
    });

    it('should handle argon2 hashing errors', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      (argon2.hash as jest.Mock).mockRejectedValue(new Error('Hashing error'));

      const result = await controller.register(registerDto);

      expect(result).toEqual({
        success: false,
        message: 'Erreur lors de la création du compte',
      });

      expect(mockPrismaService.user.create).not.toHaveBeenCalled();
    });

    it('should handle database errors during user creation', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.role.findUnique.mockResolvedValue(mockRole);
      (argon2.hash as jest.Mock).mockResolvedValue('hashed-password');
      mockPrismaService.user.create.mockRejectedValue(new Error('Database error'));

      const result = await controller.register(registerDto);

      expect(result).toEqual({
        success: false,
        message: 'Une erreur est survenue lors de l\'inscription',
      });
    });
  });
});
