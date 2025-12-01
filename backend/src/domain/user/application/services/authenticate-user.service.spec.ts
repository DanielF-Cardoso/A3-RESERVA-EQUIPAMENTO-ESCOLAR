import { describe, it, expect, beforeEach } from 'vitest'
import { AuthenticateUserService } from './authenticate-user.service'
import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { Email } from '@/core/value-objects/email.vo'
import { FakeHashComparer } from 'test/cryptography/fake-hasher-compare'
import { InvalidCredentialsError } from './errors/invalid-credentials.error'
import { FakeLogger } from 'test/fake/logs-mocks'
import { InactiveUserError } from './errors/inactive-user.error'
import { UserRole } from '@/core/value-objects/user-role.vo'
import { InMemoryUserRepository } from 'test/repositories/in-memory-user.repository'
import { makeUser } from 'test/factories/user/make-user'

let sut: AuthenticateUserService
let userRepository: InMemoryUserRepository
let logger: FakeLogger

beforeEach(() => {
  userRepository = new InMemoryUserRepository()
  const hashComparer = new FakeHashComparer()
  const encrypter = new FakeEncrypter()

  logger = new FakeLogger()

  sut = new AuthenticateUserService(
    userRepository,
    hashComparer,
    encrypter,
    logger,
  )
})

describe('AuthenticateUserService', () => {
  it('should authenticate and return an access token with role for valid credentials', async () => {
    const email = 'teacher@escola.com'
    const password = '123456'

    const user = makeUser({
      email: new Email(email),
      password: `hashed-${password}`,
      role: new UserRole('TEACHER'),
    })

    await userRepository.create(user)

    const result = await sut.execute({
      email,
      password,
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.accessToken).toBe(`token-${user.id.toString()}`)
      expect(result.value.role).toBe('TEACHER')
      expect(user.lastLogin).toBeInstanceOf(Date)
    }
  })

  it('should authenticate admin user and return ADMIN role', async () => {
    const email = 'admin@escola.com'
    const password = '123456'

    const user = makeUser({
      email: new Email(email),
      password: `hashed-${password}`,
      role: new UserRole('ADMIN'),
    })

    await userRepository.create(user)

    const result = await sut.execute({
      email,
      password,
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.accessToken).toBe(`token-${user.id.toString()}`)
      expect(result.value.role).toBe('ADMIN')
    }
  })

  it('should return error with translated message if email is incorrect', async () => {

    const email = 'teacher@escola.com'
    const password = '123456'

    const user = makeUser({
      email: new Email(email),
      password: `hashed-${password}`,
    })

    await userRepository.create(user)

    const result = await sut.execute({
      email: 'wrong@escola.com',
      password,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidCredentialsError)

    if (result.value instanceof InvalidCredentialsError) {
      expect(result.value.message).toBe('Invalid email or password.')
    }
  })

  it('should return error with translated message if password is incorrect', async () => {

    const email = 'teacher@escola.com'
    const password = '123456'

    const user = makeUser({
      email: new Email(email),
      password: `hashed-${password}`,
    })

    await userRepository.create(user)

    const result = await sut.execute({
      email,
      password: 'wrong-password',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidCredentialsError)
    if (result.value instanceof InvalidCredentialsError) {
      expect(result.value.message).toBe('Invalid email or password.')
    }
  })

  it('should return error if user is inactive', async () => {
    const email = 'teacher@escola.com'
    const password = '123456'

    const user = makeUser({
      email: new Email(email),
      password: `hashed-${password}`,
      isActive: false,
    })

    await userRepository.create(user)

    const result = await sut.execute({
      email,
      password,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InactiveUserError)
    if (result.value instanceof InactiveUserError) {
      expect(result.value.message).toBe(
        'Inactive user. Please contact the administrator.',
      )
    }
  })
})
