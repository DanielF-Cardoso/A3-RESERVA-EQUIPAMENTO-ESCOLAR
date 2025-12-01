import {
  Body,
  Controller,
  Patch,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
  NotFoundException,
  ConflictException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common'
import { UpdateSchedulingDTO } from '../../dto/scheduling/update-scheduling.dto'
import { UpdateSchedulingService } from '@/domain/scheduling/application/services/update-scheduling.service'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { SchedulingPresenter } from '../../presenters/scheduling.presenter'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'
import { UnauthorizedError } from '@/core/errors/unauthorized.error'
import { InsufficientQuantityError } from '@/domain/scheduling/application/services/errors/insufficient-quantity.error'
import { ApiTags } from '@nestjs/swagger'
import { UpdateSchedulingDocs } from '@/infra/docs/scheduling/update-scheduling.doc'

@ApiTags('Agendamentos')
@Controller('schedulings')
@UseGuards(JwtAuthGuard)
export class UpdateSchedulingController {
  constructor(private updateScheduling: UpdateSchedulingService) {}

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UpdateSchedulingDocs()
  async handle(
    @Param('id') id: string,
    @Body() body: UpdateSchedulingDTO,
    @Request() req: any,
  ) {
    const { equipmentId, startDate, endDate, quantity, notes } = body
    const userId = req.user.sub
    const userRole = req.user.role

    const result = await this.updateScheduling.execute({
      schedulingId: id,
      userId,
      userRole,
      equipmentId,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      quantity,
      notes,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        case UnauthorizedError:
          throw new ForbiddenException(error.message)
        case InsufficientQuantityError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException('Ocorreu um erro inesperado.')
      }
    }

    return {
      scheduling: SchedulingPresenter.toHTTP((result as any).value.scheduling),
    }
  }
}
