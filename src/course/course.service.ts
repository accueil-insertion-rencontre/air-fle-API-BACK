import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Course } from '@prisma/client';

// Type pour un cours avec ses relations
type CourseWithRelations = Prisma.CourseGetPayload<{
  include: {
    group: true;
    teachers: {
      include: {
        user: true;
      };
    };
    absences: true;
  };
}>;

// Type pour un cours avec session incluse
type CourseWithSession = Prisma.CourseGetPayload<{
  include: {
    group: {
      include: {
        session: true;
      };
    };
    teachers: {
      include: {
        user: true;
      };
    };
    absences: true;
  };
}>;

@Injectable()
export class CourseService {
  constructor(private prisma: PrismaService) {}

  async create(
    courseData: Prisma.CourseCreateInput,
  ): Promise<CourseWithRelations> {
    const course = await this.prisma.course.create({
      data: courseData,
      include: {
        group: true,
        teachers: {
          include: {
            user: true,
          },
        },
        absences: true,
      },
    });

    return course;
  }

  // ✅ Méthode spécialisée pour récupérer cours AVEC session
  async findAllWithSession(params?: {
    skip?: number;
    take?: number;
    where?: Prisma.CourseWhereInput;
    orderBy?: Prisma.CourseOrderByWithRelationInput;
  }): Promise<{
    data: CourseWithSession[];
    meta: { total: number; skip: number; take: number };
  }> {
    const { skip, take, where, orderBy } = params || {};

    const [courses, total] = await Promise.all([
      this.prisma.course.findMany({
        skip,
        take,
        where,
        orderBy,
        include: {
          group: {
            include: {
              session: true, // ✅ Session incluse quand nécessaire
            },
          },
          teachers: {
            include: {
              user: true,
            },
          },
          absences: true,
        },
      }),
      this.prisma.course.count({ where }),
    ]);

    return {
      data: courses,
      meta: {
        total,
        skip: skip || 0,
        take: take || total,
      },
    };
  }

  async addTeacher(courseId: string, userId: string): Promise<any> {
    return this.prisma.userCourse.create({
      data: {
        user_uuid: userId,
        course_uuid: courseId,
      },
    });
  }

  async findAll(params?: {
    skip?: number;
    take?: number;
    where?: Prisma.CourseWhereInput;
    orderBy?: Prisma.CourseOrderByWithRelationInput;
  }): Promise<{
    data: CourseWithRelations[];
    meta: { total: number; skip: number; take: number };
  }> {
    const { skip, take, where, orderBy } = params || {};

    const [courses, total] = await Promise.all([
      this.prisma.course.findMany({
        skip,
        take,
        where,
        orderBy,
        include: {
          group: true,
          teachers: {
            include: {
              user: true,
            },
          },
          absences: true,
        },
      }),
      this.prisma.course.count({ where }),
    ]);

    return {
      data: courses,
      meta: {
        total,
        skip: skip || 0,
        take: take || total,
      },
    };
  }

  async findOne(courseId: string): Promise<CourseWithRelations | null> {
    return this.prisma.course.findUnique({
      where: { course_uuid: courseId },
      include: {
        group: true,
        teachers: {
          include: {
            user: true,
          },
        },
        absences: true,
      },
    });
  }

  async update(
    courseId: string,
    updateData: Prisma.CourseUpdateInput,
  ): Promise<CourseWithRelations> {
    return this.prisma.course.update({
      where: { course_uuid: courseId },
      data: updateData,
      include: {
        group: true,
        teachers: {
          include: {
            user: true,
          },
        },
        absences: true,
      },
    });
  }

  async removeAllTeachers(courseId: string): Promise<void> {
    await this.prisma.userCourse.deleteMany({
      where: { course_uuid: courseId },
    });
  }

  async addTeacherToCourse(courseId: string, userId: string): Promise<any> {
    return this.prisma.userCourse.create({
      data: {
        user_uuid: userId,
        course_uuid: courseId,
      },
    });
  }

  async delete(courseId: string): Promise<CourseWithRelations> {
    // Supprimer d'abord les relations avec les enseignants
    await this.prisma.userCourse.deleteMany({
      where: { course_uuid: courseId },
    });

    // Puis supprimer le cours
    return this.prisma.course.delete({
      where: { course_uuid: courseId },
      include: {
        group: true,
        teachers: {
          include: {
            user: true,
          },
        },
        absences: true,
      },
    });
  }
}
