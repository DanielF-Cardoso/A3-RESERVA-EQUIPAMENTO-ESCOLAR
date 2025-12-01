import {
  Body,
  Controller,
  Patch,
  Req,
  UseGuards,
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { UpdateUserProfileService } from '@/domain/user/application/services/update-user-profile.service'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'
import { SameEmailError } from '@/core/errors/same-email.error'
import { UserPresenter } from '../../presenters/user.presenter'
import { UpdateUserProfileDTO } from '../../dto/user/update-user-profile.dto'
import { ApiTags } from '@nestjs/swagger'
import { SamePhoneError } from '@/core/errors/same-phone.error'
import { EmailAlreadyExistsError } from '@/core/errors/email-already-exists.error'
import { PhoneAlreadyExistsError } from '@/domain/user/application/services/errors/phone-already-exists.error'
import { AuthenticatedRequest } from '@/infra/auth/auth.types'
import { UpdateUserProfileDocs } from '@/infra/docs/user/update-user-profile.doc'

@ApiTags('Usuários')
@Controller('users/me')
export class UpdateUserProfileController {
  constructor(
    private updateUserProfileService: UpdateUserProfileService,
  ) {}

  @Patch()
  @UseGuards(JwtAuthGuard)
  @UpdateUserProfileDocs()
  async handle(
    @Body() body: UpdateUserProfileDTO,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.sub

    const result = await this.updateUserProfileService.execute({
      userId,
      fullName: body.fullName,
      email: body.email,
      phone: body.phone,
      role: body.role,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(
            'Error message',
          )
        case SameEmailError:
          throw new ConflictException(
            'Error message',
          )
        case SamePhoneError:
          throw new ConflictException(
            'Error message',
          )
        case EmailAlreadyExistsError:
          throw new ConflictException(
            'Error message',
          )
        case PhoneAlreadyExistsError:
          throw new ConflictException(
            'Error message',
          )
        default:
          throw new BadRequestException(
            'An unexpected error occurred.',
          )
      }
    }

    return {
      user: UserPresenter.toHTTP(result.value.user),
    }
  }
}
