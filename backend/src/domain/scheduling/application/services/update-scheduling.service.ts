import { Inject, Injectable, LoggerService } from '@nestjs/common'
import { Either, left, right } from '@/core/errors/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'
import { Scheduling } from '../../enterprise/entities/scheduling.entity'
import { SchedulingRepository } from '../repositories/scheduling-repository'
import { LOGGER_SERVICE } from '@/infra/logger/logger.module'
import { EquipmentRepository } from '@/domain/equipment/application/repositories/equipment-repository'
import { InsufficientQuantityError } from './errors/insufficient-quantity.error'
import { UnauthorizedError } from '@/core/errors/unauthorized.error'

interface UpdateSchedulingRequest {
  schedulingId: string
  userId: string
  userRole: string
  equipmentId?: string
  startDate?: Date
  endDate?: Date
  quantity?: number
  notes?: string
}

type UpdateSchedulingResponse = Either<
  ResourceNotFoundError | InsufficientQuantityError | UnauthorizedError,
  { scheduling: Scheduling }
>

@Injectable()
export class UpdateSchedulingService {
  constructor(
    private schedulingRepository: SchedulingRepository,
    private equipmentRepository: EquipmentRepository,
    @Inject(LOGGER_SERVICE)
    private readonly logger: LoggerService,
  ) {}

