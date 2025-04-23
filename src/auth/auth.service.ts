import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as argon2 from 'argon2';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    try {
      const user = await this.userService.findByEmail(email);
      if (!user) {
        return null;
      }

      let isPasswordValid = false;
      try {
        isPasswordValid = await argon2.verify(user.password, password);
      } catch (error) {
        return null;
      }

      if (!isPasswordValid) {
        return null;
      }

      const { password: _, ...result } = user;
      return result;
    } catch (error) {
      console.error('Error validating user:', error);
      return null;
    }
  }

  async login(loginDto: LoginDto) {
    try {
      // Approche simplifiée pour déboguer
      const user = await this.prisma.user.findUnique({
        where: { email: loginDto.email },
        include: { role: true },
      });

      if (!user) {
        throw new UnauthorizedException('Email ou mot de passe invalide');
      }

      let isPasswordValid = false;
      try {
        isPasswordValid = await argon2.verify(user.password, loginDto.password);
      } catch (error) {
        throw new UnauthorizedException('Email ou mot de passe invalide');
      }

      if (!isPasswordValid) {
        throw new UnauthorizedException('Email ou mot de passe invalide');
      }

      const payload = {
        email: user.email,
        sub: user.id,
        role: user.role.rolename,
      };

      return {
        access_token: this.jwtService.sign(payload),
        user: {
          id: user.id,
          email: user.email,
          firstname: user.firstname,
          lastname: user.lastname,
          role: user.role.rolename,
        },
      };
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  }

  async register(registerDto: RegisterDto) {
    try {
      const user = await this.userService.create(registerDto);
      
      const payload = {
        email: user.email,
        sub: user.id,
        role: user.role.rolename,
      };

      return {
        access_token: this.jwtService.sign(payload),
        user: {
          id: user.id,
          email: user.email,
          firstname: user.firstname,
          lastname: user.lastname,
          role: user.role.rolename,
        },
      };
    } catch (error) {
      console.error('Error during registration:', error);
      throw error;
    }
  }
}
