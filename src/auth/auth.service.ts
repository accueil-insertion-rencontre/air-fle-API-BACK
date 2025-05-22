import { Injectable, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as argon2 from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RedisService } from '../redis/redis.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ResetPasswordRequestDto, ResetPasswordConfirmDto } from './dto/reset-password.dto';
import { randomBytes } from 'crypto';

// Constantes pour la limitation des tentatives de connexion
const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 15 * 60; // 15 minutes en secondes
const RESET_TOKEN_EXPIRY = 24 * 60 * 60; // 24 heures en secondes

// Permissions associées aux rôles
const ROLE_PERMISSIONS = {
  admin: [
    'user:read', 'user:write', 'user:delete',
    'student:read', 'student:write', 'student:delete',
    'group:read', 'group:write', 'group:delete',
    'session:read', 'session:write', 'session:delete',
    'todolist:read', 'todolist:write', 'todolist:delete',
    'admin:access',
    'status:read', 'status:write', 'status:delete',
    'period:read', 'period:write', 'period:delete',
    'orientation:read', 'orientation:write', 'orientation:delete',
    'nationality:read', 'nationality:write', 'nationality:delete',
    'gender:read', 'gender:write', 'gender:delete',
    'frenchlevel:read', 'frenchlevel:write', 'frenchlevel:delete',
    'financing:read', 'financing:write', 'financing:delete',
    'exitreason:read', 'exitreason:write', 'exitreason:delete',
    'exam:read', 'exam:write', 'exam:delete',
    'disability:read', 'disability:write', 'disability:delete',
    'course:read', 'course:write', 'course:delete',
    'continuation:read', 'continuation:write', 'continuation:delete',
    'address:read', 'address:write', 'address:delete',
    'absence:read', 'absence:write', 'absence:delete'
  ],
  teacher: [
    'student:read', 'student:write', 'student:delete',
    'group:read', 'group:write', 'group:delete',
    'session:read', 'session:write', 'session:delete',
    'todolist:read', 'todolist:write', 'todolist:delete',
    'teacher:access',
    'self:read',
    'status:read', 'status:write', 'status:delete',
    'period:read', 'period:write', 'period:delete',
    'orientation:read', 'orientation:write', 'orientation:delete',
    'nationality:read', 'nationality:write', 'nationality:delete',
    'gender:read', 'gender:write', 'gender:delete',
    'frenchlevel:read', 'frenchlevel:write', 'frenchlevel:delete',
    'financing:read', 'financing:write', 'financing:delete',
    'exitreason:read', 'exitreason:write', 'exitreason:delete',
    'exam:read', 'exam:write', 'exam:delete',
    'disability:read', 'disability:write', 'disability:delete',
    'course:read', 'course:write', 'course:delete',
    'continuation:read', 'continuation:write', 'continuation:delete',
    'address:read', 'address:write', 'address:delete',
    'absence:read', 'absence:write', 'absence:delete'
  ],
  // Autres rôles si nécessaire
};

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

      // Vérifier si le compte est actif
      // @ts-ignore - Le champ isActive est disponible après régénération des types Prisma
      if (user.isActive === false) {
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

  /**
   * Enregistre un événement d'authentification dans le système
   * @param userId ID de l'utilisateur concerné ou null si échec avant identification
   * @param event Type d'événement (login_success, login_failed, etc.)
   * @param details Détails supplémentaires
   * @param ip Adresse IP de la requête
   */
  private async logAuthEvent(
    userId: string | null,
    event: 'login_success' | 'login_failed' | 'account_locked' | 'account_disabled' | 'password_changed' | 'password_reset_requested' | 'password_reset_success' | 'logout',
    details: string,
    ip: string
  ): Promise<void> {
    try {
      // Stockage dans Redis pour analyse rapide
      const logEntry = JSON.stringify({
        timestamp: new Date().toISOString(),
        userId,
        event,
        details,
        ip
      });
      
      // Utiliser la méthode set pour stocker l'événement d'authentification
      const key = `auth_event:${new Date().toISOString()}:${userId || 'unknown'}`;
      await this.redisService.set(key, logEntry, 30 * 24 * 60 * 60); // 30 jours
      
      console.log(`[Auth Event] ${event} | User: ${userId || 'unknown'} | IP: ${ip} | ${details}`);
    } catch (error) {
      console.error('Erreur lors de la journalisation de l\'événement d\'authentification:', error);
    }
  }
  
  /**
   * Récupère les permissions associées à un rôle
   * @param role Nom du rôle
   * @returns Liste des permissions
   */
  private getPermissionsByRole(role: string): string[] {
    return ROLE_PERMISSIONS[role.toLowerCase()] || [];
  }

  async login(loginDto: LoginDto, ip: string) {
    try {
      // Vérifier si l'IP est bloquée
      if (await this.isIPBlocked(ip)) {
        await this.logAuthEvent(null, 'account_locked', 'Tentatives de connexion excessives', ip);
        
        return {
          success: false,
          message: 'Trop de tentatives de connexion infructueuses. Veuillez réessayer dans 15 minutes.'
        };
      }

      // Normaliser l'email
      const email = loginDto.email.toLowerCase().trim();
      
      // Récupérer l'utilisateur avec les informations de rôle
      const user = await this.prisma.user.findUnique({
        where: { email },
        include: { role: true }
      });

      // Vérifier si l'utilisateur existe
      if (!user) {
        await this.incrementLoginAttempt(ip);
        await this.logAuthEvent(null, 'login_failed', 'Utilisateur non trouvé', ip);
        return { success: false, message: 'Email ou mot de passe invalide' };
      }

      // Vérifier si le compte est actif
      // @ts-ignore - Le champ isActive est disponible après régénération des types Prisma
      if (user.isActive === false) {
        await this.logAuthEvent(user.id, 'account_disabled', 'Tentative de connexion à un compte désactivé', ip);
        return { success: false, message: 'Ce compte a été désactivé. Veuillez contacter un administrateur.' };
      }

      // Vérifier le mot de passe
      let passwordValid = false;
      try {
        passwordValid = await argon2.verify(user.password, loginDto.password);
      } catch (err) {
        console.error('Erreur de vérification du mot de passe:', err);
        passwordValid = false;
      }

      // En cas d'échec de l'authentification
      if (!passwordValid) {
        await this.incrementLoginAttempt(ip);
        await this.logAuthEvent(user.id, 'login_failed', 'Mot de passe incorrect', ip);
        return { success: false, message: 'Email ou mot de passe invalide' };
      }

      // Réinitialiser le compteur de tentatives en cas de succès
      await this.resetLoginAttempt(ip);
      
      // Récupérer les permissions associées au rôle
      // @ts-ignore - La relation role est disponible après régénération des types Prisma
      const permissions = this.getPermissionsByRole(user.role.rolename);

      // Générer le token JWT avec permissions
      const payload = {
        email: user.email,
        sub: user.id,
        // @ts-ignore - La relation role est disponible après régénération des types Prisma
        role: user.role.rolename,
        permissions
      };

      // Journaliser la connexion réussie
      await this.logAuthEvent(user.id, 'login_success', 'Connexion réussie', ip);

      // Retourner la réponse avec le token et informations utilisateur
      return {
        success: true,
        access_token: this.jwtService.sign(payload),
        user: {
          id: user.id,
          email: user.email,
          firstname: user.firstname,
          lastname: user.lastname,
          // @ts-ignore - La relation role est disponible après régénération des types Prisma
          role: user.role.rolename,
          permissions
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

  /**
   * Gère la déconnexion d'un utilisateur en invalidant son token JWT
   * @param token Token JWT à invalider 
   * @param userId ID de l'utilisateur
   * @param ip Adresse IP de la requête
   */
  async logout(token: string, userId: string, ip: string) {
    try {
      // Extraire les informations du token
      const decoded = this.jwtService.decode(token);
      if (!decoded || !decoded.sub) {
        return { success: false, message: 'Token invalide' };
      }

      // Stocker le token dans la liste noire avec sa date d'expiration
      const exp = decoded.exp * 1000; // Convertir en millisecondes
      const now = Date.now();
      const timeToExpire = Math.floor((exp - now) / 1000); // Secondes restantes

      if (timeToExpire > 0) {
        // Ajouter le token à la liste noire jusqu'à son expiration
        await this.redisService.set(`blacklist:${token}`, 'revoked', timeToExpire);
      }

      // Journaliser la déconnexion
      await this.logAuthEvent(userId, 'logout', 'Déconnexion réussie', ip);

      return { success: true, message: 'Déconnexion réussie' };
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      return { success: false, message: 'Une erreur est survenue lors de la déconnexion' };
    }
  }

  /**
   * Vérifie si un token est dans la liste noire (révoqué)
   * @param token Token JWT à vérifier
   */
  async isTokenBlacklisted(token: string): Promise<boolean> {
    const blacklisted = await this.redisService.get(`blacklist:${token}`);
    return !!blacklisted;
  }

  /**
   * Demande de réinitialisation de mot de passe
   * @param dto Informations pour la demande
   * @param ip Adresse IP de la requête
   */
  async requestPasswordReset(dto: ResetPasswordRequestDto, ip: string) {
    try {
      const { email } = dto;
      
      // Vérifier si l'utilisateur existe
      const user = await this.prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        // Ne pas révéler si l'email existe ou non pour des raisons de sécurité
        return { success: true, message: 'Si votre email est enregistré dans notre système, vous recevrez un lien pour réinitialiser votre mot de passe.' };
      }

      // Vérifier si le compte est actif
      // @ts-ignore - Le champ isActive est disponible après régénération des types Prisma
      if (user.isActive === false) {
        await this.logAuthEvent(user.id, 'account_disabled', 'Tentative de réinitialisation de mot de passe pour un compte désactivé', ip);
        return { success: true, message: 'Si votre email est enregistré dans notre système, vous recevrez un lien pour réinitialiser votre mot de passe.' };
      }

      // Générer un token de réinitialisation aléatoire
      const resetToken = randomBytes(32).toString('hex');
      
      // Stocker le token dans Redis avec une expiration de 24 heures
      const key = `reset_token:${resetToken}`;
      await this.redisService.set(key, user.id, RESET_TOKEN_EXPIRY);

      // Journaliser la demande
      await this.logAuthEvent(user.id, 'password_reset_requested', 'Demande de réinitialisation de mot de passe', ip);

      // TODO: Envoyer un email avec le lien de réinitialisation
      // Example: this.mailService.sendPasswordResetEmail(user.email, resetToken);
      console.log(`[Password Reset] Token for ${user.email}: ${resetToken}`);

      return { 
        success: true, 
        message: 'Si votre email est enregistré dans notre système, vous recevrez un lien pour réinitialiser votre mot de passe.' 
      };
    } catch (error) {
      console.error('Erreur lors de la demande de réinitialisation de mot de passe:', error);
      return { 
        success: false, 
        message: 'Une erreur est survenue lors de la demande de réinitialisation de mot de passe' 
      };
    }
  }

  /**
   * Confirme et réalise la réinitialisation de mot de passe
   * @param dto Informations pour la confirmation
   * @param ip Adresse IP de la requête
   */
  async confirmPasswordReset(dto: ResetPasswordConfirmDto, ip: string) {
    try {
      const { token, password } = dto;
      
      // Vérifier si le token existe dans Redis
      const key = `reset_token:${token}`;
      const userId = await this.redisService.get(key);
      
      if (!userId) {
        return { success: false, message: 'Token de réinitialisation invalide ou expiré' };
      }

      // Récupérer l'utilisateur
      const user = await this.prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        return { success: false, message: 'Utilisateur introuvable' };
      }

      // Vérifier si le compte est actif
      // @ts-ignore - Le champ isActive est disponible après régénération des types Prisma
      if (user.isActive === false) {
        await this.logAuthEvent(user.id, 'account_disabled', 'Tentative de réinitialisation de mot de passe pour un compte désactivé', ip);
        return { success: false, message: 'Ce compte a été désactivé' };
      }

      // Hacher le nouveau mot de passe
      const hashedPassword = await argon2.hash(password);
      
      // Mettre à jour le mot de passe de l'utilisateur
      await this.prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword }
      });

      // Supprimer le token de réinitialisation
      await this.redisService.del(key);

      // Journaliser la réinitialisation réussie
      await this.logAuthEvent(user.id, 'password_reset_success', 'Réinitialisation de mot de passe réussie', ip);

      return { success: true, message: 'Votre mot de passe a été réinitialisé avec succès' };
    } catch (error) {
      console.error('Erreur lors de la réinitialisation de mot de passe:', error);
      return { 
        success: false, 
        message: 'Une erreur est survenue lors de la réinitialisation de mot de passe' 
      };
    }
  }

  /**
   * Change le mot de passe d'un utilisateur connecté
   * @param userId ID de l'utilisateur
   * @param dto Informations pour le changement de mot de passe
   * @param ip Adresse IP de la requête
   */
  async changePassword(userId: string, dto: ChangePasswordDto, ip: string) {
    try {
      const { currentPassword, newPassword, confirmPassword } = dto;
      
      // Vérifier si les mots de passe correspondent
      if (newPassword !== confirmPassword) {
        return { success: false, message: 'Les nouveaux mots de passe ne correspondent pas' };
      }

      // Récupérer l'utilisateur
      const user = await this.prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        return { success: false, message: 'Utilisateur introuvable' };
      }

      // Vérifier le mot de passe actuel
      const isPasswordValid = await argon2.verify(user.password, currentPassword);
      if (!isPasswordValid) {
        await this.logAuthEvent(user.id, 'password_changed', 'Échec de changement de mot de passe: mot de passe actuel incorrect', ip);
        return { success: false, message: 'Mot de passe actuel incorrect' };
      }

      // Hacher le nouveau mot de passe
      const hashedPassword = await argon2.hash(newPassword);
      
      // Mettre à jour le mot de passe de l'utilisateur
      await this.prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword }
      });

      // Journaliser le changement de mot de passe
      await this.logAuthEvent(user.id, 'password_changed', 'Changement de mot de passe réussi', ip);

      return { success: true, message: 'Votre mot de passe a été changé avec succès' };
    } catch (error) {
      console.error('Erreur lors du changement de mot de passe:', error);
      return { 
        success: false, 
        message: 'Une erreur est survenue lors du changement de mot de passe' 
      };
    }
  }

  /**
   * Active ou désactive un compte utilisateur (pour les administrateurs)
   * @param adminId ID de l'administrateur effectuant l'action
   * @param userId ID de l'utilisateur à modifier
   * @param active Nouveau statut du compte
   * @param ip Adresse IP de la requête
   */
  async setUserActiveStatus(adminId: string, userId: string, active: boolean, ip: string) {
    try {
      // Vérifier si l'administrateur existe et a les droits
      const admin = await this.prisma.user.findUnique({
        where: { id: adminId },
        include: { role: true }
      });

      // @ts-ignore - La relation role est disponible après régénération des types Prisma
      if (!admin || admin.role.rolename !== 'admin') {
        return { success: false, message: 'Vous n\'avez pas les droits pour effectuer cette action' };
      }

      // Vérifier si l'utilisateur cible existe
      const targetUser = await this.prisma.user.findUnique({
        where: { id: userId }
      });

      if (!targetUser) {
        return { success: false, message: 'Utilisateur introuvable' };
      }

      // Mettre à jour le statut de l'utilisateur
      await this.prisma.$executeRaw`UPDATE "User" SET "isActive" = ${active} WHERE id = ${userId}`;

      // Journaliser l'action
      const actionType = active ? 'activé' : 'désactivé';
      await this.logAuthEvent(
        adminId, 
        'account_disabled', 
        `Compte utilisateur ${userId} ${actionType} par l'administrateur`, 
        ip
      );

      return { 
        success: true, 
        message: `Le compte utilisateur a été ${actionType} avec succès` 
      };
    } catch (error) {
      console.error('Erreur lors de la modification du statut du compte:', error);
      return { 
        success: false, 
        message: 'Une erreur est survenue lors de la modification du statut du compte' 
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

      // Préparer les données de l'utilisateur
      const userData = {
        firstname: registerDto.firstname,
        lastname: registerDto.lastname,
        email,
        password: hashedPassword,
        isActive: registerDto.isActive !== undefined ? registerDto.isActive : true,
        role: {
          connect: {
            id: userRole.id,
          },
        },
      };

      // Ajouter la date de naissance si elle est fournie
      if (registerDto.birthdate) {
        userData['birthdate'] = new Date(registerDto.birthdate);
      }

      // Créer l'utilisateur
      const user = await this.prisma.user.create({
        data: userData,
        include: {
          role: true,
        },
      });

      // Récupérer les permissions associées au rôle
      // @ts-ignore - La relation role sera disponible après régénération des types Prisma
      const permissions = this.getPermissionsByRole(user.role.rolename);

      // Générer le token JWT
      const payload = {
        email: user.email,
        sub: user.id,
        // @ts-ignore - La relation role sera disponible après régénération des types Prisma
        role: user.role.rolename,
        permissions
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
          // @ts-ignore - La relation role sera disponible après régénération des types Prisma
          role: user.role.rolename,
          permissions
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
