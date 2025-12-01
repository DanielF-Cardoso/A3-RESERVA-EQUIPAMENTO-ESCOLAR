import { applyDecorators } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger'

export function UpdateSchedulingDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Atualizar agendamento',
      description:
        'Atualiza os dados de um agendamento existente. ' +
        'Usuários TEACHER podem atualizar apenas seus próprios agendamentos com status SCHEDULED. ' +
        'Usuários STAFF e ADMIN podem atualizar agendamentos de qualquer usuário. ' +
        'Validações: verifica disponibilidade de equipamento, impede alteração de agendamentos confirmados ou concluídos. ' +
        'Requer autenticação.',
    }),
    ApiParam({
      name: 'id',
      description: 'ID do agendamento a ser atualizado.',
      type: 'string',
      example: 'a1b2c3d4-e5f6-7890-abcd-1234567890ef',
    }),
    ApiBody({
      description: 'Dados do agendamento para atualização. Todos os campos são opcionais.',
      schema: {
        type: 'object',
        properties: {
          equipmentId: {
            type: 'string',
            description: 'ID do novo equipamento (opcional)',
            example: 'b2c3d4e5-f6g7-8901-bcde-2345678901fg',
          },
          startDate: {
            type: 'string',
            format: 'date-time',
            description: 'Nova data e hora de início (opcional)',
            example: '2025-12-10T09:00:00.000Z',
          },
          endDate: {
            type: 'string',
            format: 'date-time',
            description: 'Nova data e hora de término (opcional)',
            example: '2025-12-10T12:00:00.000Z',
          },
          quantity: {
            type: 'number',
            description: 'Nova quantidade de equipamentos (opcional)',
            example: 3,
            minimum: 1,
          },
          notes: {
            type: 'string',
            description: 'Novas observações sobre o agendamento (opcional)',
            example: 'Aula prática atualizada - Turma 2A',
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Agendamento atualizado com sucesso.',
      schema: {
        example: {
          scheduling: {
            id: 'a1b2c3d4-e5f6-7890-abcd-1234567890ef',
            equipmentId: 'b2c3d4e5-f6g7-8901-bcde-2345678901fg',
            userId: 'c3d4e5f6-g7h8-9012-cdef-3456789012gh',
            startDate: '2025-12-10T09:00:00.000Z',
            endDate: '2025-12-10T12:00:00.000Z',
            quantity: 3,
            status: 'SCHEDULED',
            notes: 'Aula prática atualizada - Turma 2A',
            createdAt: '2025-12-01T10:00:00.000Z',
            updatedAt: '2025-12-01T14:30:00.000Z',
          },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Requisição inválida. Dados fornecidos são inválidos.',
    }),
    ApiResponse({
      status: 401,
      description: 'Não autorizado. Token inválido ou ausente.',
    }),
    ApiResponse({
      status: 403,
      description: 'Acesso negado. Você não tem permissão para atualizar este agendamento.',
    }),
    ApiResponse({
      status: 404,
      description: 'Agendamento ou equipamento não encontrado.',
    }),
    ApiResponse({
      status: 409,
      description: 'Conflito. Quantidade solicitada excede a disponibilidade do equipamento no período.',
    }),
    ApiResponse({
      status: 500,
      description: 'Erro interno do servidor.',
    }),
  )
}
