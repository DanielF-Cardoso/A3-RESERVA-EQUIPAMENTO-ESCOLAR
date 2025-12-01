import { CreateEquipmentService } from '@/domain/equipment/application/services/create-equipment.service'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
  UseGuards,
} from '@nestjs/common'
import { EquipmentPresenter } from '../../presenters/equipment.presenter'
import { CreateEquipmentDTO } from '../../dto/equipment/create-equipment.dto'
import { ApiTags } from '@nestjs/swagger'
import { CreateEquipmentDocs } from '@/infra/docs/equipment/create-equipment.doc'
import { RolesGuard } from '@/infra/auth/guards/roles.guard'
import { Roles } from '@/infra/auth/decorators/roles.decorator'

@ApiTags('Equipamentos')
@Controller('equipments')
export class CreateEquipmentController {
  constructor(
    private createEquipmentService: CreateEquipmentService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @CreateEquipmentDocs()
  async create(@Body() body: CreateEquipmentDTO) {
    const { name, type, quantity, status, location, description } = body

    const result = await this.createEquipmentService.execute({
      name,
      type,
      quantity,
      status,
      location,
      description,
    })

    if (result.isLeft()) {
      throw new InternalServerErrorException(
        'An unexpected error occurred.',
      )
    }

    return {
      equipment: EquipmentPresenter.toHTTP(result.value.equipment),
    }
  }
}
