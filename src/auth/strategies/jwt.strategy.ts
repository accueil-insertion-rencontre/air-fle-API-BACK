import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { Request } from 'express';
import { UserService } from '../../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
    private userService: UserService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'fallback-secret-key',
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    if (!payload.sub || !payload.email || !payload.role) {
      return null;
    }

    // Vérifier si le token est dans la liste noire (révoqué)
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    if (token && await this.authService.isTokenBlacklisted(token)) {
      throw new UnauthorizedException('Token invalide ou révoqué');
    }

    // Vérifier si l'utilisateur existe toujours dans la base de données
    const user = await this.userService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('Utilisateur non trouvé ou supprimé');
    }

    // Vérifier si le compte est actif
    if (user.isActive === false) {
      throw new UnauthorizedException('Compte désactivé');
    }

    // Vérifier si le token a été émis avant un changement de mot de passe
    if (await this.authService.isTokenIssuedBeforePasswordChange(payload.sub, payload.iat)) {
      throw new UnauthorizedException('Session expirée suite à un changement de mot de passe');
    }

    return { 
      id: payload.sub, 
      email: payload.email,
      role: payload.role,
      permissions: payload.permissions || [],
      businessInfo: payload.businessInfo || {
        frenchLevel: null,
        group: null
      }
    };
  }
} 