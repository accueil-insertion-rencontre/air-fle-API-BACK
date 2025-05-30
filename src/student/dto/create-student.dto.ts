import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsUUID,
  IsOptional,
  IsISO8601,
  MaxLength,
  Matches,
  IsDateString,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Escape } from 'class-sanitizer';

export class CreateStudentDto {
  @ApiProperty({ 
    description: 'Prénom de l\'étudiant', 
    example: 'Jean' 
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @Escape()
  firstname: string;

  @ApiProperty({ 
    description: 'Nom de l\'étudiant', 
    example: 'Dupont' 
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @Escape()
  lastname: string;

  @ApiProperty({ 
    description: 'Date de naissance (format ISO)', 
    example: '1990-01-01T00:00:00.000Z' 
  })
  @IsDateString()
  birthdate: string | Date;

  @ApiProperty({ 
    description: 'Lieu de naissance', 
    example: 'Paris', 
    required: false 
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  @Escape()
  @Matches(/^[a-zA-Z0-9\s\-',.àáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆŠŽ]+$/, {
    message: 'Le lieu de naissance ne doit contenir que des caractères alphanumériques et des caractères spéciaux autorisés'
  })
  placeOfBirth?: string;

  @ApiProperty({ 
    description: 'Email de l\'étudiant', 
    example: 'jean.dupont@example.com', 
    required: false 
  })
  @IsEmail()
  @IsOptional()
  @MaxLength(255)
  email?: string;

  @ApiProperty({ 
    description: 'Numéro de téléphone', 
    example: '+33123456789', 
    required: false 
  })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  @Matches(/^[+\s\d-]+$/, { message: 'Le numéro de téléphone n\'est pas valide' })
  phone?: string;

  @ApiProperty({ 
    description: 'Date du test initial', 
    example: '2023-01-01', 
    required: false 
  })
  @IsString()
  @IsOptional()
  @MaxLength(10)
  date_test_initial?: string;

  @ApiProperty({ 
    description: 'Commentaire', 
    example: 'Très motivé', 
    required: false 
  })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  @Escape()
  @Matches(/^[a-zA-Z0-9\s\-',.;:!?àáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆŠŽ]*$/, {
    message: 'Le commentaire ne doit contenir que des caractères alphanumériques et des caractères spéciaux autorisés'
  })
  commentaire?: string;

  @ApiProperty({ 
    description: 'Date d\'entrée en France', 
    example: '2022-01-15',
    required: false,
    type: Date
  })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  date_entree_france?: Date;

  @ApiProperty({
    description: 'Date du titre de séjour',
    example: '2022-03-20',
    required: false,
    type: Date
  })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  date_titre_sejour?: Date;

  @ApiProperty({
    description: 'Date du Contrat d\'Intégration Républicaine (CIR)',
    example: '2022-02-10',
    required: false,
    type: Date
  })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  date_cir?: Date;

  @ApiProperty({ 
    description: 'ID du genre', 
    example: 'c35fe727-d68e-4b1e-afe1-c5618ccf2cce' 
  })
  @IsUUID(4)
  @IsNotEmpty()
  gender_id: string;

  @ApiProperty({ 
    description: 'ID du niveau initial (à l\'arrivée)', 
    example: 'f54480bd-4893-41d6-831d-f6eb81dffce6' 
  })
  @IsUUID(4)
  @IsNotEmpty()
  initial_level_id: string;

  @ApiProperty({ 
    description: 'ID de la nationalité', 
    example: 'b1ab0950-a5fc-445a-851f-8060124d31c2' 
  })
  @IsUUID(4)
  @IsNotEmpty()
  nationality_id: string;

  @ApiProperty({ 
    description: 'ID du financement', 
    example: '471f401a-c78f-46de-8608-161f17912df0' 
  })
  @IsUUID(4)
  @IsNotEmpty()
  financing_id: string;

  @ApiProperty({ 
    description: 'ID du statut', 
    example: 'da2fa9b7-388e-4873-a542-1a22f95a27af' 
  })
  @IsUUID(4)
  @IsNotEmpty()
  status_id: string;

  @ApiProperty({ 
    description: 'ID du niveau actuel', 
    example: 'f54480bd-4893-41d6-831d-f6eb81dffce6', 
    required: false 
  })
  @IsUUID(4)
  @IsOptional()
  current_level_id?: string;

  @ApiProperty({ 
    description: 'ID du niveau de sortie (quand il quitte après formation)', 
    example: 'f54480bd-4893-41d6-831d-f6eb81dffce6', 
    required: false 
  })
  @IsUUID(4)
  @IsOptional()
  departure_level_id?: string;

  @ApiProperty({ 
    description: 'ID de l\'orientation', 
    example: '471f401a-c78f-46de-8608-161f17912df0', 
    required: false 
  })
  @IsUUID(4)
  @IsOptional()
  orientation_id?: string;

  @ApiProperty({ 
    description: 'ID de la raison de sortie', 
    example: 'da2fa9b7-388e-4873-a542-1a22f95a27af', 
    required: false 
  })
  @IsUUID(4)
  @IsOptional()
  exit_reason_id?: string;
} 