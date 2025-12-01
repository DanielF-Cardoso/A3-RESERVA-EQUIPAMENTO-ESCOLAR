import { Inject, Injectable, LoggerService } from '@nestjs/common'
import { EquipmentRepository } from '../repositories/equipment-repository'
import { Equipment } from '../../enterprise/entities/equipment.entity'
import { Either, left, right } from '@/core/errors/either'
import { LOGGER_SERVICE } from '@/infra/logger/logger.module'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'
import { EquipmentType } from '@/core/value-objects/equipment-type.vo'
import { EquipmentStatus } from '@/core/value-objects/equipment-status.vo'

type UpdateEquipmentRequest = {
  equipmentId: string
  name?: string
  type?: string
  quantity?: number
  status?: string
  location?: string | null
  description?: string | null
}

type UpdateEquipmentResponse = Either<
  ResourceNotFoundError,
  { equipment: Equipment }
>

@Injectable()
export class UpdateEquipmentService {
  constructor(
    private equipmentRepository: EquipmentRepository,
    @Inject(LOGGER_SERVICE)
    private readonly logger: LoggerService,
  ) {}

  async execute(
    request: UpdateEquipmentRequest,
  ): Promise<UpdateEquipmentResponse> {
    const { equipmentId, name, type, quantity, status, location, description } =
      request

    this.logger.log(
      `Updating equipment ${equipmentId}`,
      'UpdateEquipmentService',
    )

    const equipment = await this.equipmentRepository.findById(equipmentId)

    if (!equipment) {
      this.logger.warn(
        `Equipment ${equipmentId} not found`,
        'UpdateEquipmentService',
      )
      return left(new ResourceNotFoundError('equipment'))
    }

    const equipmentType = type ? new EquipmentType(type) : equipment.type
    const equipmentStatus = status
      ? new EquipmentStatus(status)
      : equipment.status

    equipment.edit({
      name: name ?? equipment.name,
      type: equipmentType,
      quantity: quantity ?? equipment.quantity,
      status: equipmentStatus,
      location: location !== undefined ? location : equipment.location,
      description:
        description !== undefined ? description : equipment.description,
    })

    await this.equipmentRepository.save(equipment)

    this.logger.log(
      `Equipment ${equipmentId} updated successfully`,
      'UpdateEquipmentService',
    )

    return right({ equipment })
  }
}
