import {
  Inject,
  Injectable,
  LoggerService,
  UnauthorizedException,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { LOGGER_SERVICE } from '../logger/logger.module'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    @Inject(LOGGER_SERVICE)
    private readonly logger: LoggerService,
  ) {
    super()
  }

  handleRequest(err: any, user: any) {
    if (err || !user) {
      const message = 'Unauthorized access.'

      this.logger.warn(`Unauthorized access attempt`, 'JwtAuthGuard')

      throw new UnauthorizedException(message)
    }
    return user
  }
}
