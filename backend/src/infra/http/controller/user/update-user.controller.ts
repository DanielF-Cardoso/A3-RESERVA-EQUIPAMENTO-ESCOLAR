import {
  Body,
  Controller,
  Patch,
  Param,
  UseGuards,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { UpdateUserService } from '@/domain/user/application/services/update-user.service'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'
import { UserPresenter } from '../../presenters/user.presenter'
import { ApiTags } from '@nestjs/swagger'
import { EmailAlreadyExistsError } from '@/core/errors/email-already-exists.error'
import { PhoneAlreadyExistsError } from '@/domain/user/application/services/errors/phone-already-exists.error'
import { RolesGuard } from '@/infra/auth/guards/roles.guard'
import { Roles } from '@/infra/auth/decorators/roles.decorator'
import { UpdateOtherUserProfileDocs } from '@/infra/docs/user/update-other-user-profile.doc'
import { UpdateUserDTO } from '../../dto/user/update-user.dto'

@ApiTags('Usuários')
@Controller('users')
export class UpdateUserController {
  constructor(
    private updateUserService: UpdateUserService,
  ) {}

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @UpdateOtherUserProfileDocs()
  async handle(
    @Param('id') userId: string,
    @Body() body: UpdateUserDTO,
  ) {
    const result = await this.updateUserService.execute({
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
            'Usuário não encontrado.',
          )
        case EmailAlreadyExistsError:
          throw new ConflictException(
            'Este e-mail já está cadastrado no sistema.',
          )
        case PhoneAlreadyExistsError:
          throw new ConflictException(
            'Este telefone já está cadastrado no sistema.',
          )
        default:
          throw new InternalServerErrorException(
            'Ocorreu um erro inesperado.',
          )
      }
    }

    return {
      user: UserPresenter.toHTTP(result.value.user),
    }
  }
}
