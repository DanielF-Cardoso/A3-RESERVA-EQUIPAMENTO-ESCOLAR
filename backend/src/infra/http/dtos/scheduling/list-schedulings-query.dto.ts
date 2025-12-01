import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsDateString, IsString } from 'class-validator'

export class ListSchedulingsQueryDTO {
  @ApiPropertyOptional({
    description: 'Filter by date',
    example: '2024-12-01',
  })
  @IsOptional()
  @IsDateString()
  date?: string

  @ApiPropertyOptional({
    description: 'Filter by user ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsString()
  userId?: string

  @ApiPropertyOptional({
    description: 'Filter by equipment ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsString()
  equipmentId?: string
}
