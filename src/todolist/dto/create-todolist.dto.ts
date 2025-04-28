import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsUUID, IsDateString, IsDecimal, MaxLength } from 'class-validator';
import { Escape } from 'class-sanitizer';

export class CreateTodolistDto {
  @ApiProperty({
    description: 'Titre de la tâche',
    example: 'Préparation du cours A1'
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @Escape()
  title: string;

  @ApiProperty({
    description: 'Description de la tâche',
    example: 'Préparer le support de cours pour le niveau A1',
    required: false
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  @Escape()
  description?: string;

  @ApiProperty({
    description: 'Pourcentage de complétion',
    example: '0',
    default: '0',
    required: false
  })
  @IsDecimal()
  @IsOptional()
  completionPercentage?: string;

  @ApiProperty({
    description: 'Date d\'échéance',
    example: '2023-12-31T00:00:00.000Z',
    required: false
  })
  @IsDateString()
  @IsOptional()
  dueAt?: string | Date;

  @ApiProperty({
    description: 'ID de l\'utilisateur',
    example: 'e87b56a8-1234-5678-9abc-def012345678'
  })
  @IsUUID(4)
  @IsNotEmpty()
  user_id: string;
} 