import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
  Query,
} from '@nestjs/common'
import { ListSchedulingsQueryDTO } from '../../dtos/scheduling/list-schedulings-query.dto'
import { ListSchedulingsService } from '@/domain/scheduling/application/services/list-schedulings.service'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { SchedulingPresenter } from '../../presenters/scheduling.presenter'
import { ListSchedulingsDoc } from '../../../docs/scheduling/list-schedulings.doc'

@Controller('schedulings')
@UseGuards(JwtAuthGuard)
export class ListSchedulingsController {
  constructor(private listSchedulings: ListSchedulingsService) {}

  @Get()
  @ListSchedulingsDoc()
  @HttpCode(HttpStatus.OK)
  async handle(@Query() query: ListSchedulingsQueryDTO) {
    const { date, userId, equipmentId } = query

    const result = await this.listSchedulings.execute({
      date: date ? new Date(date) : undefined,
      userId,
      equipmentId,
    })

    if (result.isLeft()) {
      const error = result.value
      throw error
    }

    return {
      schedulings: result.value.schedulings.map(SchedulingPresenter.toHTTP),
    }
  }
}
