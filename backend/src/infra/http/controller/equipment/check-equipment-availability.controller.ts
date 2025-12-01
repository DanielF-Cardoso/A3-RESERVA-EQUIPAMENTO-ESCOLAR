import {
  Controller,
  Get,
  Query,
  UseGuards,
  BadRequestException,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { CheckEquipmentAvailabilityService } from '@/domain/equipment/application/services/check-equipment-availability.service'
import { ApiTags } from '@nestjs/swagger'
import { CheckEquipmentAvailabilityDocs } from '@/infra/docs/equipment/check-equipment-availability.doc'

@ApiTags('Equipamentos')
@Controller('equipments/availability')
export class CheckEquipmentAvailabilityController {
  constructor(
    private checkEquipmentAvailabilityService: CheckEquipmentAvailabilityService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @CheckEquipmentAvailabilityDocs()
  async handle(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    if (!startDate || !endDate) {
      throw new BadRequestException(
        'startDate e endDate são obrigatórios.',
      )
    }

    const startDateTime = new Date(startDate)
    const endDateTime = new Date(endDate)

    if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
      throw new BadRequestException(
        'Datas inválidas.',
      )
    }

    const result = await this.checkEquipmentAvailabilityService.execute({
      startDate: startDateTime,
      endDate: endDateTime,
    })

    return result.value
  }
}
