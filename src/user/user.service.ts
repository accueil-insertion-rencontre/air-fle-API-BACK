import { Injectable, ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as argon2 from 'argon2';
import { Prisma } from '@prisma/client';
import { RedisService } from '../redis/redis.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private redisService: RedisService,
    private jwtService: JwtService
  ) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        role: true,
      },
    });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        role: true,
      },
    });
  }

  async findAll(params?: {
    skip?: number;
    take?: number;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }) {
    const { skip, take, where, orderBy } = params || {};
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take,
        where,
        orderBy,
        include: {
          role: true,
          courses: true,
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: users.map(user => ({
        ...user,
        password: undefined, // Ne pas exposer le mot de passe
      })),
      meta: {
        total,
        skip: skip || 0,
        take: take || total,
      },
    };
  }

  async create(data: {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    role_id: string;
    isActive?: boolean;
    birthdate?: string;
  }) {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await this.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictException('Un utilisateur avec cet email existe déjà');
    }

    // Hasher le mot de passe avec argon2
    const hashedPassword = await argon2.hash(data.password);

    // Préparer les données de l'utilisateur
    const userData: any = {
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        password: hashedPassword,
      isActive: data.isActive !== undefined ? data.isActive : true, // Utiliser la valeur fournie ou true par défaut
        role: {
          connect: {
            id: data.role_id,
          },
        },
    };

    // Ajouter la date de naissance si elle est fournie
    if (data.birthdate) {
      userData.birthdate = new Date(data.birthdate);
    }

    // Créer l'utilisateur
    const user = await this.prisma.user.create({
      data: userData,
      include: {
        role: true,
      },
    });

    // Ne pas retourner le mot de passe
    const { password, ...result } = user;
    return result;
  }

  async update(id: string, data: Prisma.UserUpdateInput) {
    try {
      // Si le mot de passe est fourni, le hasher avec argon2
      if (typeof data.password === 'string') {
        data.password = await argon2.hash(data.password as string);
      }

      // Convertir la date de naissance en objet Date si elle est fournie
      if (typeof data.birthdate === 'string') {
        data.birthdate = new Date(data.birthdate);
      }

      const updatedUser = await this.prisma.user.update({
        where: { id },
        data,
        include: {
          role: true,
        },
      });

      // Ne pas retourner le mot de passe
      const { password, ...result } = updatedUser;
      return result;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Utilisateur avec l'ID ${id} non trouvé`);
      }
      throw error;
    }
  }

  async remove(id: string, token?: string) {
    try {
      let userId = null;
      
      // Vérifier d'abord si l'utilisateur à supprimer existe
      const userToDelete = await this.prisma.user.findUnique({
        where: { id },
        include: { role: true }
      });
      
      if (!userToDelete) {
        throw new NotFoundException(`Utilisateur avec l'ID ${id} non trouvé`);
      }
      
      // Si c'est un administrateur, vérifier s'il y a d'autres administrateurs
      if (userToDelete.role && userToDelete.role.rolename === 'admin') {
        // Compter le nombre d'administrateurs
        const adminCount = await this.prisma.user.count({
          where: {
            role: {
              rolename: 'admin'
            },
            isActive: true
          }
        });
        
        if (adminCount <= 1) {
          throw new UnauthorizedException('Impossible de supprimer le dernier administrateur du système');
        }
      }
      
      // Extraire les informations du token s'il est fourni
      if (token) {
        try {
          const decoded = this.jwtService.decode(token);
          if (decoded && decoded.sub) {
            userId = decoded.sub;
            
            // Vérifier si l'utilisateur tente de supprimer son propre compte
            if (id === userId) {
              // Si c'est un administrateur, empêcher la suppression
              if (userToDelete.role && userToDelete.role.rolename === 'admin') {
                throw new UnauthorizedException('Un administrateur ne peut pas supprimer son propre compte');
              }
            }
            
            // Traitement pour la liste noire du token
            if (decoded.exp) {
              const exp = decoded.exp * 1000; // Convertir en millisecondes
              const now = Date.now();
              const timeToExpire = Math.floor((exp - now) / 1000); // Secondes restantes

              if (timeToExpire > 0) {
                // Ajouter le token à la liste noire jusqu'à son expiration
                await this.redisService.set(`blacklist:${token}`, 'revoked', timeToExpire);
                console.log(`Token ajouté à la liste noire pour l'utilisateur ${id}`);
              }
            }
          }
        } catch (error) {
          console.error('Erreur lors de la révocation du token:', error);
        }
      }

      await this.prisma.user.delete({
        where: { id },
      });
      return { success: true, message: 'Utilisateur supprimé avec succès' };
    } catch (error) {
      if (error instanceof UnauthorizedException || error instanceof NotFoundException) {
        throw error;
      }
      if (error.code === 'P2025') {
        throw new NotFoundException(`Utilisateur avec l'ID ${id} non trouvé`);
      }
      throw error;
    }
  }
}
