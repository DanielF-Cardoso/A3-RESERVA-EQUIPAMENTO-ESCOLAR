import { describe, it, expect, beforeEach } from 'vitest'
import { InactivateUserService } from './inactivate-user.service'
import { ResourceNotFoundError } from '../../../../core/errors/resource-not-found.error'
import { OwnAccountCannotBeInactivatedError } from './errors/own-account-cannot-be-inactivated.error'
import { FakeLogger } from 'test/fake/logs-mocks'
import { InMemoryUserRepository } from 'test/repositories/in-memory-user.repository'
import { makeUser } from 'test/factories/user/make-user'

let sut: InactivateUserService
let userRepository: InMemoryUserRepository
let logger: FakeLogger

beforeEach(() => {
  userRepository = new InMemoryUserRepository()


  logger = new FakeLogger()

  sut = new InactivateUserService(userRepository,  logger)
})

describe('InactivateUserService', () => {
  it('should inactivate a user successfully', async () => {
    const currentUser = makeUser()
    const userToInactivate = makeUser({ isActive: true })

    await userRepository.create(currentUser)
    await userRepository.create(userToInactivate)

    const result = await sut.execute({
      userId: userToInactivate.id.toString(),
      currentUserId: currentUser.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(userToInactivate.isActive).toBe(false)
  })

  it('should return error with translated message if user not found', async () => {

    const currentUser = makeUser()

    await userRepository.create(currentUser)

    const result = await sut.execute({
      userId: 'non-existent-id',
      currentUserId: currentUser.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)

    if (result.value instanceof ResourceNotFoundError) {
      expect(result.value.message).toBe('User not found.')
    }
  })

  it('should return error when trying to inactivate own account', async () => {
    const currentUser = makeUser()

    await userRepository.create(currentUser)

    const result = await sut.execute({
      userId: currentUser.id.toString(),
      currentUserId: currentUser.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(OwnAccountCannotBeInactivatedError)

    if (result.value instanceof OwnAccountCannotBeInactivatedError) {
      expect(result.value.message).toBe(
        'You cannot inactivate your own account.',
      )
    }
  })
})
