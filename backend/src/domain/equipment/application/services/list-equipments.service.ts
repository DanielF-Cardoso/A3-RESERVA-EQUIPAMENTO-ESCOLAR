import { Inject, Injectable, LoggerService } from '@nestjs/common'
import { EquipmentRepository } from '../repositories/equipment-repository'
import { Equipment } from '../../enterprise/entities/equipment.entity'
import { Either, right } from '@/core/errors/either'
import { LOGGER_SERVICE } from '@/infra/logger/logger.module'

type ListEquipmentsResponse = Either<null, { equipments: Equipment[] }>

@Injectable()
export class ListEquipmentsService {
  constructor(
    private equipmentRepository: EquipmentRepository,
    @Inject(LOGGER_SERVICE)
    private readonly logger: LoggerService,
  ) {}

  async execute(): Promise<ListEquipmentsResponse> {
    this.logger.log('Listing all equipments', 'ListEquipmentsService')

    const equipments = await this.equipmentRepository.findAll()

    this.logger.log(
      `Found ${equipments.length} equipments`,
      'ListEquipmentsService',
    )

    return right({ equipments })
  }
}
