import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpStatus,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { SessionService } from './session.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Session } from '@prisma/client';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';

// Pour éviter l'erreur d'import de UserRole
type UserRole = 'admin' | 'teacher';
const UserRole: Record<string, UserRole> = {
  ADMIN: 'admin',
  TEACHER: 'teacher',
};

@ApiTags('sessions')
@ApiBearerAuth()
@Controller('sessions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles('admin', 'teacher')
  @ApiOperation({ summary: 'Créer une nouvelle session' })
  @ApiResponse({ status: 201, description: 'Session créée avec succès' })
  async create(@Body() createSessionDto: CreateSessionDto) {
    return this.sessionService.create(createSessionDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Récupérer toutes les sessions' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Liste des sessions récupérée avec succès' })
  @ApiQuery({ name: 'skip', required: false, description: 'Nombre d\'éléments à sauter' })
  @ApiQuery({ name: 'take', required: false, description: 'Nombre d\'éléments à prendre' })
  @ApiQuery({ name: 'date', required: false, description: 'Filtrer par date' })
  @ApiQuery({ name: 'groupId', required: false, description: 'Filtrer par groupe' })
  @ApiQuery({ name: 'periodId', required: false, description: 'Filtrer par période' })
  findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('date') date?: string,
    @Query('groupId') groupId?: string,
    @Query('periodId') periodId?: string,
  ) {
    const where: any = {};
    
    if (date) {
      const searchDate = new Date(date);
      where.startedAt = {
        gte: searchDate,
        lt: new Date(searchDate.getTime() + 24 * 60 * 60 * 1000), // Next day
      };
    }
    
    if (groupId) {
      where.groups = {
        some: {
          id: groupId
        }
      };
    }
    
    if (periodId) {
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
  @ApiOperation({ summary: 'Récupérer une session par ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Session récupérée avec succès' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Session non trouvée' })
  @ApiParam({ name: 'id', description: 'ID de la session' })
  findOne(@Param('id') id: string) {
    return this.sessionService.findOne(id);
  }

  @Patch(':id')
  @Roles('admin', 'teacher')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mettre à jour une session' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Session mise à jour avec succès' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Session non trouvée' })
  @ApiParam({ name: 'id', description: 'ID de la session' })
  update(
    @Param('id') id: string,
    @Body() updateSessionDto: UpdateSessionDto,
  ) {
    return this.sessionService.update(id, updateSessionDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Roles('admin')
  @ApiOperation({ summary: 'Supprimer une session' })
  @ApiResponse({ status: 200, description: 'Session supprimée avec succès' })
  @ApiResponse({ status: 404, description: 'Session non trouvée' })
  @ApiParam({ name: 'id', description: 'ID de la session' })
  async remove(@Param('id') id: string) {
    return this.sessionService.remove(id);
  }
}
