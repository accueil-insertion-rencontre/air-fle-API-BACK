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
import { SessionService } from './session.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Prisma } from '@prisma/client';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

// Pour éviter l'erreur d'import de UserRole
enum UserRole {
  ADMIN = 'ADMIN',
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT'
}

@ApiTags('sessions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('sessions')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new session' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Session successfully created' })
  create(@Body() createSessionDto: Prisma.SessionCreateInput) {
    return this.sessionService.create(createSessionDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Find all sessions with optional filtering' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return all sessions' })
  findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('date') date?: string,
    @Query('groupId') groupId?: string,
    @Query('periodId') periodId?: string,
  ) {
    const where: Prisma.SessionWhereInput = {};
    
    if (date) {
      const searchDate = new Date(date);
      // Utilisons le bon champ selon le schema
      where.startedAt = {
        gte: searchDate,
        lt: new Date(searchDate.getTime() + 24 * 60 * 60 * 1000), // Next day
      };
    }
    
    if (groupId) {
      // Relation correcte selon le schéma Prisma
      where.groups = {
        some: {
          id: groupId
        }
      };
    }
    
    if (periodId) {
      // Puisque Session n'est pas directement lié à Period dans le schéma,
      // on peut filtrer sur les sessions qui ont des groupes associés à la période
      where.groups = {
        some: {
          periods: {
            some: {
              period_id: periodId
            }
          }
        }
      };
    }

    return this.sessionService.findAll({
      skip: skip ? parseInt(skip) : undefined,
      take: take ? parseInt(take) : undefined,
      where,
      orderBy: { startedAt: 'desc' },
    });
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Find a session by id' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return the session' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Session not found' })
  findOne(@Param('id') id: string) {
    return this.sessionService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a session' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Session successfully updated' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Session not found' })
  update(
    @Param('id') id: string,
    @Body() updateSessionDto: Prisma.SessionUpdateInput,
  ) {
    return this.sessionService.update(id, updateSessionDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a session' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Session successfully deleted' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Session not found' })
  remove(@Param('id') id: string) {
    return this.sessionService.remove(id);
  }
}
