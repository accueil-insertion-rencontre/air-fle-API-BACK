import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Escape } from 'class-sanitizer';

export class CreateFinancingDto {
  @ApiProperty({
    description: 'Type de financement',
    example: 'Pôle Emploi'
  })
  @IsString()
  @Escape()
  type: string;
} 