import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common'
import { GetDashboardStatsService } from '@/domain/dashboard/application/services/get-dashboard-stats.service'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ApiTags } from '@nestjs/swagger'
import { DashboardSchedulingPresenter } from '../../presenters/dashboard-scheduling.presenter'
import { GetDashboardStatsDocs } from '@/infra/docs/dashboard/get-dashboard-stats.doc'

@ApiTags('Dashboard')
@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class GetDashboardStatsController {
  constructor(private getDashboardStats: GetDashboardStatsService) {}

  @Get('stats')
  @HttpCode(HttpStatus.OK)
  @GetDashboardStatsDocs()
  async handle() {
    const result = await this.getDashboardStats.execute()

    const { stats, recentSchedulings } = (result as any).value

    return {
      stats,
      recentSchedulings: recentSchedulings.map(DashboardSchedulingPresenter.toHTTP),
    }
  }
}
