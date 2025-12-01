import { Inject, Injectable, LoggerService } from '@nestjs/common'
import { HashComparer } from '@/core/cryptography/hash-comparer'
import { Encrypter } from '@/core/cryptography/encrypter'
import { UserRepository } from '../repositories/user-repository'
import { Either, left, right } from '@/core/errors/either'
import { InvalidCredentialsError } from './errors/invalid-credentials.error'
import { LOGGER_SERVICE } from '@/infra/logger/logger.module'
import { InactiveUserError } from './errors/inactive-user.error'

interface AuthenticateUserRequest {
  email: string
  password: string
}

type AuthenticateUserResponse = Either<
  InvalidCredentialsError | InactiveUserError,
  { accessToken: string; role: string }
>

@Injectable()
export class AuthenticateUserService {
  constructor(
    private userRepository: UserRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
    @Inject(LOGGER_SERVICE)
    private readonly logger: LoggerService,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateUserRequest): Promise<AuthenticateUserResponse> {
    this.logger.log(
      `Authenticating user with email: ${email}`,
      'AuthenticateUserService',
    )

    const user = await this.userRepository.findByEmail(email)

    if (!user) {
      const errorMessage = 'Invalid email or password.'
      this.logger.warn(
        `Authentication failed: User not found for email: ${email}`,
        'AuthenticateUserService',
      )
      return left(new InvalidCredentialsError(errorMessage))
    }

    if (!user.isActive) {
      const errorMessage = 'Inactive user. Please contact the administrator.'
      this.logger.warn(
        `Authentication failed: Inactive user for email: ${email}`,
        'AuthenticateUserService',
      )
      return left(new InactiveUserError(errorMessage))
    }

    const isValid = await this.hashComparer.compareHash(
      password,
      user.password,
    )

    if (!isValid) {
      const errorMessage = 'Invalid email or password.'
      this.logger.warn(
        `Authentication failed: Invalid password for email: ${email}`,
        'AuthenticateUserService',
      )
      return left(new InvalidCredentialsError(errorMessage))
    }

    user.updateLastLogin()
    await this.userRepository.save(user)

    const accessToken = await this.encrypter.encrypt({
      sub: user.id.toString(),
      role: user.role.toValue(),
    })

    this.logger.log(
      `User authenticated successfully: ${email} with role: ${user.role.toValue()}`,
      'AuthenticateUserService',
    )

    return right({ 
      accessToken,
      role: user.role.toValue(),
    })
  }
}
