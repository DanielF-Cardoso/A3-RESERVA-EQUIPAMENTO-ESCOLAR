import {
  Body,
  Controller,
  Post,
  BadRequestException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common'
import { AuthenticateUserService } from '@/domain/user/application/services/authenticate-user.service'
import { InvalidCredentialsError } from '@/domain/user/application/services/errors/invalid-credentials.error'
import { AuthenticateUserDTO } from '../../dto/user/authenticate-user.dto'
import { ApiTags } from '@nestjs/swagger'
import { InactiveUserError } from '@/domain/user/application/services/errors/inactive-user.error'
import { AuthenticateUserDocs } from '@/infra/docs/user/authenticate-user.doc'

@ApiTags('Usuários')
@Controller('login')
export class AuthenticateUserController {
  constructor(
    private authenticateUser: AuthenticateUserService,
  ) {}

  @Post()
  @AuthenticateUserDocs()
  async login(@Body() body: AuthenticateUserDTO) {
    const { email, password } = body

    const result = await this.authenticateUser.execute({
      email,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case InvalidCredentialsError:
          throw new BadRequestException(
            'Email ou senha inválidos. Verifique as credenciais informadas e tente novamente.',
          )
        case InactiveUserError:
          throw new UnauthorizedException(
            'Usuário inativo. Entre em contato com o administrador do sistema.',
          )
        default:
          throw new InternalServerErrorException(
            'Ocorreu um erro inesperado. Por favor, tente novamente mais tarde.',
          )
      }
    }

    return {
      accessToken: result.value.accessToken,
      role: result.value.role,
    }
  }
}
