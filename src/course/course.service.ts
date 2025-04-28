import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClient } from '@prisma/client';

// Type par défaut pour corriger les problèmes de linter
type Course = any;
type PrismaTypes = typeof PrismaClient.prototype;

@Injectable()
export class CourseService {
  constructor(private prisma: PrismaService) {}

  async create(data: any): Promise<Course> {
    return this.prisma.course.create({
      data,
      include: {
        users: true,
        absences: {
          include: {
            student: true,
          },
        },
      },
    });
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
        users: true,
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
        users: true,
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

  async update(courseId: string, data: any): Promise<Course> {
    try {
      return await this.prisma.course.update({
        where: { course_id: courseId },
        data,
        include: {
          users: true,
          absences: true,
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Cours avec l'ID ${courseId} non trouvé`);
      }
      throw error;
    }
  }

  async remove(courseId: string): Promise<Course> {
    try {
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
