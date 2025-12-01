import { applyDecorators } from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'

export function ListUsersDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Listar usuários',
      description:
        'Retorna a lista de usuários do sistema. Requer autenticação. Opcionalmente aplicada paginação e filtros em versões futuras.',
    }),
    ApiResponse({
      status: 200,
      description: 'Lista de usuários retornada com sucesso.',
      schema: {
        example: {
          users: [
            {
              id: 'a1b2c3d4-e5f6-7890-abcd-1234567890ef',
              fullName: 'João Silva Santos',
              email: 'joao.silva@escola.com',
              phone: '11999999999',
              role: 'TEACHER',
              isActive: true,
              lastLogin: null,
              createdAt: '2025-01-15T12:00:00Z',
              updatedAt: null,
            },
            {
              id: 'b2c3d4e5-f6a7-8901-bcde-234567890fgh',
              fullName: 'Mariana Costa',
              email: 'mariana.costa@escola.com',
              phone: null,
              role: 'ADMIN',
              isActive: true,
              lastLogin: '2025-09-01T08:00:00Z',
              createdAt: '2024-10-01T09:00:00Z',
              updatedAt: '2025-02-03T11:00:00Z',
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