  async execute({
    schedulingId,
    userId,
    userRole,
    equipmentId,
    startDate,
    endDate,
    quantity,
    notes,
  }: UpdateSchedulingRequest): Promise<UpdateSchedulingResponse> {
    this.logger.log(
      `Attempting to update scheduling: ${schedulingId} by user: ${userId}`,
      'UpdateSchedulingService',
    )

    const scheduling = await this.schedulingRepository.findById(schedulingId)

    if (!scheduling) {
      this.logger.warn(
        `Scheduling not found: ${schedulingId}`,
        'UpdateSchedulingService',
      )
      return left(new ResourceNotFoundError('Agendamento não encontrado.'))
    }

    // Apenas o dono do agendamento ou STAFF/ADMIN podem editar
    const isOwner = scheduling.userId.toString() === userId
    const isStaffOrAdmin = userRole === 'STAFF' || userRole === 'ADMIN'

    if (!isOwner && !isStaffOrAdmin) {
      this.logger.warn(
        `User ${userId} not authorized to update scheduling ${schedulingId}`,
        'UpdateSchedulingService',
      )
      return left(
        new UnauthorizedError(
          'Você não tem permissão para editar este agendamento.',
        ),
      )
    }

    // Não permite editar agendamentos concluídos ou cancelados
    if (scheduling.isCompleted || scheduling.isCancelled) {
      this.logger.warn(
        `Cannot update scheduling ${schedulingId} with status ${scheduling.status}`,
        'UpdateSchedulingService',
      )
      return left(
        new UnauthorizedError(
          'Não é possível editar agendamentos concluídos ou cancelados.',
        ),
      )
    }

    // Se mudou o equipamento, validar disponibilidade
    if (equipmentId && equipmentId !== scheduling.equipmentId.toString()) {
      const equipment = await this.equipmentRepository.findById(equipmentId)

      if (!equipment) {
        this.logger.warn(
          `Equipment not found: ${equipmentId}`,
          'UpdateSchedulingService',
        )
        return left(new ResourceNotFoundError('Equipamento não encontrado.'))
      }

      if (!equipment.isActive) {
        this.logger.warn(
          `Equipment ${equipmentId} is not active`,
          'UpdateSchedulingService',
        )
        return left(
          new InsufficientQuantityError(
            'Equipamento não está disponível para agendamento.',
          ),
        )
      }

      const requestedQuantity = quantity ?? scheduling.quantity
      const newStartDate = startDate ?? scheduling.startDate
      const newEndDate = endDate ?? scheduling.endDate

      // Verificar conflitos de agendamento
      const conflictingSchedulings =
        await this.schedulingRepository.findActiveByEquipmentIdAndDateRange(
          equipmentId,
          newStartDate,
          newEndDate,
        )

      // Remover o agendamento atual da lista de conflitos
      const otherSchedulings = conflictingSchedulings.filter(
        (s) => s.id.toString() !== schedulingId,
      )

      const totalScheduledQuantity = otherSchedulings.reduce(
        (sum, s) => sum + s.quantity,
        0,
      )

      const availableQuantity = equipment.quantity - totalScheduledQuantity

      if (availableQuantity < requestedQuantity) {
        this.logger.warn(
          `Insufficient quantity for equipment ${equipmentId}. Available: ${availableQuantity}, Requested: ${requestedQuantity}`,
          'UpdateSchedulingService',
        )
        return left(
          new InsufficientQuantityError(
            `Quantidade insuficiente. Disponível: ${availableQuantity}, Solicitado: ${requestedQuantity}`,
          ),
        )
      }

    } else if (
      (quantity && quantity !== scheduling.quantity) ||
      (startDate && startDate.getTime() !== scheduling.startDate.getTime()) ||
      (endDate && endDate.getTime() !== scheduling.endDate.getTime())
    ) {
      // Se mudou quantidade ou datas, validar conflitos no equipamento atual
      const equipment = await this.equipmentRepository.findById(
        scheduling.equipmentId.toString(),
      )

      if (!equipment) {
        return left(new ResourceNotFoundError('Equipamento não encontrado.'))
      }

      const requestedQuantity = quantity ?? scheduling.quantity
      const newStartDate = startDate ?? scheduling.startDate
      const newEndDate = endDate ?? scheduling.endDate

      // Verificar conflitos de agendamento
      const conflictingSchedulings =
        await this.schedulingRepository.findActiveByEquipmentIdAndDateRange(
          equipment.id.toString(),
          newStartDate,
          newEndDate,
        )

      // Remover o agendamento atual da lista de conflitos
      const otherSchedulings = conflictingSchedulings.filter(
        (s) => s.id.toString() !== schedulingId,
      )

      const totalScheduledQuantity = otherSchedulings.reduce(
        (sum, s) => sum + s.quantity,
        0,
      )

      const availableQuantity = equipment.quantity - totalScheduledQuantity

      if (availableQuantity < requestedQuantity) {
        this.logger.warn(
          `Insufficient quantity for equipment ${equipment.id.toString()}. Available: ${availableQuantity}, Requested: ${requestedQuantity}`,
          'UpdateSchedulingService',
        )
        return left(
          new InsufficientQuantityError(
            `Quantidade insuficiente. Disponível: ${availableQuantity}, Solicitado: ${requestedQuantity}`,
          ),
        )
      }
    }

    // Validar datas se foram alteradas
    const newStartDate = startDate ?? scheduling.startDate
    const newEndDate = endDate ?? scheduling.endDate

    if (newStartDate >= newEndDate) {
      this.logger.warn(
        'Start date must be before end date',
        'UpdateSchedulingService',
      )
      return left(
        new UnauthorizedError(
          'A data de início deve ser anterior à data de término.',
        ),
      )
    }

    // Atualizar scheduling usando o método da entidade
    const updateData: {
      equipmentId?: typeof scheduling.equipmentId
      startDate?: Date
      endDate?: Date
      quantity?: number
      notes?: string
    } = {}

    if (equipmentId) {
      const equipment = await this.equipmentRepository.findById(equipmentId)
      if (equipment) {
        updateData.equipmentId = equipment.id
      }
    }
    if (startDate) updateData.startDate = startDate
    if (endDate) updateData.endDate = endDate
    if (quantity) updateData.quantity = quantity
    if (notes !== undefined) updateData.notes = notes

    scheduling.update(updateData)

    await this.schedulingRepository.save(scheduling)

    this.logger.log(
      `Scheduling updated successfully: ${schedulingId}`,
      'UpdateSchedulingService',
    )

    return right({ scheduling })
  }
}
