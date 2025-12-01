import { applyDecorators } from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger'

export function ConfirmSchedulingDoc() {
  return applyDecorators(
    ApiTags('Schedulings'),
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Confirm a scheduling',
      description:
        'Confirms a scheduling. Only STAFF and ADMIN roles can confirm schedulings. The scheduling must be in SCHEDULED status.',
    }),
    ApiParam({
      name: 'id',
      type: String,
      description: 'Scheduling ID',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiResponse({
      status: 200,
      description: 'Scheduling confirmed successfully',
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
            status: 'CONFIRMED',
            isActive: true,
            isCompleted: false,
            isCancelled: false,
            createdAt: '2024-11-26T14:30:00.000Z',
            updatedAt: '2024-11-26T14:35:00.000Z',
          },
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Invalid or missing token',
    }),
    ApiResponse({
      status: 403,
      description: 'Forbidden - Only STAFF and ADMIN can confirm schedulings',
    }),
    ApiResponse({
      status: 404,
      description: 'Scheduling not found',
    }),
    ApiResponse({
      status: 409,
      description: 'Scheduling cannot be confirmed (invalid status)',
    }),
  )
}
