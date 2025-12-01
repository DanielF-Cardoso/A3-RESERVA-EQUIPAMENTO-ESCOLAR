import { applyDecorators } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger'

export function MarkEquipmentAsAvailableDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Marcar equipamento como disponível',
      description:
        'Marca um equipamento como disponível para uso. Altera o status de MAINTENANCE para AVAILABLE. Requer autorização de ADMIN.',
    }),
    ApiParam({
      name: 'id',
      description: 'ID do equipamento a ser marcado como disponível.',
      type: 'string',
      example: 'a1b2c3d4-e5f6-7890-abcd-1234567890ef',
    }),
    ApiResponse({
      status: 200,
      description: 'Equipamento marcado como disponível com sucesso.',
      schema: {
        example: {
          equipment: {
            id: 'a1b2c3d4-e5f6-7890-abcd-1234567890ef',
            name: 'Projetor Epson PowerLite',
            type: 'PROJECTOR',
            quantity: 3,
            status: 'AVAILABLE',
            location: null,
            description: 'Projetor Full HD para apresentações - 3000 lumens, HDMI',
            isActive: true,
            createdAt: '2025-11-26T12:00:00.000Z',
            updatedAt: '2025-12-01T15:45:00.000Z',
          },
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Não autorizado. Token inválido ou ausente.',
    }),
    ApiResponse({
      status: 403,
      description: 'Acesso negado. Apenas usuários ADMIN podem marcar equipamentos como disponíveis.',
    }),
    ApiResponse({
      status: 404,
      description: 'Equipamento não encontrado.',
    }),
    ApiResponse({
      status: 500,
      description: 'Erro interno do servidor.',
    }),
  )
}
