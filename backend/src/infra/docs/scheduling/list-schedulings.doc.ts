import { applyDecorators } from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger'

export function ListSchedulingsDoc() {
  return applyDecorators(
    ApiTags('Schedulings'),
    ApiBearerAuth(),
    ApiOperation({
      summary: 'List schedulings',
      description:
        'Lists schedulings with optional filters by date, user, or equipment. Returns all schedulings if no filters are provided.',
    }),
    ApiQuery({
      name: 'date',
      required: false,
      type: String,
      description: 'Filter schedulings by date (ISO format)',
      example: '2024-12-01',
    }),
    ApiQuery({
      name: 'userId',
      required: false,
      type: String,
      description: 'Filter schedulings by user ID',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiQuery({
      name: 'equipmentId',
      required: false,
      type: String,
      description: 'Filter schedulings by equipment ID',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiResponse({
      status: 200,
      description: 'Schedulings retrieved successfully',
      schema: {
        example: {
          schedulings: [
            {
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
          ],
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Invalid or missing token',
    }),
  )
}
