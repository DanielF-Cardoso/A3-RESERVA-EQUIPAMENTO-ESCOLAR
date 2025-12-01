import {
  Controller,
  Patch,
  HttpCode,
  HttpStatus,
  UseGuards,
  Param,
  Request,
} from '@nestjs/common'
import { CancelSchedulingService } from '@/domain/scheduling/application/services/cancel-scheduling.service'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { RolesGuard } from '@/infra/auth/guards/roles.guard'
import { Roles } from '@/infra/auth/decorators/roles.decorator'
import { SchedulingPresenter } from '../../presenters/scheduling.presenter'
import { CancelSchedulingDoc } from '../../../docs/scheduling/cancel-scheduling.doc'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Agendamentos')
@Controller('schedulings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CancelSchedulingController {
  constructor(private cancelScheduling: CancelSchedulingService) {}

  @Patch(':id/cancel')
  @CancelSchedulingDoc()
  @Roles('STAFF', 'ADMIN')
  @HttpCode(HttpStatus.OK)
  async handle(@Param('id') id: string, @Request() req: any) {
    const userRole = req.user.role

    const result = await this.cancelScheduling.execute({
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
