import { describe, it, expect, beforeEach } from 'vitest'
import { UpdateUserProfileService } from './update-user-profile.service'
import { InMemoryUserRepository } from 'test/repositories/in-memory-user.repository'
import { makeUser } from 'test/factories/user/make-user'
import { ResourceNotFoundError } from '../../../../core/errors/resource-not-found.error'
import { Email } from '@/core/value-objects/email.vo'
import { FakeLogger } from 'test/fake/logs-mocks'
import { Phone } from '@/core/value-objects/phone.vo'
import { EmailAlreadyExistsError } from '../../../../core/errors/email-already-exists.error'
import { PhoneAlreadyExistsError } from './errors/phone-already-exists.error'
import { UserRole } from '@/core/value-objects/user-role.vo'
import { FullName } from '@/core/value-objects/full-name.vo'

let sut: UpdateUserProfileService
let userRepository: InMemoryUserRepository
let logger: FakeLogger

beforeEach(() => {
  userRepository = new InMemoryUserRepository()


  logger = new FakeLogger()

  sut = new UpdateUserProfileService(userRepository,  logger)
})

describe('UpdateUserProfileService', () => {
  it('should update user profile with full name', async () => {
    const user = makeUser()
    await userRepository.create(user)

    const result = await sut.execute({
      userId: user.id.toString(),
      fullName: 'Maria Silva Santos',
      email: 'maria@escola.com',
      phone: '11987654321',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(user.fullName.toValue()).toBe('Maria Silva Santos')
      expect(user.email.toValue()).toBe('maria@escola.com')
      expect(user.phone?.toValue()).toBe('11987654321')
    }
  })

  it('should update only the provided fields', async () => {
    const user = makeUser({
      fullName: new FullName('João Silva'),
      email: new Email('joao@escola.com'),
    })
    await userRepository.create(user)

    const originalFullName = user.fullName.toValue()

    const result = await sut.execute({
      userId: user.id.toString(),
      email: 'joao.novo@escola.com',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(user.fullName.toValue()).toBe(originalFullName)
      expect(user.email.toValue()).toBe('joao.novo@escola.com')
    }
  })

  it('should update user role', async () => {
    const user = makeUser({ role: new UserRole('TEACHER') })
    await userRepository.create(user)

    const result = await sut.execute({
      userId: user.id.toString(),
      role: 'ADMIN',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(user.role.toValue()).toBe('ADMIN')
    }
  })

  it('should remove phone when empty string is provided', async () => {
    const user = makeUser({ phone: new Phone('11987654321') })
    await userRepository.create(user)

    const result = await sut.execute({
      userId: user.id.toString(),
      phone: '',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(user.phone).toBeUndefined()
    }
  })

  it('should add phone to user without phone', async () => {
    const user = makeUser()
    // Force remove phone
    const userWithoutPhone = makeUser({ phone: undefined })
    await userRepository.create(userWithoutPhone)

    const result = await sut.execute({
      userId: userWithoutPhone.id.toString(),
      phone: '11987654321',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(userWithoutPhone.phone?.toValue()).toBe('11987654321')
    }
  })

  it('should return error if user does not exist', async () => {

    const result = await sut.execute({
      userId: 'non-existent-id',
      fullName: 'Test User',
      email: 'test@escola.com',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    if (result.value instanceof ResourceNotFoundError) {
      expect(result.value.message).toBe('User not found.')
    }
  })

  it('should not allow changing email to one already in use', async () => {
    const user1 = makeUser({ email: new Email('taken@escola.com') })
    const user2 = makeUser({ email: new Email('available@escola.com') })

    await userRepository.create(user1)
    await userRepository.create(user2)

    const result = await sut.execute({
      userId: user2.id.toString(),
      email: 'taken@escola.com',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(EmailAlreadyExistsError)
    if (result.value instanceof EmailAlreadyExistsError) {
      expect(result.value.message).toBe(
        'A user with this email already exists.',
      )
    }
  })

  it('should not allow changing phone to one already in use', async () => {
    const user1 = makeUser({ phone: new Phone('11987654321') })
    const user2 = makeUser({ phone: new Phone('11912345678') })

    await userRepository.create(user1)
    await userRepository.create(user2)

    const result = await sut.execute({
      userId: user2.id.toString(),
      phone: '11987654321',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(PhoneAlreadyExistsError)
    if (result.value instanceof PhoneAlreadyExistsError) {
      expect(result.value.message).toBe(
        'A user with this phone already exists.',
      )
    }
  })

  it('should allow updating to same email (no change)', async () => {
    const user = makeUser({ email: new Email('joao@escola.com') })
    await userRepository.create(user)

    const result = await sut.execute({
      userId: user.id.toString(),
      email: 'joao@escola.com',
      fullName: 'João Silva Santos',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(user.email.toValue()).toBe('joao@escola.com')
      expect(user.fullName.toValue()).toBe('João Silva Santos')
    }
  })

  it('should update from TEACHER to STAFF role', async () => {
    const user = makeUser({ role: new UserRole('TEACHER') })
    await userRepository.create(user)

    const result = await sut.execute({
      userId: user.id.toString(),
      role: 'STAFF',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(user.role.toValue()).toBe('STAFF')
    }
  })

  it('should update multiple fields at once', async () => {
    const user = makeUser({
      fullName: new FullName('João Silva'),
      email: new Email('joao@escola.com'),
      role: new UserRole('TEACHER'),
    })
    await userRepository.create(user)

    const result = await sut.execute({
      userId: user.id.toString(),
      fullName: 'João Pedro Silva Santos',
      email: 'joao.pedro@escola.com',
      phone: '11987654321',
      role: 'ADMIN',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(user.fullName.toValue()).toBe('João Pedro Silva Santos')
      expect(user.email.toValue()).toBe('joao.pedro@escola.com')
      expect(user.phone?.toValue()).toBe('11987654321')
      expect(user.role.toValue()).toBe('ADMIN')
    }
  })
})
