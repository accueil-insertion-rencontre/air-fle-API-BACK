import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as argon2 from 'argon2';

jest.mock('argon2');

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;

  const mockUserService = {
    findByEmail: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    const mockUser = {
      id: 'user-id',
      email: 'test@example.com',
      firstname: 'Test',
      lastname: 'User',
      password: 'hashed-password',
      role: { id: 'role-id', rolename: 'teacher' },
    };

    it('should return user without password when credentials are valid', async () => {
      mockUserService.findByEmail.mockResolvedValue(mockUser);
      (argon2.verify as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser('test@example.com', 'password123');

      expect(result).toEqual({
        id: 'user-id',
        email: 'test@example.com',
        firstname: 'Test',
        lastname: 'User',
        role: { id: 'role-id', rolename: 'teacher' },
      });

      expect(mockUserService.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(argon2.verify).toHaveBeenCalledWith('hashed-password', 'password123');
    });

    it('should return null when user is not found', async () => {
      mockUserService.findByEmail.mockResolvedValue(null);

      const result = await service.validateUser('nonexistent@example.com', 'password123');

      expect(result).toBeNull();
      expect(mockUserService.findByEmail).toHaveBeenCalledWith('nonexistent@example.com');
    });

    it('should return null when password is invalid', async () => {
      mockUserService.findByEmail.mockResolvedValue(mockUser);
      (argon2.verify as jest.Mock).mockResolvedValue(false);

      const result = await service.validateUser('test@example.com', 'wrong-password');

      expect(result).toBeNull();
      expect(mockUserService.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(argon2.verify).toHaveBeenCalledWith('hashed-password', 'wrong-password');
    });

    it('should return null when argon2 throws an error', async () => {
      mockUserService.findByEmail.mockResolvedValue(mockUser);
      (argon2.verify as jest.Mock).mockRejectedValue(new Error('Verification error'));

      const result = await service.validateUser('test@example.com', 'password123');

      expect(result).toBeNull();
      expect(mockUserService.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(argon2.verify).toHaveBeenCalledWith('hashed-password', 'password123');
    });
  });

  describe('validateUserCredentials', () => {
    it('should call validateUser with the same parameters', async () => {
      // Mock the validateUser method
      const validateUserSpy = jest.spyOn(service, 'validateUser').mockResolvedValue({
        id: 'user-id',
        email: 'test@example.com',
      });

      await service.validateUserCredentials('test@example.com', 'password123');

      expect(validateUserSpy).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });
});
