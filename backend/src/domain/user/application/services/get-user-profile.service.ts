import { Inject, Injectable, LoggerService } from '@nestjs/common'
import { UserRepository } from '../repositories/user-repository'
import { User } from '../../enterprise/entities/user.entity'
import { Either, left, right } from '@/core/errors/either'
import { ResourceNotFoundError } from '../../../../core/errors/resource-not-found.error'
import { LOGGER_SERVICE } from '@/infra/logger/logger.module'

interface GetUserProfileRequest {
  userId: string
}

type GetUserProfileResponse = Either<
  ResourceNotFoundError,
  {
    user: User
  }
>

@Injectable()
export class GetUserProfileService {
  constructor(
    private userRepository: UserRepository,
    @Inject(LOGGER_SERVICE)
    private readonly logger: LoggerService,
  ) {}

  async execute({
    userId,
  }: GetUserProfileRequest): Promise<GetUserProfileResponse> {
    this.logger.log(
      `Fetching profile for userId: ${userId}`,
      'GetUserProfileService',
    )

    const user = await this.userRepository.findById(userId)

    if (!user) {
      const errorMessage = 'User not found.'
      this.logger.warn(
        `User profile not found for userId: ${userId}`,
        'GetUserProfileService',
      )
      return left(new ResourceNotFoundError(errorMessage))
    }

    this.logger.log(
      `User profile found for userId: ${userId}`,
      'GetUserProfileService',
    )
    return right({ user })
  }
}
