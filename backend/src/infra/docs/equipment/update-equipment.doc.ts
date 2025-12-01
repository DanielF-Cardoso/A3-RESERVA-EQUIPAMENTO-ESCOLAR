import { applyDecorators } from '@nestjs/common'
import { ApiOperation, ApiBody, ApiResponse, ApiParam } from '@nestjs/swagger'
import { UpdateEquipmentDTO } from '@/infra/http/dto/equipment/update-equipment.dto'

export function UpdateEquipmentDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Atualizar equipamento',
      description:
        'Atualiza os dados de um equipamento existente. Requer autorização (usuário autenticado com permissão adequada).',
    }),
    ApiParam({
      name: 'id',
      description: 'ID do equipamento a ser atualizado.',
      type: 'string',
      example: 'a1b2c3d4-e5f6-7890-abcd-1234567890ef',
    }),
    ApiBody({
      description: 'Dados para atualização do equipamento.',
      type: UpdateEquipmentDTO,
    }),
    ApiResponse({
      status: 200,
      description: 'Equipamento atualizado com sucesso.',
      schema: {
        example: {
          equipment: {
            id: 'a1b2c3d4-e5f6-7890-abcd-1234567890ef',
            name: 'Projetor Multimídia Epson - Atualizado',
            type: 'Audiovisual',
            quantity: 15,
            status: 'IN_USE',
            location: 'Sala 202',
            description: 'Projetor de alta resolução para apresentações educacionais',
            isActive: true,
            createdAt: '2025-11-26T12:00:00Z',
            updatedAt: '2025-11-26T15:30:00Z',
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
    ApiResponse({
      status: 400,
      description: 'Dados inválidos.',
    }),
  )
}
