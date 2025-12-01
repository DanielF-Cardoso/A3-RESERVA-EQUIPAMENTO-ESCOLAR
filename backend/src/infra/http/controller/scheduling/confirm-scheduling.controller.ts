import {
  Controller,
  Patch,
  HttpCode,
  HttpStatus,
  UseGuards,
  Param,
  Request,
} from '@nestjs/common'
import { ConfirmSchedulingService } from '@/domain/scheduling/application/services/confirm-scheduling.service'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { RolesGuard } from '@/infra/auth/guards/roles.guard'
import { Roles } from '@/infra/auth/decorators/roles.decorator'
import { SchedulingPresenter } from '../../presenters/scheduling.presenter'
import { ConfirmSchedulingDoc } from '../../../docs/scheduling/confirm-scheduling.doc'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Agendamentos')
@Controller('schedulings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ConfirmSchedulingController {
  constructor(private confirmScheduling: ConfirmSchedulingService) {}

  @Patch(':id/confirm')
  @ConfirmSchedulingDoc()
  @Roles('STAFF', 'ADMIN')
  @HttpCode(HttpStatus.OK)
  async handle(@Param('id') id: string, @Request() req: any) {
    const userRole = req.user.role

    const result = await this.confirmScheduling.execute({
      schedulingId: id,
      userRole,
    })

    if (result.isLeft()) {
      const error = result.value
      throw error
    }

    return {
      scheduling: SchedulingPresenter.toHTTP(result.value.scheduling),
    }
  }
}
