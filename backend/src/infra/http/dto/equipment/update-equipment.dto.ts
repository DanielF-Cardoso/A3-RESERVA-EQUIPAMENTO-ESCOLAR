import { ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator'

export class UpdateEquipmentDTO {
  @ApiPropertyOptional({
    description: 'O nome do equipamento.',
    example: 'Projetor Multimídia Epson - Atualizado',
  })
  @IsOptional()
  @IsString({ message: 'Validation error' })
  @MinLength(2, {
    message: 'Validation error',
  })
  name?: string

  @ApiPropertyOptional({
    description: 'O tipo do equipamento.',
    example: 'Audiovisual',
  })
  @IsOptional()
  @IsString({ message: 'Validation error' })
  @MinLength(2, {
    message: 'Validation error',
  })
  type?: string

  @ApiPropertyOptional({
    description: 'A quantidade disponível do equipamento.',
    example: 15,
    minimum: 0,
  })
  @IsOptional()
  @IsInt({ message: 'Validation error' })
  @Min(0, { message: 'Validation error' })
  quantity?: number

  @ApiPropertyOptional({
    description: 'O status do equipamento.',
    enum: ['AVAILABLE', 'IN_USE', 'MAINTENANCE'],
    example: 'IN_USE',
  })
  @IsOptional()
  @IsEnum(['AVAILABLE', 'IN_USE', 'MAINTENANCE'], {
    message: 'Validation error',
  })
  status?: string

  @ApiPropertyOptional({
    description: 'A localização física do equipamento.',
    example: 'Sala 202',
    nullable: true,
  })
  @IsOptional()
  @IsString({ message: 'Validation error' })
  location?: string | null

  @ApiPropertyOptional({
    description: 'Uma descrição detalhada do equipamento.',
    example: 'Projetor de alta resolução para apresentações educacionais',
    nullable: true,
  })
  @IsOptional()
  @IsString({ message: 'Validation error' })
  description?: string | null
}
