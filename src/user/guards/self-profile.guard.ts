import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class SelfProfileGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const params = request.params;

    // Vérifier si l'utilisateur accède à son propre profil
    if (user && params.id && user.id === params.id) {
      return true;
    }

    // Permettre l'accès aux administrateurs
    if (user && user.role === 'ADMIN') {
      return true;
    }

    throw new ForbiddenException('Vous ne pouvez accéder qu\'à votre propre profil');
  }
} 