import { describe, it, expect, beforeEach } from 'vitest'
import { GetUserProfileService } from './get-user-profile.service'
import { InMemoryUserRepository } from 'test/repositories/in-memory-user.repository'
import { makeUser } from 'test/factories/user/make-user'
import { ResourceNotFoundError } from '../../../../core/errors/resource-not-found.error'
import { FakeLogger } from 'test/fake/logs-mocks'

let sut: GetUserProfileService
let userRepository: InMemoryUserRepository
let logger: FakeLogger

beforeEach(() => {
  userRepository = new InMemoryUserRepository()


  logger = new FakeLogger()

  sut = new GetUserProfileService(userRepository,  logger)
})

describe('GetUserProfileService', () => {
  it('should return user profile by id', async () => {
    const user = makeUser()
    await userRepository.create(user)

    const result = await sut.execute({ userId: user.id.toString() })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.user.id.toString()).toBe(user.id.toString())
      expect(result.value.user.fullName.toValue()).toBe(
        user.fullName.toValue(),
      )
      expect(result.value.user.email.toValue()).toBe(user.email.toValue())
      expect(result.value.user.role.toValue()).toBe(user.role.toValue())
    }
  })

  it('should return user profile with all fields including role', async () => {
    const user = makeUser()
    await userRepository.create(user)

    const result = await sut.execute({ userId: user.id.toString() })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.user.fullName).toBeDefined()
      expect(result.value.user.email).toBeDefined()
      expect(result.value.user.role).toBeDefined()
      expect(result.value.user.isActive).toBeDefined()
    }
  })

  it('should return error with translated message if user is not found', async () => {

    const result = await sut.execute({ userId: 'non-existent-id' })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    if (result.value instanceof ResourceNotFoundError) {
      expect(result.value.message).toBe('User not found.')
    }
  })

  it('should return inactive user profile if requested', async () => {
    const inactiveUser = makeUser({ isActive: false })
    await userRepository.create(inactiveUser)

    const result = await sut.execute({ userId: inactiveUser.id.toString() })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.user.isActive).toBe(false)
    }
  })
})
