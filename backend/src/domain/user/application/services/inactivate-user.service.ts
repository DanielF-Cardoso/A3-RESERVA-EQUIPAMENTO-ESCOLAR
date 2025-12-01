import { Inject, Injectable, LoggerService } from '@nestjs/common'
import { UserRepository } from '../repositories/user-repository'
import { Either, left, right } from '@/core/errors/either'
import { ResourceNotFoundError } from '../../../../core/errors/resource-not-found.error'
import { LOGGER_SERVICE } from '@/infra/logger/logger.module'
import { OwnAccountCannotBeInactivatedError } from './errors/own-account-cannot-be-inactivated.error'
import { LastUserCannotBeInactivatedError } from './errors/last-user-cannot-be-inactivated.error'

interface InactivateUserRequest {
  userId: string
  currentUserId: string
}

type InactivateUserResponse = Either<
  | ResourceNotFoundError
  | OwnAccountCannotBeInactivatedError
  | LastUserCannotBeInactivatedError,
  null
>

@Injectable()
export class InactivateUserService {
  constructor(
    private userRepository: UserRepository,
    @Inject(LOGGER_SERVICE)
    private readonly logger: LoggerService,
  ) {}

  async execute({
    userId,
    currentUserId,
  }: InactivateUserRequest): Promise<InactivateUserResponse> {
    this.logger.log(
      `Fetching user for inactivation, with id: ${userId}`,
      'InactivateUserService',
    )

    if (userId === currentUserId) {
      const errorMessage = 'You cannot inactivate your own account.'
      this.logger.warn(
        `Attempted to inactivate own account: userId: ${userId}`,
        'InactivateUserService',
      )
      return left(new OwnAccountCannotBeInactivatedError(errorMessage))
    }

    const user = await this.userRepository.findById(userId)

    if (!user) {
      const errorMessage = 'User not found.'
      this.logger.warn(
        `User not found for userId: ${userId}`,
        'InactivateUserService',
      )
      return left(new ResourceNotFoundError(errorMessage))
    }

    const activeUsersCount = await this.userRepository.countActiveUsers()

    if (activeUsersCount <= 1) {
      const errorMessage = 'Cannot inactivate the last user.'
      this.logger.warn(
        `Cannot inactivate last active user: userId: ${userId}`,
        'InactivateUserService',
      )
      return left(new LastUserCannotBeInactivatedError(errorMessage))
    }

    user.inactivate()
    await this.userRepository.save(user)

    this.logger.log(`User inactivated with id: ${userId}`, 'InactivateUserService')
    return right(null)
  }
}
