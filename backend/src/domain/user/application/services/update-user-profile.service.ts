import { Inject, Injectable, LoggerService } from '@nestjs/common'
import { UserRepository } from '../repositories/user-repository'
import { Email } from '@/core/value-objects/email.vo'
import { Phone } from '@/core/value-objects/phone.vo'
import { FullName } from '@/core/value-objects/full-name.vo'
import { UserRole } from '@/core/value-objects/user-role.vo'
import { Either, left, right } from '@/core/errors/either'
import { ResourceNotFoundError } from '../../../../core/errors/resource-not-found.error'
import { User } from '../../enterprise/entities/user.entity'
import { LOGGER_SERVICE } from '@/infra/logger/logger.module'
import { PhoneAlreadyExistsError } from './errors/phone-already-exists.error'
import { EmailAlreadyExistsError } from '../../../../core/errors/email-already-exists.error'

interface UpdateUserProfileRequest {
  userId: string
  fullName?: string
  email?: string
  phone?: string
  role?: string
}

type UpdateUserProfileResponse = Either<
  ResourceNotFoundError | EmailAlreadyExistsError | PhoneAlreadyExistsError,
  { user: User }
>

@Injectable()
export class UpdateUserProfileService {
  constructor(
    private userRepository: UserRepository,
    @Inject(LOGGER_SERVICE)
    private readonly logger: LoggerService,
  ) {}

  async execute({
    userId,
    fullName,
    email,
    phone,
    role,
  }: UpdateUserProfileRequest): Promise<UpdateUserProfileResponse> {
    this.logger.log(
      `Attempting to update profile for userId: ${userId}`,
      'UpdateUserProfileService',
    )

    const user = await this.userRepository.findById(userId)
    if (!user) {
      const errorMessage = 'User not found.'
      this.logger.warn(
        `User not found for profile update: userId ${userId}`,
        'UpdateUserProfileService',
      )
      return left(new ResourceNotFoundError(errorMessage))
    }

    let newEmail = user.email
    if (email && email !== user.email.toValue()) {
      const emailValueObject = new Email(email)
      const existingWithSameEmail = await this.userRepository.findByEmail(
        emailValueObject.toValue(),
      )
      if (existingWithSameEmail && !existingWithSameEmail.id.equals(user.id)) {
        const errorMessage = 'A user with this email already exists.'
        this.logger.warn(
          `Email ${email} already in use during profile update for userId: ${userId}`,
          'UpdateUserProfileService',
        )
        return left(new EmailAlreadyExistsError(errorMessage))
      }
      newEmail = emailValueObject
    }

    let newPhone: Phone | undefined | null = user.phone
    let shouldUpdatePhone = false
    
    if (phone !== undefined) {
      shouldUpdatePhone = true
      if (phone === '') {
        // Remove phone if empty string is provided
        newPhone = null
      } else if (phone !== user.phone?.toValue()) {
        const phoneValueObject = new Phone(phone)
        const existingWithSamePhone = await this.userRepository.findByPhone(
          phoneValueObject.toValue(),
        )
        if (
          existingWithSamePhone &&
          !existingWithSamePhone.id.equals(user.id)
        ) {
          const errorMessage = 'A user with this phone already exists.'
          this.logger.warn(
            `Phone ${phone} already in use during profile update for userId: ${userId}`,
            'UpdateUserProfileService',
          )
          return left(new PhoneAlreadyExistsError(errorMessage))
        }
        newPhone = phoneValueObject
      }
    }

    const newFullName = fullName ? new FullName(fullName) : user.fullName

    const updateData: {
      fullName: FullName
      email: Email
      phone?: Phone | null
    } = {
      fullName: newFullName,
      email: newEmail,
    }

    if (shouldUpdatePhone) {
      updateData.phone = newPhone
    }

    user.updateProfile(updateData)

    // Update role if provided (only admins should be able to do this)
    if (role && role !== user.role.toValue()) {
      const newRole = new UserRole(role)
      user.updateRole(newRole)
    }

    await this.userRepository.save(user)

    this.logger.log(
      `Profile updated successfully for userId: ${userId}`,
      'UpdateUserProfileService',
    )

    return right({ user })
  }
}
