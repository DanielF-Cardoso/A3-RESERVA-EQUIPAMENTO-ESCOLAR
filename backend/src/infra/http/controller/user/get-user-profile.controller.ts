import {
  Controller,
  Get,
  Req,
  UseGuards,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common'
import { GetUserProfileService } from '@/domain/user/application/services/get-user-profile.service'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { UserPresenter } from '../../presenters/user.presenter'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'
import { ApiTags } from '@nestjs/swagger'
import { AuthenticatedRequest } from '@/infra/auth/auth.types'
import { GetUserProfileDocs } from '@/infra/docs/user/get-user-profile.doc'

@ApiTags('Usuários')
@Controller('users')
export class GetUserProfileController {
  constructor(
    private getUserProfile: GetUserProfileService,
  ) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @GetUserProfileDocs()
  async getProfile(@Req() req: AuthenticatedRequest) {
    const userId = req.user.sub

    const result = await this.getUserProfile.execute({ userId })

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
      user: UserPresenter.toHTTP(result.value.user),
    }
  }
}
