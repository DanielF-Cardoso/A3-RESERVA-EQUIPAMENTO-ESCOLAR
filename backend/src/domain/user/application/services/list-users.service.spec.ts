import { describe, it, expect, beforeEach } from 'vitest'
import { ListUsersService } from './list-users.service'
import { FakeLogger } from 'test/fake/logs-mocks'
import { InMemoryUserRepository } from 'test/repositories/in-memory-user.repository'
import { makeUser } from 'test/factories/user/make-user'

let sut: ListUsersService
let userRepository: InMemoryUserRepository
let logger: FakeLogger

beforeEach(() => {
  userRepository = new InMemoryUserRepository()


  logger = new FakeLogger()

  sut = new ListUsersService(userRepository,  logger)
})

describe('ListUsersService', () => {
  it('should return a list of all users', async () => {
    const user1 = makeUser()
    const user2 = makeUser()
    const user3 = makeUser()

    await userRepository.create(user1)
    await userRepository.create(user2)
    await userRepository.create(user3)

    const result = await sut.execute()

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.users).toHaveLength(3)
      expect(result.value.users[0]).toBeInstanceOf(user1.constructor)
      expect(result.value.users[1]).toBeInstanceOf(user2.constructor)
      expect(result.value.users[2]).toBeInstanceOf(user3.constructor)
    }
  })

  it('should return an empty list if no users are registered', async () => {
    const result = await sut.execute()

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.users).toHaveLength(0)
    }
  })

  it('should return only active users when listing', async () => {
    const activeUser = makeUser({ isActive: true })
    const inactiveUser = makeUser({ isActive: false })

    await userRepository.create(activeUser)
    await userRepository.create(inactiveUser)

    const result = await sut.execute()

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.users).toHaveLength(2)
      expect(result.value.users.some(u => u.id.equals(activeUser.id))).toBe(true)
      expect(result.value.users.some(u => u.id.equals(inactiveUser.id))).toBe(true)
    }
  })
})
