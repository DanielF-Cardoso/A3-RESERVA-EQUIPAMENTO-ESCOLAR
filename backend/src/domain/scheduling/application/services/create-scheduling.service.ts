import { Inject, Injectable, LoggerService } from '@nestjs/common'
import { SchedulingRepository } from '../repositories/scheduling-repository'
import { Scheduling } from '../../enterprise/entities/scheduling.entity'
import { Either, left, right } from '@/core/errors/either'
import { LOGGER_SERVICE } from '@/infra/logger/logger.module'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'
import { EquipmentRepository } from '@/domain/equipment/application/repositories/equipment-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { SchedulingCreatedEvent } from '../../enterprise/events/scheduling-created.event'
import { DomainEvents } from '@/core/events/domain-events'

interface CreateSchedulingRequest {
  equipmentId: string
  userId: string
  startDate: Date
  endDate: Date
  quantity: number
  notes?: string
}

type CreateSchedulingResponse = Either<
  ResourceNotFoundError | InsufficientQuantityError,
  { scheduling: Scheduling }
>

class InsufficientQuantityError extends Error {
  constructor() {
    super('Insufficient equipment quantity available')
    this.name = 'InsufficientQuantityError'
  }
}

@Injectable()
export class CreateSchedulingService {
  constructor(
    private schedulingRepository: SchedulingRepository,
    private equipmentRepository: EquipmentRepository,
    @Inject(LOGGER_SERVICE)
    private readonly logger: LoggerService,
  ) {}

  async execute(
    request: CreateSchedulingRequest,
  ): Promise<CreateSchedulingResponse> {
    const { equipmentId, userId, startDate, endDate, quantity, notes } =
      request

    this.logger.log(
      `Creating scheduling for equipment ${equipmentId}`,
      'CreateSchedulingService',
    )

    // Verify equipment exists
    const equipment = await this.equipmentRepository.findById(equipmentId)
    if (!equipment) {
      this.logger.warn(
        `Equipment ${equipmentId} not found`,
        'CreateSchedulingService',
      )
      return left(new ResourceNotFoundError('equipment'))
    }

    // Check if there are conflicting schedulings
    const conflictingSchedulings =
      await this.schedulingRepository.findActiveByEquipmentIdAndDateRange(
        equipmentId,
        startDate,
        endDate,
      )

    // Calculate total quantity already scheduled
    const totalScheduledQuantity = conflictingSchedulings.reduce(
      (sum, scheduling) => sum + scheduling.quantity,
      0,
    )

    // Check if there's enough quantity available
    const availableQuantity = equipment.quantity - totalScheduledQuantity
    if (availableQuantity < quantity) {
      this.logger.warn(
        `Insufficient quantity for equipment ${equipmentId}. Available: ${availableQuantity}, Requested: ${quantity}`,
        'CreateSchedulingService',
      )
      return left(new InsufficientQuantityError())
    }

    const scheduling = Scheduling.create({
      equipmentId: new UniqueEntityID(equipmentId),
      userId: new UniqueEntityID(userId),
      startDate,
      endDate,
      quantity,
      notes,
    })

    await this.schedulingRepository.create(scheduling)

    // Mark event for dispatch
    const event = new SchedulingCreatedEvent(scheduling)
    DomainEvents.markEventForDispatch(event)

    this.logger.log(
      `Scheduling created with id: ${scheduling.id.toString()}`,
      'CreateSchedulingService',
    )

    return right({ scheduling })
  }
}

export { InsufficientQuantityError }
