import { Inject, Injectable, LoggerService } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import * as os from 'os'
import { LOGGER_SERVICE } from '../logger/logger.module'

@Injectable()
export class HealthCheckService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(LOGGER_SERVICE)
    private readonly logger: LoggerService,
  ) {}

  async checkDatabase() {
    const uptime = os.uptime()
    const timestamp = new Date().toISOString()

    try {
      await this.prismaService.$queryRaw`SELECT 1`

      return {
        status: 'ok',
        uptime,
        timestamp,
        message: 'Service is healthy.',
        check: {
          database: 'Database connected.',
        },
      }
    } catch (error) {
      this.logger.error(
        `Database connection failed: ${(error as Error).message}`,
        (error as Error).stack,
        'HealthCheckService',
      )

      return {
        status: 'error',
        uptime,
        timestamp,
        message: 'Service is unhealthy.',
        check: {
          database: 'Database disconnected.',
        },
      }
    }
  }
}
