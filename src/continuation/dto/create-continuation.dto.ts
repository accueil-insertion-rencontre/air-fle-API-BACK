import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateContinuationDto {
  @ApiProperty({
    description: 'Temporalité de la continuation',
    example: 'Semestre 1',
    required: false,
  })
  @IsOptional()
  @IsString()
  temporality?: string;

  @ApiProperty({
    description: 'Commentaire sur la continuation',
    example: 'Continuation approuvée pour l\'année scolaire',
    required: false,
  })
  @IsOptional()
  @IsString()
  commentary?: string;

  @ApiProperty({
    description: 'ID de l\'étudiant associé à la continuation',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsUUID()
  studentId: string;
} 