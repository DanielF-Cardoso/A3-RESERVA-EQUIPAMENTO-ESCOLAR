import {
  Controller,
  Param,
  UseGuards,
  NotFoundException,
  InternalServerErrorException,
  Req,
  Patch,
  ForbiddenException,
  HttpCode,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'
import { ApiTags } from '@nestjs/swagger'
import { InactivateUserService } from '@/domain/user/application/services/inactivate-user.service'
import { OwnAccountCannotBeInactivatedError } from '@/domain/user/application/services/errors/own-account-cannot-be-inactivated.error'
import { AuthenticatedRequest } from '@/infra/auth/auth.types'
import { InactivateUserDocs } from '@/infra/docs/user/inactivate-user.doc'
import { LastUserCannotBeInactivatedError } from '@/domain/user/application/services/errors/last-user-cannot-be-inactivated.error'
import { RolesGuard } from '@/infra/auth/guards/roles.guard'
import { Roles } from '@/infra/auth/decorators/roles.decorator'

@ApiTags('Usuários')
@Controller('users')
export class InactivateUserController {
  constructor(
    private inactivateUserService: InactivateUserService,
  ) {}

  @Patch('inactivate/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @InactivateUserDocs()
  @HttpCode(200)
  async handle(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    const result = await this.inactivateUserService.execute({
      userId: id,
      currentUserId: req.user.sub,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(
            'Usuário não encontrado.',
          )
        case LastUserCannotBeInactivatedError:
          throw new ForbiddenException(
            'Não é possível inativar o último usuário ativo do sistema.',
          )
        case OwnAccountCannotBeInactivatedError:
          throw new ForbiddenException(
            'Você não pode inativar sua própria conta.',
          )
        default:
          throw new InternalServerErrorException(
            'An unexpected error occurred.',
          )
      }
    }

    return {
      message: 'Usuário inativado com sucesso.',
    }
  }
}
