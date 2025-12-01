import {
  Controller,
  Get,
  UseGuards,
  InternalServerErrorException,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ListUsersService } from '@/domain/user/application/services/list-users.service'
import { UserPresenter } from '../../presenters/user.presenter'
import { ApiTags } from '@nestjs/swagger'
import { ListUsersDocs } from '@/infra/docs/user/list-users.doc'

@ApiTags('Usuários')
@Controller('users')
export class ListUsersController {
  constructor(
    private listUsersService: ListUsersService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ListUsersDocs()
  async handle() {
    const result = await this.listUsersService.execute()

    if (result.isLeft()) {
      throw new InternalServerErrorException(
        'An unexpected error occurred.',
      )
    }

    return {
      users: result.value.users.map(UserPresenter.toHTTP),
    }
  }
}
