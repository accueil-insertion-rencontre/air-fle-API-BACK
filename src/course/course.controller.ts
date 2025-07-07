import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { Prisma, Course } from '@prisma/client';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@ApiTags('courses')
@ApiBearerAuth()
@Controller('courses')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles('admin', 'teacher')
  @ApiOperation({ summary: 'Créer un nouveau cours' })
  @ApiResponse({
    status: 201,
    description: 'Cours créé avec succès',
  })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @ApiBody({ type: CreateCourseDto })
  async create(@Body() createCourseDto: CreateCourseDto) {
    const courseData: Prisma.CourseCreateInput = {
      course_name: createCourseDto.course_name,
      course_start_hour: createCourseDto.course_start_hour,
      course_end_hour: createCourseDto.course_end_hour,
      course_day: createCourseDto.course_day,
      group: {
        connect: {
          group_uuid: createCourseDto.group_uuid,
        },
      },
    };

    return this.courseService.create(courseData);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @Roles('admin', 'teacher')
  @ApiOperation({ summary: 'Récupérer tous les cours avec filtrage optionnel' })
  @ApiResponse({
    status: 200,
    description: 'Retourne tous les cours',
  })
  @ApiQuery({
    name: 'skip',
    required: false,
    description: "Nombre d'éléments à sauter",
  })
  @ApiQuery({
    name: 'take',
    required: false,
    description: "Nombre d'éléments à récupérer",
  })
  @ApiQuery({
    name: 'orderBy',
    required: false,
    description: 'Critères de tri (ex: {"course_day":"desc"})',
  })
  @ApiQuery({
    name: 'course_name',
    required: false,
    description: 'Filtrer par nom (recherche insensible à la casse)',
  })
  @ApiQuery({
    name: 'group_uuid',
    required: false,
    description: 'Filtrer par UUID de groupe',
  })
  @ApiQuery({
    name: 'course_day',
    required: false,
    description: 'Filtrer par date',
  })
  @ApiQuery({
    name: 'expand',
    required: false,
    description:
      'Champs à étendre (ex: "group.session", "teachers", "group.session,teachers")',
    example: 'group.session',
  })
  async findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('orderBy') orderBy?: string,
    @Query('course_name') course_name?: string,
    @Query('group_uuid') group_uuid?: string,
    @Query('course_day') course_day?: string,
    @Query('expand') expand?: string,
  ) {
    const where: Prisma.CourseWhereInput = {};

    if (course_name) {
      where.course_name = { contains: course_name, mode: 'insensitive' };
    }

    if (group_uuid) {
      where.group_uuid = group_uuid;
    }

    if (course_day) {
      where.course_day = {
        equals: new Date(course_day),
      };
    }

    const params = {
      skip: skip ? parseInt(skip) : undefined,
      take: take ? parseInt(take) : undefined,
      where,
      orderBy: orderBy ? JSON.parse(orderBy) : { course_day: 'desc' as const },
    };

    // ✅ Gestion intelligente de l'expansion
    if (expand?.includes('group.session')) {
      return this.courseService.findAllWithSession(params);
    }

    return this.courseService.findAll(params);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @Roles('admin', 'teacher')
  @ApiOperation({ summary: 'Récupérer un cours par ID' })
  @ApiResponse({
    status: 200,
    description: 'Retourne le cours',
  })
  @ApiResponse({ status: 404, description: 'Cours introuvable' })
  @ApiParam({ name: 'id', description: 'UUID du cours', example: 'abc123' })
  async findOne(@Param('id') id: string) {
    return this.courseService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @Roles('admin', 'teacher')
  @ApiOperation({ summary: 'Mettre à jour un cours' })
  @ApiResponse({
    status: 200,
    description: 'Cours mis à jour avec succès',
  })
  @ApiResponse({ status: 404, description: 'Cours introuvable' })
  @ApiParam({ name: 'id', description: 'UUID du cours', example: 'abc123' })
  @ApiBody({ type: UpdateCourseDto })
  async update(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    return this.courseService.update(id, updateCourseDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles('admin')
  @ApiOperation({ summary: 'Supprimer un cours' })
  @ApiResponse({ status: 204, description: 'Cours supprimé avec succès' })
  @ApiResponse({ status: 404, description: 'Cours introuvable' })
  @ApiParam({ name: 'id', description: 'UUID du cours', example: 'abc123' })
  async remove(@Param('id') id: string) {
    return this.courseService.delete(id);
  }

  @Post(':id/teachers/:teacher_uuid')
  @Roles('admin', 'teacher')
  @ApiOperation({ summary: 'Assigner un enseignant au cours' })
  @ApiResponse({ status: 200, description: 'Enseignant assigné avec succès' })
  @ApiParam({ name: 'id', description: 'UUID du cours', example: 'abc123' })
  @ApiParam({
    name: 'teacher_uuid',
    description: "UUID de l'enseignant",
    example: 'def456',
  })
  async addTeacher(
    @Param('id') courseId: string,
    @Param('teacher_uuid') teacher_uuid: string,
  ) {
    return this.courseService.addTeacher(courseId, teacher_uuid);
  }

  @Delete(':id/teachers')
  @Roles('admin')
  @ApiOperation({ summary: 'Désassigner tous les enseignants du cours' })
  @ApiResponse({
    status: 200,
    description: 'Enseignants désassignés avec succès',
  })
  @ApiParam({ name: 'id', description: 'UUID du cours', example: 'abc123' })
  async removeAllTeachers(@Param('id') courseId: string) {
    return this.courseService.removeAllTeachers(courseId);
  }
}
