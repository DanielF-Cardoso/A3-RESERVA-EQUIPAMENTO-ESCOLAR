import { applyDecorators } from '@nestjs/common'
import { ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger'
import { CreateUserDTO } from '@/infra/http/dto/user/create-user.dto'

export function CreateUserDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Criar usuário',
      description:
        'Cria um novo usuário no sistema. Requer autorização (usuário autenticado com permissão adequada).',
    }),
    ApiBody({
      description: 'Dados para criação de usuário.',
      type: CreateUserDTO,
    }),
    ApiResponse({
      status: 201,
      description: 'Usuário criado com sucesso.',
      schema: {
        example: {
          user: {
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
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Não autorizado.',
    }),
    ApiResponse({
      status: 409,
      description: 'Email ou telefone já cadastrado.',
    }),
  )
}
