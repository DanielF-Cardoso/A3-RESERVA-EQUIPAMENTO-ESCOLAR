import { CreateUserService } from '@/domain/user/application/services/create-user.service'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import {
  Body,
  ConflictException,
  Controller,
  InternalServerErrorException,
  Post,
  UseGuards,
} from '@nestjs/common'
import { EmailAlreadyExistsError } from '@/core/errors/email-already-exists.error'
import { UserPresenter } from '../../presenters/user.presenter'
import { CreateUserDTO } from '../../dto/user/create-user.dto'
import { ApiTags } from '@nestjs/swagger'
import { PhoneAlreadyExistsError } from '@/domain/user/application/services/errors/phone-already-exists.error'
import { CreateUserDocs } from '@/infra/docs/user/create-user.doc'
import { RolesGuard } from '@/infra/auth/guards/roles.guard'
import { Roles } from '@/infra/auth/decorators/roles.decorator'

@ApiTags('Usuários')
@Controller('users')
export class CreateUserController {
  constructor(
    private createUserService: CreateUserService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @CreateUserDocs()
  async create(@Body() body: CreateUserDTO) {
    const { fullName, email, password, phone, role } = body

    const result = await this.createUserService.execute({
      fullName,
      email,
      password,
      phone,
      role,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
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
            'An unexpected error occurred.',
          )
      }
    }

    return {
      user: UserPresenter.toHTTP(result.value.user),
    }
  }
}
