import { 
  Controller, 
  Post, 
  Body, 
  HttpCode, 
  HttpStatus, 
  Get, 
  Ip, 
  UseGuards, 
  Request, 
  Patch, 
  Param 
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { AuthService } from './auth.service';
import { ResetPasswordRequestDto, ResetPasswordConfirmDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@ApiTags('Authentification')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService
  ) {}

  @ApiOperation({ summary: 'Récupérer tous les rôles disponibles' })
  @ApiResponse({ 
    status: 200, 
    description: 'Liste des rôles récupérée avec succès',
    schema: {
      type: 'object',
      properties: {
        roles: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              rolename: { type: 'string' }
            }
          }
        }
      }
    }
  })
  @Get('roles')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async getRoles() {
    return this.authService.getRoles();
  }

  @ApiOperation({ summary: 'Connexion utilisateur' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Utilisateur connecté avec succès',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        access_token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '1a2b3c4d-5e6f-7g8h-9i0j' },
            email: { type: 'string', example: 'utilisateur@exemple.com' },
            firstname: { type: 'string', example: 'Jean' },
            lastname: { type: 'string', example: 'Dupont' },
            role: { type: 'string', example: 'admin' }
          }
        }
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Identifiants invalides ou trop de tentatives',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Email ou mot de passe invalide' }
      }
    }
  })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto, @Ip() ip: string) {
    return this.authService.login(loginDto, ip);
  }

  @ApiOperation({ summary: 'Déconnexion de l\'utilisateur' })
  @ApiResponse({ 
    status: 200, 
    description: 'Utilisateur déconnecté avec succès',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Déconnexion réussie' }
      }
    }
  })
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async logout(@Request() req, @Ip() ip: string) {
    const token = req.headers.authorization.split(' ')[1];
    return this.authService.logout(token, req.user.id, ip);
  }

  @ApiOperation({ summary: 'Demande de réinitialisation de mot de passe' })
  @ApiBody({ type: ResetPasswordRequestDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Demande de réinitialisation traitée',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Si votre email est enregistré dans notre système, vous recevrez un lien pour réinitialiser votre mot de passe.' }
      }
    }
  })
  @Post('reset-password/request')
  @HttpCode(HttpStatus.OK)
  async requestPasswordReset(@Body() dto: ResetPasswordRequestDto, @Ip() ip: string) {
    return this.authService.requestPasswordReset(dto, ip);
  }

  @ApiOperation({ summary: 'Confirmation de réinitialisation de mot de passe' })
  @ApiBody({ type: ResetPasswordConfirmDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Mot de passe réinitialisé avec succès',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Votre mot de passe a été réinitialisé avec succès' }
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Token invalide ou expiré',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Token de réinitialisation invalide ou expiré' }
      }
    }
  })
  @Post('reset-password/confirm')
  @HttpCode(HttpStatus.OK)
  async confirmPasswordReset(@Body() dto: ResetPasswordConfirmDto, @Ip() ip: string) {
    return this.authService.confirmPasswordReset(dto, ip);
  }

  @ApiOperation({ summary: 'Changement de mot de passe pour l\'utilisateur connecté' })
  @ApiBody({ type: ChangePasswordDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Mot de passe changé avec succès',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Votre mot de passe a été changé avec succès' }
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Informations invalides',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Mot de passe actuel incorrect' }
      }
    }
  })
  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async changePassword(@Request() req, @Body() dto: ChangePasswordDto, @Ip() ip: string) {
    return this.authService.changePassword(req.user.id, dto, ip);
  }

  @ApiOperation({ summary: 'Activation/désactivation d\'un compte utilisateur (admin uniquement)' })
  @ApiParam({ name: 'userId', description: 'ID de l\'utilisateur à modifier' })
  @ApiResponse({ 
    status: 200, 
    description: 'Statut du compte modifié avec succès',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Le compte utilisateur a été activé avec succès' }
      }
    }
  })
  @Patch('users/:userId/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async setUserActiveStatus(
    @Request() req, 
    @Param('userId') userId: string, 
    @Body() body: { active: boolean },
    @Ip() ip: string
  ) {
    return this.authService.setUserActiveStatus(req.user.id, userId, body.active, ip);
  }

  @ApiOperation({ summary: 'Inscription d\'un nouvel utilisateur' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Utilisateur créé avec succès',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        access_token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '1a2b3c4d-5e6f-7g8h-9i0j' },
            email: { type: 'string', example: 'utilisateur@exemple.com' },
            firstname: { type: 'string', example: 'Jean' },
            lastname: { type: 'string', example: 'Dupont' },
            role: { type: 'string', example: 'user' }
          }
        }
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Données invalides ou utilisateur existant',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Un utilisateur avec cet email existe déjà' }
      }
    }
  })
  @ApiResponse({
    status: 403,
    description: 'Accès refusé - Route temporairement désactivée',
  })
  @Post('register')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    // Vous pouvez également retourner un message d'erreur explicite
    return {
      success: false,
      message: 'Cette fonctionnalité est temporairement désactivée. Veuillez contacter un administrateur pour créer un compte.'
    };
    // Commenté pour désactiver la fonctionnalité
    // return this.authService.register(registerDto);
  }
}
