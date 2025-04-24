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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

@ApiTags('cours')
@ApiBearerAuth()
@Controller('courses')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Créer un nouveau cours' })
  @ApiResponse({ status: 201, description: 'Cours créé avec succès' })
  async create(@Body() createCourseData: Prisma.CourseCreateInput) {
    return this.courseService.create(createCourseData);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Récupérer tous les cours avec filtrage optionnel' })
  @ApiResponse({ status: 200, description: 'Retourne tous les cours' })
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

  @Get(':sessionId')
  @HttpCode(HttpStatus.OK)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Récupérer un cours par son ID' })
  @ApiResponse({ status: 200, description: 'Retourne le cours' })
  @ApiResponse({ status: 404, description: 'Cours introuvable' })
  async findOne(@Param('sessionId') sessionId: string) {
    return this.courseService.findOne(sessionId);
  }

  @Patch(':sessionId')
  @HttpCode(HttpStatus.OK)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Mettre à jour un cours' })
  @ApiResponse({ status: 200, description: 'Cours mis à jour avec succès' })
  @ApiResponse({ status: 404, description: 'Cours introuvable' })
  async update(@Param('sessionId') sessionId: string, @Body() updateCourseData: Prisma.CourseUpdateInput) {
    return this.courseService.update(sessionId, updateCourseData);
  }

  @Delete(':sessionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Supprimer un cours' })
  @ApiResponse({ status: 204, description: 'Cours supprimé avec succès' })
  @ApiResponse({ status: 404, description: 'Cours introuvable' })
  async remove(@Param('sessionId') sessionId: string) {
    await this.courseService.remove(sessionId);
  }
}
