import { HashGenerator } from '@/core/cryptography/hash-generator'
import { User } from '../../enterprise/entities/user.entity'
import { UserRepository } from '../repositories/user-repository'
import { Email } from '@/core/value-objects/email.vo'
import { Either, left, right } from '@/core/errors/either'
import { Inject, Injectable, LoggerService } from '@nestjs/common'
import { LOGGER_SERVICE } from '@/infra/logger/logger.module'
import { Phone } from '@/core/value-objects/phone.vo'
import { PhoneAlreadyExistsError } from './errors/phone-already-exists.error'
import { EmailAlreadyExistsError } from '../../../../core/errors/email-already-exists.error'
import { UserRole } from '@/core/value-objects/user-role.vo'
import { FullName } from '@/core/value-objects/full-name.vo'

export interface CreateUserServiceRequest {
  fullName: string
  email: string
  password: string
  phone?: string
  role?: string
}

type CreateUserServiceResponse = Either<
  EmailAlreadyExistsError | PhoneAlreadyExistsError,
  { user: User }
>

@Injectable()
export class CreateUserService {
  constructor(
    private userRepository: UserRepository,
    private hashGenerator: HashGenerator,
    @Inject(LOGGER_SERVICE)
    private readonly logger: LoggerService,
  ) {}

  async execute({
    fullName,
    email,
    password,
    phone,
    role = 'TEACHER',
  }: CreateUserServiceRequest): Promise<CreateUserServiceResponse> {
    this.logger.log(
      `Starting user creation for email: ${email}`,
      'CreateUserService',
    )

    const fullNameVO = new FullName(fullName)
    const emailVO = new Email(email)
    const phoneVO = phone ? new Phone(phone) : undefined
    const roleVO = new UserRole(role)

    const existingUser = await this.userRepository.findByEmail(
      emailVO.toValue(),
    )

    if (existingUser) {
      const errorMessage = 'A user with this email already exists.'
      this.logger.warn(
        `User already exists with email: ${email}`,
        'CreateUserService',
      )
      return left(new EmailAlreadyExistsError(errorMessage))
    }

    if (phoneVO) {
      const existingUserByPhone = await this.userRepository.findByPhone(
        phoneVO.toValue(),
      )

      if (existingUserByPhone) {
        const errorMessage = 'A user with this phone already exists.'
        this.logger.warn(
          `User already exists with phone: ${phone}`,
          'CreateUserService',
        )
        return left(new PhoneAlreadyExistsError(errorMessage))
      }
    }

    const hashedPassword = await this.hashGenerator.generateHash(password)

    const user = User.create({
      fullName: fullNameVO,
      email: emailVO,
      password: hashedPassword,
      phone: phoneVO,
      role: roleVO,
      isActive: true,
    })

    await this.userRepository.create(user)

    this.logger.log(
      `User created successfully with email: ${email} and role: ${role}`,
      'CreateUserService',
    )

    return right({ user })
  }
}
