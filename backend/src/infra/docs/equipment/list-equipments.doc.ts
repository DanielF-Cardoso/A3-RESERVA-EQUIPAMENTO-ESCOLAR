import { applyDecorators } from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'

export function ListEquipmentsDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Listar equipamentos',
      description:
        'Lista todos os equipamentos cadastrados no sistema. Requer autorização (usuário autenticado).',
    }),
    ApiResponse({
      status: 200,
      description: 'Lista de equipamentos retornada com sucesso.',
      schema: {
        example: {
          equipments: [
            {
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
            {
              id: 'b2c3d4e5-f6a7-8901-bcde-234567890fab',
              name: 'Notebook Dell Inspiron',
              type: 'Informática',
              quantity: 15,
              status: 'IN_USE',
              location: 'Laboratório de Informática',
              description: 'Notebooks para atividades educacionais',
              isActive: true,
              createdAt: '2025-11-26T13:00:00Z',
              updatedAt: '2025-11-26T14:00:00Z',
            },
          ],
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Não autorizado.',
    }),
  )
}
