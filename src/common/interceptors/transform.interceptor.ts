import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../dto/api-response.dto';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const response = context.switchToHttp().getResponse();
    
    return next.handle().pipe(
      map((data) => {
        const statusCode = response.statusCode;
        const message = this.getDefaultMessageForStatusCode(statusCode);
        
        return ApiResponse.success(data, message, statusCode);
      }),
    );
  }

  private getDefaultMessageForStatusCode(statusCode: number): string {
    switch (statusCode) {
      case 200:
        return 'Opération réussie';
      case 201:
        return 'Ressource créée avec succès';
      case 204:
        return 'Opération réussie sans contenu';
      default:
        return 'Opération réussie';
    }
  }
} 