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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiProperty, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import { Prisma, Course } from '@prisma/client';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

// DTO pour la documentation Swagger uniquement
class CourseDto {
  @ApiProperty({ description: 'Identifiant unique du cours', example: 'abc123' })
  course_id: string;

  @ApiProperty({ description: 'Jour du cours', example: '2025-05-15T09:00:00.000Z', type: Date })
  day: Date;

  @ApiProperty({ description: 'Heure de début', example: '2025-05-15T09:00:00.000Z', type: Date })
  start_hour: Date;

  @ApiProperty({ description: 'Heure de fin', example: '2025-05-15T11:00:00.000Z', type: Date })
  end_hour: Date;

  @ApiProperty({ description: 'Intitulé du cours', example: 'Français - Niveau A1' })
  intitule: string;

  @ApiProperty({ description: 'Identifiant du groupe auquel appartient ce cours', example: 'def456' })
  group_id: string;
}

@ApiTags('cours')
@ApiBearerAuth()
@Controller('courses')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles('admin')
  @ApiOperation({ summary: 'Créer un nouveau cours' })
  @ApiResponse({ status: 201, description: 'Cours créé avec succès', type: CourseDto })
  @ApiBody({ type: CreateCourseDto })
  async create(@Body() createCourseDto: CreateCourseDto) {
    // Convertir le DTO en format Prisma
    const prismaData: Prisma.CourseCreateInput = {
      day: createCourseDto.day,
      start_hour: createCourseDto.start_hour,
      end_hour: createCourseDto.end_hour,
      intitule: createCourseDto.intitule,
      group: {
        connect: {
          id: createCourseDto.group_id
        }
      }
    };
    
    return this.courseService.create(prismaData);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @Roles('admin')
  @ApiOperation({ summary: 'Récupérer tous les cours avec filtrage optionnel' })
  @ApiResponse({ status: 200, description: 'Retourne tous les cours', type: [CourseDto] })
  @ApiQuery({ name: 'skip', required: false, description: 'Nombre d\'éléments à sauter' })
  @ApiQuery({ name: 'take', required: false, description: 'Nombre d\'éléments à récupérer' })
  @ApiQuery({ name: 'orderBy', required: false, description: 'Critères de tri (ex: {"day":"desc"})' })
  @ApiQuery({ name: 'intitule', required: false, description: 'Filtrer par intitulé (recherche insensible à la casse)' })
  @ApiQuery({ name: 'groupId', required: false, description: 'Filtrer par identifiant de groupe' })
  @ApiQuery({ name: 'day', required: false, description: 'Filtrer par jour (format ISO)' })
  async findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('orderBy') orderBy?: string,
    @Query('intitule') intitule?: string,
    @Query('groupId') groupId?: string,
    @Query('day') day?: string,
  ) {
    const where: Prisma.CourseWhereInput = {};

    if (intitule) {
      where.intitule = { contains: intitule, mode: 'insensitive' };
    }

    if (groupId) {
      where.group_id = groupId;
    }

    if (day) {
      const searchDate = new Date(day);
      where.day = {
        gte: new Date(searchDate.setHours(0, 0, 0, 0)),
        lt: new Date(searchDate.setHours(23, 59, 59, 999)),
      };
    }

    return this.courseService.findAll({
      skip: skip ? parseInt(skip) : undefined,
      take: take ? parseInt(take) : undefined,
      where,
      orderBy: orderBy
        ? JSON.parse(orderBy)
        : { day: 'desc' as const },
    });
  }

  @Get(':courseId')
  @HttpCode(HttpStatus.OK)
  @Roles('admin')
  @ApiOperation({ summary: 'Récupérer un cours par son ID' })
  @ApiResponse({ status: 200, description: 'Retourne le cours', type: CourseDto })
  @ApiResponse({ status: 404, description: 'Cours introuvable' })
  @ApiParam({ name: 'courseId', description: 'Identifiant du cours', example: 'abc123' })
  async findOne(@Param('courseId') courseId: string) {
    return this.courseService.findOne(courseId);
  }

  @Patch(':courseId')
  @HttpCode(HttpStatus.OK)
  @Roles('admin')
  @ApiOperation({ summary: 'Mettre à jour un cours' })
  @ApiResponse({ status: 200, description: 'Cours mis à jour avec succès', type: CourseDto })
  @ApiResponse({ status: 404, description: 'Cours introuvable' })
  @ApiParam({ name: 'courseId', description: 'Identifiant du cours', example: 'abc123' })
  @ApiBody({ type: UpdateCourseDto })
  async update(@Param('courseId') courseId: string, @Body() updateCourseDto: UpdateCourseDto) {
    // Convertir le DTO en format Prisma
    const prismaData: Prisma.CourseUpdateInput = {};
    
    // Copier les propriétés valides
    if (updateCourseDto.day !== undefined) prismaData.day = updateCourseDto.day;
    if (updateCourseDto.start_hour !== undefined) prismaData.start_hour = updateCourseDto.start_hour;
    if (updateCourseDto.end_hour !== undefined) prismaData.end_hour = updateCourseDto.end_hour;
    if (updateCourseDto.intitule !== undefined) prismaData.intitule = updateCourseDto.intitule;
    
    // Gérer la relation avec le groupe si présente
    if (updateCourseDto.group_id) {
      prismaData.group = {
        connect: {
          id: updateCourseDto.group_id
        }
      };
    }
    
    return this.courseService.update(courseId, prismaData);
  }

  @Delete(':courseId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles('admin')
  @ApiOperation({ summary: 'Supprimer un cours' })
  @ApiResponse({ status: 204, description: 'Cours supprimé avec succès' })
  @ApiResponse({ status: 404, description: 'Cours introuvable' })
  @ApiParam({ name: 'courseId', description: 'Identifiant du cours', example: 'abc123' })
  async remove(@Param('courseId') courseId: string) {
    await this.courseService.remove(courseId);
  }
}
