import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsDateString, IsInt, IsOptional, Min } from 'class-validator'

export class CreateSchedulingDTO {
  @ApiProperty({
    description: 'ID of the equipment to schedule',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  equipmentId!: string

  @ApiProperty({
    description: 'Start date and time of the scheduling',
    example: '2024-12-01T10:00:00Z',
  })
  @IsDateString()
  startDate!: string

  @ApiProperty({
    description: 'End date and time of the scheduling',
    example: '2024-12-01T12:00:00Z',
  })
  @IsDateString()
  endDate!: string

  @ApiProperty({
    description: 'Quantity of equipment to schedule',
    example: 2,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  quantity!: number

  @ApiProperty({
    description: 'Optional notes for the scheduling',
    example: 'Need equipment for math class',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string
}
