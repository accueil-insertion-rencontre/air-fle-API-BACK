import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as argon2 from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RedisService } from '../redis/redis.service';

// Constantes pour la limitation des tentatives de connexion
const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 15 * 60; // 15 minutes en secondes

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private prisma: PrismaService,
    private redisService: RedisService,
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
        console.error('Error validating user password:', error);
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

  // Fonction pour vérifier les tentatives de connexion (pour JWT Strategy)
  async validateUserCredentials(email: string, password: string) {
    return this.validateUser(email, password);
  }

  /**
   * Vérifie si l'adresse IP a dépassé le nombre maximal de tentatives
   */
  private async isIPBlocked(ip: string): Promise<boolean> {
    const key = `login_attempts:${ip}`;
    const attemptsData = await this.redisService.get(key);
    
    if (!attemptsData) return false;
    
    const attempts = JSON.parse(attemptsData);
    const now = Date.now();
    
    // Si le temps de blocage est passé, réinitialiser le compteur
    if (attempts.count >= MAX_LOGIN_ATTEMPTS && now - attempts.lastAttempt > LOCK_TIME * 1000) {
      await this.resetLoginAttempt(ip);
      return false;
    }
    
    return attempts.count >= MAX_LOGIN_ATTEMPTS;
  }

  /**
   * Incrémente le compteur de tentatives pour une adresse IP
   */
  private async incrementLoginAttempt(ip: string): Promise<void> {
    const key = `login_attempts:${ip}`;
    const attemptsData = await this.redisService.get(key);
    
    const attempts = attemptsData 
      ? JSON.parse(attemptsData) 
      : { count: 0, lastAttempt: 0 };
    
    attempts.count++;
    attempts.lastAttempt = Date.now();
    
    // Stocker avec une expiration de 24h pour éviter de garder trop longtemps les données
    await this.redisService.set(key, JSON.stringify(attempts), 24 * 60 * 60);
  }

  /**
   * Réinitialise le compteur de tentatives pour une adresse IP
   */
  private async resetLoginAttempt(ip: string): Promise<void> {
    const key = `login_attempts:${ip}`;
    await this.redisService.del(key);
  }

  async login(loginDto: LoginDto, ip: string) {
    try {
      // Vérifier si l'IP est bloquée
      if (await this.isIPBlocked(ip)) {
        return {
          success: false,
          message: 'Trop de tentatives de connexion infructueuses. Veuillez réessayer dans 15 minutes.'
        };
      }

      // Utiliser la méthode validateUser pour la cohérence
      const email = loginDto.email.toLowerCase().trim();
      const user = await this.prisma.user.findUnique({
        where: { email },
        include: { role: true },
      });

      if (!user) {
        // Incrémenter le compteur même si l'email n'existe pas (pour éviter l'énumération des comptes)
        await this.incrementLoginAttempt(ip);
        return { success: false, message: 'Email ou mot de passe invalide' };
      }

      let passwordValid = false;
      
      // Vérifier avec Argon2
      try {
        passwordValid = await argon2.verify(user.password, loginDto.password);
      } catch (err) {
        // En cas d'erreur de vérification, considérer le mot de passe comme invalide
        console.error('Erreur de vérification du mot de passe:', err);
        passwordValid = false;
      }

      if (!passwordValid) {
        await this.incrementLoginAttempt(ip);
        return { success: false, message: 'Email ou mot de passe invalide' };
      }

      // Réinitialiser le compteur de tentatives en cas de succès
      await this.resetLoginAttempt(ip);

      // Générer le token JWT
      const payload = {
        email: user.email,
        sub: user.id,
        role: user.role.rolename,
      };

      // Retourner la réponse sans exposer d'informations sensibles
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
      // Log détaillé pour le débogage, mais message générique pour l'utilisateur
      console.error('Erreur lors de la connexion:', error);
      return { 
        success: false, 
        message: 'Une erreur est survenue lors de la connexion' 
      };
    }
  }

  async register(registerDto: RegisterDto) {
    try {
      const email = registerDto.email.toLowerCase().trim();
      
      // Vérifier si l'utilisateur existe déjà
      const existingUser = await this.prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return { success: false, message: 'Un utilisateur avec cet email existe déjà' };
      }

      // Hacher le mot de passe avec Argon2
      let hashedPassword;
      try {
        hashedPassword = await argon2.hash(registerDto.password);
      } catch (err) {
        console.error('Erreur de hachage du mot de passe:', err);
        return { success: false, message: 'Erreur lors de la création du compte' };
      }

      // Trouver le rôle utilisateur (teacher par défaut)
      let userRole = await this.prisma.role.findUnique({
        where: { rolename: 'teacher' },
      });

      if (!userRole) {
        // Si le rôle teacher n'existe pas, essayer de le créer
        try {
          userRole = await this.prisma.role.create({
            data: { rolename: 'teacher' }
          });
        } catch (error) {
          console.error('Erreur lors de la création du rôle teacher:', error);
          return { success: false, message: 'Rôle utilisateur introuvable et impossible à créer' };
        }
      }

      // Créer l'utilisateur
      const user = await this.prisma.user.create({
        data: {
          firstname: registerDto.firstname,
          lastname: registerDto.lastname,
          email,
          password: hashedPassword,
          role: {
            connect: {
              id: userRole.id,
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

      // Retourner la réponse sans exposer d'informations sensibles
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
      // Log détaillé pour le débogage, mais message générique pour l'utilisateur
      console.error('Erreur lors de l\'inscription:', error);
      return { 
        success: false, 
        message: 'Une erreur est survenue lors de l\'inscription' 
      };
    }
  }

  async getRoles() {
    try {
      const roles = await this.prisma.role.findMany();
      return { roles, success: true };
    } catch (error) {
      console.error('Erreur lors de la récupération des rôles:', error);
      return { 
        success: false, 
        message: 'Une erreur est survenue lors de la récupération des rôles' 
      };
    }
  }
}
