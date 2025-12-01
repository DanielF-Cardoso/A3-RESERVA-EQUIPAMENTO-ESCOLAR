import { ListEquipmentsService } from '@/domain/equipment/application/services/list-equipments.service'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import {
  Controller,
  Get,
  InternalServerErrorException,
  UseGuards,
} from '@nestjs/common'
import { EquipmentPresenter } from '../../presenters/equipment.presenter'
import { ApiTags } from '@nestjs/swagger'
import { ListEquipmentsDocs } from '@/infra/docs/equipment/list-equipments.doc'
import { RolesGuard } from '@/infra/auth/guards/roles.guard'
import { Roles } from '@/infra/auth/decorators/roles.decorator'

@ApiTags('Equipamentos')
@Controller('equipments')
export class ListEquipmentsController {
  constructor(
    private listEquipmentsService: ListEquipmentsService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ListEquipmentsDocs()
  async list() {
    const result = await this.listEquipmentsService.execute()

    if (result.isLeft()) {
      throw new InternalServerErrorException(
        'An unexpected error occurred.',
      )
    }

    return {
      equipments: result.value.equipments.map(EquipmentPresenter.toHTTP),
    }
  }
}
