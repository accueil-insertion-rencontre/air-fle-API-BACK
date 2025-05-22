import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as argon2 from 'argon2';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

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
  }) {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await this.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictException('Un utilisateur avec cet email existe déjà');
    }

    // Hasher le mot de passe avec argon2
    const hashedPassword = await argon2.hash(data.password);

    // Créer l'utilisateur
    const user = await this.prisma.user.create({
      data: {
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
      },
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

  async remove(id: string) {
    try {
      await this.prisma.user.delete({
        where: { id },
      });
      return { success: true, message: 'Utilisateur supprimé avec succès' };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Utilisateur avec l'ID ${id} non trouvé`);
      }
      throw error;
    }
  }
}
