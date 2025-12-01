import { InactivateEquipmentService } from '@/domain/equipment/application/services/inactivate-equipment.service'
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
import { InactivateEquipmentDocs } from '@/infra/docs/equipment/inactivate-equipment.doc'
import { RolesGuard } from '@/infra/auth/guards/roles.guard'
import { Roles } from '@/infra/auth/decorators/roles.decorator'

@ApiTags('Equipamentos')
@Controller('equipments')
export class InactivateEquipmentController {
  constructor(
    private inactivateEquipmentService: InactivateEquipmentService,
  ) {}

  @Patch('inactivate/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @InactivateEquipmentDocs()
  async inactivate(@Param('id') id: string) {
    const result = await this.inactivateEquipmentService.execute({
      equipmentId: id,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(
            'Error message',
          )
        default:
          throw new InternalServerErrorException(
            'An unexpected error occurred.',
          )
      }
    }

    return {
      equipment: EquipmentPresenter.toHTTP(result.value.equipment),
    }
  }
}
