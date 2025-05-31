import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { LearnerHistoryService } from './learner-history.service';

@ApiTags('learner-history')
@ApiBearerAuth()
@Controller('learners/:learnerId/history')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LearnerHistoryController {
  constructor(
    private readonly learnerHistoryService: LearnerHistoryService
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @Roles('admin', 'teacher')
  @ApiOperation({ summary: 'Récupérer l\'historique complet d\'un apprenant' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Historique récupéré avec succès',
  })
  @ApiParam({ name: 'learnerId', description: 'ID de l\'apprenant' })
  @ApiQuery({ name: 'skip', required: false, description: 'Nombre d\'éléments à ignorer' })
  @ApiQuery({ name: 'take', required: false, description: 'Nombre d\'éléments à récupérer (max 100)' })
  @ApiQuery({ name: 'entityType', required: false, description: 'Filtrer par type d\'entité' })
  @ApiQuery({ name: 'actionType', required: false, description: 'Filtrer par type d\'action' })
  @ApiQuery({ name: 'changeType', required: false, description: 'Filtrer par type de changement' })
  @ApiQuery({ name: 'fromDate', required: false, description: 'Date de début (ISO string)' })
  @ApiQuery({ name: 'toDate', required: false, description: 'Date de fin (ISO string)' })
  async getLearnerHistory(
    @Param('learnerId') learnerId: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('entityType') entityType?: string,
    @Query('actionType') actionType?: string,
    @Query('changeType') changeType?: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
  ) {
    const options = {
      skip: skip ? parseInt(skip, 10) : 0,
      take: Math.min(take ? parseInt(take, 10) : 50, 100),
      entityType: entityType || undefined,
      actionType: actionType || undefined,
      changeType: changeType || undefined,
      fromDate: fromDate ? new Date(fromDate) : undefined,
      toDate: toDate ? new Date(toDate) : undefined,
    };

    return this.learnerHistoryService.getLearnerHistory(learnerId, options);
  }

  @Get('progression')
  @HttpCode(HttpStatus.OK)
  @Roles('admin', 'teacher')
  @ApiOperation({ summary: 'Récupérer la progression des niveaux d\'un apprenant' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Progression récupérée avec succès',
  })
  @ApiParam({ name: 'learnerId', description: 'ID de l\'apprenant' })
  async getLevelProgression(@Param('learnerId') learnerId: string) {
    return this.learnerHistoryService.getLevelProgressHistory(learnerId);
  }

  @Get('examens')
  @HttpCode(HttpStatus.OK)
  @Roles('admin', 'teacher')
  @ApiOperation({ summary: 'Récupérer l\'historique des examens d\'un apprenant' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Historique des examens récupéré avec succès',
  })
  @ApiParam({ name: 'learnerId', description: 'ID de l\'apprenant' })
  async getExamHistory(@Param('learnerId') learnerId: string) {
    return this.learnerHistoryService.getExamHistory(learnerId);
  }

  @Get('absences')
  @HttpCode(HttpStatus.OK)
  @Roles('admin', 'teacher')
  @ApiOperation({ summary: 'Récupérer l\'historique des absences d\'un apprenant' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Historique des absences récupéré avec succès',
  })
  @ApiParam({ name: 'learnerId', description: 'ID de l\'apprenant' })
  async getAbsenceHistory(@Param('learnerId') learnerId: string) {
    return this.learnerHistoryService.getAbsenceHistory(learnerId);
  }

  @Get('groupes')
  @HttpCode(HttpStatus.OK)
  @Roles('admin', 'teacher')
  @ApiOperation({ summary: 'Récupérer l\'historique des groupes d\'un apprenant' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Historique des groupes récupéré avec succès',
  })
  @ApiParam({ name: 'learnerId', description: 'ID de l\'apprenant' })
  async getGroupHistory(@Param('learnerId') learnerId: string) {
    return this.learnerHistoryService.getGroupHistory(learnerId);
  }

  @Get('adresses')
  @HttpCode(HttpStatus.OK)
  @Roles('admin', 'teacher')
  @ApiOperation({ summary: 'Récupérer l\'historique des adresses d\'un apprenant' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Historique des adresses récupéré avec succès',
  })
  @ApiParam({ name: 'learnerId', description: 'ID de l\'apprenant' })
  async getAddressHistory(@Param('learnerId') learnerId: string) {
    return this.learnerHistoryService.getAddressHistory(learnerId);
  }

  @Get('handicaps')
  @HttpCode(HttpStatus.OK)
  @Roles('admin', 'teacher')
  @ApiOperation({ summary: 'Récupérer l\'historique des handicaps d\'un apprenant' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Historique des handicaps récupéré avec succès',
  })
  @ApiParam({ name: 'learnerId', description: 'ID de l\'apprenant' })
  async getDisabilityHistory(@Param('learnerId') learnerId: string) {
    return this.learnerHistoryService.getDisabilityHistory(learnerId);
  }

  @Get('entites/:entityType')
  @HttpCode(HttpStatus.OK)
  @Roles('admin', 'teacher')
  @ApiOperation({ summary: 'Récupérer l\'historique d\'un type d\'entité spécifique' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Historique de l\'entité récupéré avec succès',
  })
  @ApiParam({ name: 'learnerId', description: 'ID de l\'apprenant' })
  @ApiParam({ name: 'entityType', description: 'Type d\'entité (student, exam, absence, etc.)' })
  async getHistoryByEntityType(
    @Param('learnerId') learnerId: string,
    @Param('entityType') entityType: string
  ) {
    return this.learnerHistoryService.getHistoryByEntityType(learnerId, entityType);
  }

  @Get('types-entites')
  @HttpCode(HttpStatus.OK)
  @Roles('admin', 'teacher')
  @ApiOperation({ summary: 'Récupérer les types d\'entités disponibles' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Types d\'entités récupérés avec succès',
  })
  async getEntityTypes() {
    return [
      'student',
      'exam',
      'absence',
      'group_assignment',
      'address',
      'disability',
      'continuation'
    ];
  }

  @Get('types-actions')
  @HttpCode(HttpStatus.OK)
  @Roles('admin', 'teacher')
  @ApiOperation({ summary: 'Récupérer les types d\'actions disponibles' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Types d\'actions récupérés avec succès',
  })
  async getActionTypes() {
    return [
      'created',
      'updated',
      'deleted',
      'assigned',
      'unassigned'
    ];
  }

  @Get('types-changements')
  @HttpCode(HttpStatus.OK)
  @Roles('admin', 'teacher')
  @ApiOperation({ summary: 'Récupérer les types de changements disponibles' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Types de changements récupérés avec succès',
  })
  async getChangeTypes() {
    return [
      // Student changes
      'student_created',
      'student_updated',
      'student_deleted',
      'level_change',
      'status_change',
      'personal_info_update',
      'orientation_change',
      'financing_change',
      
      // Exam changes
      'exam_created',
      'exam_updated',
      'exam_deleted',
      
      // Absence changes
      'absence_created',
      'absence_updated',
      'absence_deleted',
      
      // Group changes
      'group_assigned',
      'group_unassigned',
      
      // Address changes
      'address_assigned',
      'address_unassigned',
      'address_updated',
      
      // Disability changes
      'disability_assigned',
      'disability_unassigned',
      
      // Continuation changes
      'continuation_created',
      'continuation_updated',
      'continuation_deleted'
    ];
  }

  @Get('statistiques')
  @HttpCode(HttpStatus.OK)
  @Roles('admin', 'teacher')
  @ApiOperation({ summary: 'Récupérer les statistiques d\'activité d\'un apprenant' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Statistiques récupérées avec succès',
  })
  @ApiParam({ name: 'learnerId', description: 'ID de l\'apprenant' })
  async getActivityStats(@Param('learnerId') learnerId: string) {
    return this.learnerHistoryService.getActivityStats(learnerId);
  }

  @Get('resume')
  @HttpCode(HttpStatus.OK)
  @Roles('admin', 'teacher')
  @ApiOperation({ summary: 'Récupérer un résumé de l\'historique d\'un apprenant' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Résumé récupéré avec succès',
  })
  @ApiParam({ name: 'learnerId', description: 'ID de l\'apprenant' })
  async getHistorySummary(@Param('learnerId') learnerId: string) {
    const stats = await this.learnerHistoryService.getActivityStats(learnerId);
    const progression = await this.learnerHistoryService.getLevelProgressHistory(learnerId);
    const recentExams = await this.learnerHistoryService.getExamHistory(learnerId);
    const recentAbsences = await this.learnerHistoryService.getAbsenceHistory(learnerId);

    return {
      statistics: stats,
      levelProgression: progression,
      recentExams: recentExams.slice(0, 5),
      recentAbsences: recentAbsences.slice(0, 5),
      summary: {
        totalLevelChanges: progression.length,
        totalExams: recentExams.length,
        totalAbsences: recentAbsences.length,
        lastActivity: stats.lastChange
      }
    };
  }
} 