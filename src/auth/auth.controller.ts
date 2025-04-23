import { Controller, Post, Body, HttpCode, HttpStatus, Get, Ip } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as argon2 from 'argon2';

// Stockage en mémoire des tentatives de connexion
// En production, cela devrait être dans une base de données ou un cache Redis
const loginAttempts = new Map<string, { count: number, lastAttempt: number }>();
const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 15 * 60 * 1000; // 15 minutes en millisecondes

@Controller('auth')
export class AuthController {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  @Get('roles')
  @HttpCode(HttpStatus.OK)
  async getRoles() {
    const roles = await this.prisma.role.findMany();
    return { roles };
  }

  /**
   * Vérifie si l'adresse IP a dépassé le nombre maximal de tentatives
   */
  private isIPBlocked(ip: string): boolean {
    const attempt = loginAttempts.get(ip);
    
    if (!attempt) return false;
    
    const now = Date.now();
    
    // Si le temps de blocage est passé, réinitialiser le compteur
    if (attempt.count >= MAX_LOGIN_ATTEMPTS && now - attempt.lastAttempt > LOCK_TIME) {
      loginAttempts.set(ip, { count: 0, lastAttempt: now });
      return false;
    }
    
    return attempt.count >= MAX_LOGIN_ATTEMPTS;
  }

  /**
   * Incrémente le compteur de tentatives pour une adresse IP
   */
  private incrementLoginAttempt(ip: string): void {
    const attempt = loginAttempts.get(ip) || { count: 0, lastAttempt: 0 };
    attempt.count++;
    attempt.lastAttempt = Date.now();
    loginAttempts.set(ip, attempt);
  }

  /**
   * Réinitialise le compteur de tentatives pour une adresse IP
   */
  private resetLoginAttempt(ip: string): void {
    loginAttempts.delete(ip);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto, @Ip() ip: string) {
    try {
      // Vérifier si l'IP est bloquée
      if (this.isIPBlocked(ip)) {
        return {
          success: false,
          message: 'Trop de tentatives de connexion infructueuses. Veuillez réessayer dans 15 minutes.'
        };
      }

      // Trouver l'utilisateur par email
      const user = await this.prisma.user.findUnique({
        where: { email: loginDto.email },
        include: { role: true },
      });

      if (!user) {
        // Incrémenter le compteur même si l'email n'existe pas (pour éviter l'énumération des comptes)
        this.incrementLoginAttempt(ip);
        return { success: false, message: 'Email ou mot de passe invalide' };
      }

      let passwordValid = false;
      
      // Vérifier avec Argon2
      try {
        passwordValid = await argon2.verify(user.password, loginDto.password);
      } catch (err) {
        // En cas d'erreur de vérification, considérer le mot de passe comme invalide
        passwordValid = false;
      }

      if (!passwordValid) {
        this.incrementLoginAttempt(ip);
        return { success: false, message: 'Email ou mot de passe invalide' };
      }

      // Réinitialiser le compteur de tentatives en cas de succès
      this.resetLoginAttempt(ip);

      // Générer le token JWT
      const payload = {
        email: user.email,
        sub: user.id,
        role: user.role.rolename,
      };

      return {
        success: true,
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
      return { success: false, message: 'Une erreur est survenue', error: error.message };
    }
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    try {
      // Vérifier si l'utilisateur existe déjà
      const existingUser = await this.prisma.user.findUnique({
        where: { email: registerDto.email },
      });

      if (existingUser) {
        return { success: false, message: 'Un utilisateur avec cet email existe déjà' };
      }

      // Hacher le mot de passe avec Argon2
      const hashedPassword = await argon2.hash(registerDto.password);

      // Créer l'utilisateur
      const user = await this.prisma.user.create({
        data: {
          firstname: registerDto.firstname,
          lastname: registerDto.lastname,
          email: registerDto.email,
          password: hashedPassword,
          role: {
            connect: {
              id: registerDto.role_id,
            },
          },
        },
        include: {
          role: true,
        },
      });

      // Générer le token JWT
      const payload = {
        email: user.email,
        sub: user.id,
        role: user.role.rolename,
      };

      return {
        success: true,
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
      return { success: false, message: 'Une erreur est survenue', error: error.message };
    }
  }
}
