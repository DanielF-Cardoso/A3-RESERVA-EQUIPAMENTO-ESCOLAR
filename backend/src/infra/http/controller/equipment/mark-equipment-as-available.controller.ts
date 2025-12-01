import { MarkEquipmentAsAvailableService } from '@/domain/equipment/application/services/mark-equipment-as-available.service'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import {
  Controller,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common'
import { EquipmentPresenter } from '../../presenters/equipment.presenter'
import { ApiTags } from '@nestjs/swagger'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'
import { RolesGuard } from '@/infra/auth/guards/roles.guard'
import { Roles } from '@/infra/auth/decorators/roles.decorator'
import { MarkEquipmentAsAvailableDocs } from '@/infra/docs/equipment/mark-equipment-as-available.doc'

@ApiTags('Equipamentos')
@Controller('equipments')
export class MarkEquipmentAsAvailableController {
  constructor(
    private markEquipmentAsAvailableService: MarkEquipmentAsAvailableService,
  ) {}

  @Patch(':id/available')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @MarkEquipmentAsAvailableDocs()
  async markAsAvailable(@Param('id') id: string) {
    const result = await this.markEquipmentAsAvailableService.execute({
      equipmentId: id,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new InternalServerErrorException(
            'Ocorreu um erro inesperado.',
          )
      }
    }

    return {
      equipment: EquipmentPresenter.toHTTP(result.value.equipment),
    }
  }
}
