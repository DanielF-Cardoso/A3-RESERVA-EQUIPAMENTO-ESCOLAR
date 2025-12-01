import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator'

export class CreateEquipmentDTO {
  @ApiProperty({
    description: 'O nome do equipamento.',
    example: 'Projetor Multimídia Epson',
  })
  @IsString({ message: 'Validation error' })
  @IsNotEmpty({ message: 'Validation error' })
  @MinLength(2, {
    message: 'Validation error',
  })
  name!: string

  @ApiProperty({
    description: 'O tipo do equipamento.',
    example: 'Audiovisual',
  })
  @IsString({ message: 'Validation error' })
  @IsNotEmpty({ message: 'Validation error' })
  @MinLength(2, {
    message: 'Validation error',
  })
  type!: string

  @ApiProperty({
    description: 'A quantidade disponível do equipamento.',
    example: 10,
    minimum: 0,
  })
  @IsInt({ message: 'Validation error' })
  @Min(0, { message: 'Validation error' })
  quantity!: number

  @ApiPropertyOptional({
    description: 'O status do equipamento.',
    enum: ['AVAILABLE', 'IN_USE', 'MAINTENANCE'],
    example: 'AVAILABLE',
    default: 'AVAILABLE',
  })
  @IsOptional()
  @IsEnum(['AVAILABLE', 'IN_USE', 'MAINTENANCE'], {
    message: 'Validation error',
  })
  status?: string

  @ApiPropertyOptional({
    description: 'A localização física do equipamento.',
    example: 'Sala 101',
  })
  @IsOptional()
  @IsString({ message: 'Validation error' })
  location?: string

  @ApiPropertyOptional({
    description: 'Uma descrição detalhada do equipamento.',
    example: 'Projetor de alta resolução para apresentações',
  })
  @IsOptional()
  @IsString({ message: 'Validation error' })
  description?: string
}
