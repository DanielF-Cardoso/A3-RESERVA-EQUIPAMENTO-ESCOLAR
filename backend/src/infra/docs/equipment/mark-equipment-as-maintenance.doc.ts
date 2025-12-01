import { applyDecorators } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger'

export function MarkEquipmentAsMaintenanceDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Marcar equipamento como em manutenção',
      description:
        'Marca um equipamento como em manutenção. Requer autorização (usuário autenticado com permissão adequada).',
    }),
    ApiParam({
      name: 'id',
      description: 'ID do equipamento a ser marcado como em manutenção.',
      type: 'string',
      example: 'a1b2c3d4-e5f6-7890-abcd-1234567890ef',
    }),
    ApiResponse({
      status: 200,
      description: 'Equipamento marcado como em manutenção com sucesso.',
      schema: {
        example: {
          equipment: {
            id: 'a1b2c3d4-e5f6-7890-abcd-1234567890ef',
            name: 'Projetor Multimídia Epson',
            type: 'Audiovisual',
            quantity: 10,
            status: 'MAINTENANCE',
            location: 'Sala 101',
            description: 'Projetor de alta resolução para apresentações',
            isActive: true,
            createdAt: '2025-11-26T12:00:00Z',
            updatedAt: '2025-11-26T15:45:00Z',
          },
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Não autorizado.',
    }),
    ApiResponse({
      status: 404,
      description: 'Equipamento não encontrado.',
    }),
  )
}
