import { ApiProperty } from '@nestjs/swagger';

export class ContinuationStatsDto {
  @ApiProperty({
    description: 'Nombre total de continuations',
    example: 42,
  })
  total_continuations: number;

  @ApiProperty({
    description: 'Nombre de continuations avec une date définie',
    example: 30,
  })
  continuations_with_date: number;

  @ApiProperty({
    description: 'Nombre de continuations sans date définie',
    example: 12,
  })
  continuations_without_date: number;

  @ApiProperty({
    description: 'Nombre de continuations récentes (30 derniers jours)',
    example: 8,
  })
  recent_continuations: number;
} 