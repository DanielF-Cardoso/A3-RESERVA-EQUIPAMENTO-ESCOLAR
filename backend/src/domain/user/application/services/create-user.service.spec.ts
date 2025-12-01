import { describe, it, expect, beforeEach } from 'vitest'
import { CreateUserService } from './create-user.service'
import { FakeHashGenerator } from 'test/cryptography/fake-hasher'
import { EmailAlreadyExistsError } from '../../../../core/errors/email-already-exists.error'
import { FakeLogger } from 'test/fake/logs-mocks'
import { PhoneAlreadyExistsError } from './errors/phone-already-exists.error'
import { Email } from '@/core/value-objects/email.vo'
import { Phone } from '@/core/value-objects/phone.vo'
import { InMemoryUserRepository } from 'test/repositories/in-memory-user.repository'
import { makeUser } from 'test/factories/user/make-user'

let sut: CreateUserService
let userRepository: InMemoryUserRepository
let hashGenerator: FakeHashGenerator
let logger: FakeLogger

beforeEach(() => {
  userRepository = new InMemoryUserRepository()
  hashGenerator = new FakeHashGenerator()

  logger = new FakeLogger()

  sut = new CreateUserService(userRepository, hashGenerator, logger)
})

describe('CreateUserService', () => {
  it('should create a new user with TEACHER role by default', async () => {
    const result = await sut.execute({
      fullName: 'João Silva Santos',
      email: 'joao@escola.com',
      password: '123456',
      phone: '11987654321',
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.user).toBeDefined()
      expect(result.value.user.fullName.toValue()).toBe('João Silva Santos')
      expect(result.value.user.email.toValue()).toBe('joao@escola.com')
      expect(result.value.user.role.toValue()).toBe('TEACHER')
      expect(userRepository.items).toHaveLength(1)
    }
  })

  it('should create a new user with ADMIN role when specified', async () => {
    const result = await sut.execute({
      fullName: 'Maria Admin Silva',
      email: 'maria@escola.com',
      password: '123456',
      role: 'ADMIN',
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.user.role.toValue()).toBe('ADMIN')
    }
  })

  it('should create a new user with STAFF role when specified', async () => {
    const result = await sut.execute({
      fullName: 'Ana Staff Santos',
      email: 'ana@escola.com',
      password: '123456',
      role: 'STAFF',
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.user.role.toValue()).toBe('STAFF')
    }
  })

  it('should create a new user without phone (optional field)', async () => {
    const result = await sut.execute({
      fullName: 'Pedro Sem Telefone',
      email: 'pedro@escola.com',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.user.phone).toBeUndefined()
    }
  })

  it('should hash the password before storing', async () => {
    const password = '123456'

    const result = await sut.execute({
      fullName: 'Teste Hash',
      email: 'teste@escola.com',
      password,
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.user.password).toBe(`hashed-${password}`)
    }
  })

  it('should return error if email already exists', async () => {
    const existingUser = makeUser({
      email: new Email('joao@escola.com'),
    })

    await userRepository.create(existingUser)

    const result = await sut.execute({
      fullName: 'João Duplicado',
      email: 'joao@escola.com',
      password: '123456',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(EmailAlreadyExistsError)

    if (result.value instanceof EmailAlreadyExistsError) {
      expect(result.value.message).toBe('A user with this email already exists.')
    }
  })

  it('should return error if phone already exists', async () => {
    const existingUser = makeUser({
      phone: new Phone('11987654321'),
    })

    await userRepository.create(existingUser)

    const result = await sut.execute({
      fullName: 'João Telefone Duplicado',
      email: 'joao2@escola.com',
      password: '123456',
      phone: '11987654321',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(PhoneAlreadyExistsError)

    if (result.value instanceof PhoneAlreadyExistsError) {
      expect(result.value.message).toBe('A user with this phone already exists.')
    }
  })
})
