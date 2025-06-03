import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClient } from '@prisma/client';

// Type par défaut pour corriger les problèmes de linter
type Course = any;
type PrismaTypes = typeof PrismaClient.prototype;

@Injectable()
export class CourseService {
  constructor(private prisma: PrismaService) {}

  async create(data: any, user_id?: string | null): Promise<Course> {
    // D'abord créer le cours
    const course = await this.prisma.course.create({
      data,
      include: {
        users: {
          include: {
            user: true,
          }
        },
        absences: {
          include: {
            student: true,
          },
        },
      },
    });

    // Si un user_id est fourni, créer la relation UserCourse
    if (user_id) {
      console.log('Assignation du professeur:', user_id, 'au cours:', course.course_id);
      
      try {
        await this.prisma.userCourse.create({
          data: {
            user_id: user_id,
            course_id: course.course_id
          }
        });
        console.log('Professeur assigné avec succès');
      } catch (error) {
        console.error('Erreur lors de l\'assignation du professeur:', error);
        // Ne pas faire échouer la création du cours si l'assignation échoue
      }
    }

    // Retourner le cours avec les utilisateurs assignés
    return this.findOne(course.course_id);
  }

  async findAll(params?: {
    skip?: number;
    take?: number;
    where?: any;
    orderBy?: any;
  }): Promise<Course[]> {
    const { skip, take, where, orderBy } = params || {};
    return this.prisma.course.findMany({
      skip,
      take,
      where,
      orderBy,
      include: {
        users: {
          include: {
            user: true,
          }
        },
        absences: {
          include: {
            student: true,
          },
        },
      },
    });
  }

  async findOne(courseId: string): Promise<Course | null> {
    const course = await this.prisma.course.findUnique({
      where: { course_id: courseId },
      include: {
        users: {
          include: {
            user: true,
          }
        },
        absences: {
          include: {
            student: true,
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException(`Cours avec l'ID ${courseId} non trouvé`);
    }

    return course;
  }

  async update(courseId: string, data: any, user_id?: string | null): Promise<Course> {
    try {
      // Mettre à jour le cours
      const updatedCourse = await this.prisma.course.update({
        where: { course_id: courseId },
        data,
        include: {
          users: {
            include: {
              user: true,
            }
          },
          absences: true,
        },
      });

      // Gérer l'assignation du professeur si user_id est fourni
      if (user_id !== undefined) {
        // Supprimer les anciennes assignations
        await this.prisma.userCourse.deleteMany({
          where: { course_id: courseId }
        });

        // Ajouter la nouvelle assignation si user_id n'est pas vide
        if (user_id && user_id.trim() !== '') {
          console.log('Mise à jour de l\'assignation du professeur:', user_id, 'au cours:', courseId);
          
          try {
            await this.prisma.userCourse.create({
              data: {
                user_id: user_id,
                course_id: courseId
              }
            });
            console.log('Professeur mis à jour avec succès');
          } catch (error) {
            console.error('Erreur lors de la mise à jour de l\'assignation du professeur:', error);
          }
        }
      }

      // Retourner le cours mis à jour avec les utilisateurs assignés
      return this.findOne(courseId);
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Cours avec l'ID ${courseId} non trouvé`);
      }
      throw error;
    }
  }

  async remove(courseId: string): Promise<Course> {
    try {
      // D'abord supprimer les relations UserCourse
      await this.prisma.userCourse.deleteMany({
        where: { course_id: courseId }
      });

      // Puis supprimer le cours
      return await this.prisma.course.delete({
        where: { course_id: courseId },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Cours avec l'ID ${courseId} non trouvé`);
      }
      throw error;
    }
  }
}
