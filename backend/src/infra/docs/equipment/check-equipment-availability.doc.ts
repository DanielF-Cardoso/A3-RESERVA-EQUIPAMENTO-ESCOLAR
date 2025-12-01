import { applyDecorators } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger'

export function CheckEquipmentAvailabilityDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Verificar disponibilidade de equipamentos',
      description:
        'Verifica quais equipamentos estão disponíveis (total ou parcialmente) em um determinado período de tempo. ' +
        'Retorna uma lista de todos os equipamentos com informações sobre quantidade disponível, quantidade total e agendamentos conflitantes. ' +
        'Útil para evitar conflitos ao criar novos agendamentos. Requer autenticação.',
    }),
    ApiQuery({
      name: 'startDate',
      description: 'Data e hora de início do período (ISO 8601 format)',
      type: 'string',
      required: true,
      example: '2025-12-05T08:00:00.000Z',
    }),
    ApiQuery({
      name: 'endDate',
      description: 'Data e hora de fim do período (ISO 8601 format)',
      type: 'string',
      required: true,
      example: '2025-12-05T12:00:00.000Z',
    }),
    ApiResponse({
      status: 200,
      description: 'Disponibilidade de equipamentos verificada com sucesso.',
      schema: {
        example: {
          equipments: [
            {
              equipmentId: 'a1b2c3d4-e5f6-7890-abcd-1234567890ef',
              equipmentName: 'Notebook Dell Inspiron',
              equipmentType: 'NOTEBOOK',
              totalQuantity: 5,
              availableQuantity: 3,
              isAvailable: true,
              conflictingSchedulings: [
                {
                  schedulingId: 'c3d4e5f6-g7h8-9012-cdef-3456789012gh',
                  quantity: 2,
                  startDate: '2025-12-05T09:00:00.000Z',
                  endDate: '2025-12-05T11:00:00.000Z',
                  userName: 'Prof. João Oliveira',
                },
              ],
            },
            {
              equipmentId: 'b2c3d4e5-f6g7-8901-bcde-2345678901fg',
              equipmentName: 'Tablet Samsung Galaxy Tab',
              equipmentType: 'TABLET',
              totalQuantity: 8,
              availableQuantity: 8,
              isAvailable: true,
              conflictingSchedulings: [],
            },
            {
              equipmentId: 'c3d4e5f6-g7h8-9012-cdef-3456789012gh',
              equipmentName: 'Câmera Canon EOS Rebel',
              equipmentType: 'CAMERA',
              totalQuantity: 2,
              availableQuantity: 0,
              isAvailable: false,
              conflictingSchedulings: [
                {
                  schedulingId: 'd4e5f6g7-h8i9-0123-defg-4567890123hi',
                  quantity: 2,
                  startDate: '2025-12-05T09:00:00.000Z',
                  endDate: '2025-12-05T17:00:00.000Z',
                  userName: 'Profa. Ana Paula Costa',
                },
              ],
            },
          ],
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Requisição inválida. startDate e endDate são obrigatórios e devem ser datas válidas.',
    }),
    ApiResponse({
      status: 401,
      description: 'Não autorizado. Token inválido ou ausente.',
    }),
    ApiResponse({
      status: 500,
      description: 'Erro interno do servidor.',
    }),
  )
}
