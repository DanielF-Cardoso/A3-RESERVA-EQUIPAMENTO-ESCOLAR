import { Inject, Injectable, LoggerService } from '@nestjs/common'
import { EquipmentRepository } from '../repositories/equipment-repository'
import { Equipment } from '../../enterprise/entities/equipment.entity'
import { Either, right } from '@/core/errors/either'
import { EquipmentType } from '@/core/value-objects/equipment-type.vo'
import { EquipmentStatus } from '@/core/value-objects/equipment-status.vo'
import { LOGGER_SERVICE } from '@/infra/logger/logger.module'

interface CreateEquipmentRequest {
  name: string
  type: string
  quantity: number
  status?: string
  location?: string
  description?: string
}

type CreateEquipmentResponse = Either<null, { equipment: Equipment }>

@Injectable()
export class CreateEquipmentService {
  constructor(
    private equipmentRepository: EquipmentRepository,
    @Inject(LOGGER_SERVICE)
    private readonly logger: LoggerService,
  ) {}

  async execute({
    name,
    type,
    quantity,
    status = 'AVAILABLE',
    location,
    description,
  }: CreateEquipmentRequest): Promise<CreateEquipmentResponse> {
    this.logger.log(
      `Creating equipment: ${name} (${type})`,
      'CreateEquipmentService',
    )

    const equipment = Equipment.create({
      name,
      type: new EquipmentType(type),
      quantity,
      status: new EquipmentStatus(status),
      location,
      description,
    })

    await this.equipmentRepository.create(equipment)

    this.logger.log(
      `Equipment created with id: ${equipment.id.toString()}`,
      'CreateEquipmentService',
    )

    return right({ equipment })
  }
}
