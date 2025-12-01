import { Inject, Injectable, LoggerService } from '@nestjs/common'
import { User } from '../../enterprise/entities/user.entity'
import { UserRepository } from '../repositories/user-repository'
import { Either, right } from '@/core/errors/either'
import { LOGGER_SERVICE } from '@/infra/logger/logger.module'

type ListUsersServiceResponse = Either<null, { users: User[] }>

@Injectable()
export class ListUsersService {
  constructor(
    private userRepository: UserRepository,
    @Inject(LOGGER_SERVICE)
    private readonly logger: LoggerService,
  ) {}

  async execute(): Promise<ListUsersServiceResponse> {
    this.logger.log('Listing all users', 'ListUsersService')

    const users = await this.userRepository.findAll()

    this.logger.log(`Found ${users.length} user(s)`, 'ListUsersService')
    return right({ users })
  }
}