import { UpdateEquipmentService } from '@/domain/equipment/application/services/update-equipment.service'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import {
  Body,
  Controller,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common'
import { EquipmentPresenter } from '../../presenters/equipment.presenter'
import { UpdateEquipmentDTO } from '../../dto/equipment/update-equipment.dto'
import { ApiTags } from '@nestjs/swagger'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'
import { UpdateEquipmentDocs } from '@/infra/docs/equipment/update-equipment.doc'
import { RolesGuard } from '@/infra/auth/guards/roles.guard'
import { Roles } from '@/infra/auth/decorators/roles.decorator'

@ApiTags('Equipamentos')
@Controller('equipments')
export class UpdateEquipmentController {
  constructor(
    private updateEquipmentService: UpdateEquipmentService,
  ) {}

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @UpdateEquipmentDocs()
  async update(@Param('id') id: string, @Body() body: UpdateEquipmentDTO) {
    const { name, type, quantity, status, location, description } = body

    const result = await this.updateEquipmentService.execute({
      equipmentId: id,
      name,
      type,
      quantity,
      status,
      location,
      description,
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
