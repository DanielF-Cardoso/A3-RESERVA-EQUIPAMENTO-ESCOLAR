import { applyDecorators } from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger'
import { CreateSchedulingDTO } from '../../http/dto/scheduling/create-scheduling.dto'

export function CreateSchedulingDoc() {
  return applyDecorators(
    ApiTags('Schedulings'),
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Create a new scheduling',
      description:
        'Creates a new equipment scheduling. Validates equipment availability and quantity. All authenticated users can create schedulings.',
    }),
    ApiBody({
      type: CreateSchedulingDTO,
      description: 'Scheduling data',
      examples: {
        example1: {
          summary: 'Simple scheduling',
          value: {
            equipmentId: '123e4567-e89b-12d3-a456-426614174000',
            startDate: '2024-12-01T10:00:00Z',
            endDate: '2024-12-01T12:00:00Z',
            quantity: 2,
            notes: 'Need for math class',
          },
        },
      },
    }),
    ApiResponse({
      status: 201,
      description: 'Scheduling created successfully',
      schema: {
        example: {
          scheduling: {
            id: '123e4567-e89b-12d3-a456-426614174000',
            equipmentId: '123e4567-e89b-12d3-a456-426614174001',
            userId: '123e4567-e89b-12d3-a456-426614174002',
            startDate: '2024-12-01T10:00:00.000Z',
            endDate: '2024-12-01T12:00:00.000Z',
            quantity: 2,
            notes: 'Need for math class',
            status: 'SCHEDULED',
            isActive: true,
            isCompleted: false,
            isCancelled: false,
            createdAt: '2024-11-26T14:30:00.000Z',
            updatedAt: '2024-11-26T14:30:00.000Z',
          },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Invalid data or validation error',
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Invalid or missing token',
    }),
    ApiResponse({
      status: 404,
      description: 'Equipment not found',
    }),
    ApiResponse({
      status: 409,
      description: 'Insufficient equipment quantity available',
    }),
  )
}
