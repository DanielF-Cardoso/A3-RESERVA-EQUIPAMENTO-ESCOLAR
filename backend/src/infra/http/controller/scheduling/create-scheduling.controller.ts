import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common'
import { CreateSchedulingDTO } from '../../dto/scheduling/create-scheduling.dto'
import { CreateSchedulingService } from '@/domain/scheduling/application/services/create-scheduling.service'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { SchedulingPresenter } from '../../presenters/scheduling.presenter'
import { CreateSchedulingDoc } from '../../../docs/scheduling/create-scheduling.doc'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Agendamentos')
@Controller('schedulings')
@UseGuards(JwtAuthGuard)
export class CreateSchedulingController {
  constructor(private createScheduling: CreateSchedulingService) {}

  @Post()
  @CreateSchedulingDoc()
  @HttpCode(HttpStatus.CREATED)
  async handle(@Body() body: CreateSchedulingDTO, @Request() req: any) {
    const { equipmentId, startDate, endDate, quantity, notes } = body
    const userId = req.user.sub

    const result = await this.createScheduling.execute({
      equipmentId,
      userId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      quantity,
      notes,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException('Equipment not found.')
        default:
          // InsufficientQuantityError or any other error
          if (error.message.includes('Insufficient')) {
            throw new ConflictException(error.message)
          }
          throw new BadRequestException('An unexpected error occurred.')
      }
    }

    return {
      scheduling: SchedulingPresenter.toHTTP(result.value.scheduling),
    }
  }
}
