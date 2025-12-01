import { applyDecorators } from '@nestjs/common'
import { ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger'
import { CreateEquipmentDTO } from '@/infra/http/dto/equipment/create-equipment.dto'

export function CreateEquipmentDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Criar equipamento',
      description:
        'Cria um novo equipamento no sistema. Requer autorização (usuário autenticado com permissão adequada).',
    }),
    ApiBody({
      description: 'Dados para criação de equipamento.',
      type: CreateEquipmentDTO,
    }),
    ApiResponse({
      status: 201,
      description: 'Equipamento criado com sucesso.',
      schema: {
        example: {
          equipment: {
            id: 'a1b2c3d4-e5f6-7890-abcd-1234567890ef',
            name: 'Projetor Multimídia Epson',
            type: 'Audiovisual',
            quantity: 10,
            status: 'AVAILABLE',
            location: 'Sala 101',
            description: 'Projetor de alta resolução para apresentações',
            isActive: true,
            createdAt: '2025-11-26T12:00:00Z',
            updatedAt: null,
          },
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Não autorizado.',
    }),
    ApiResponse({
      status: 400,
      description: 'Dados inválidos.',
    }),
  )
}
