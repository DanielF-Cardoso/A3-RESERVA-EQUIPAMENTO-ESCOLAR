import { Email } from '@/core/value-objects/email.vo'
import { Phone } from '@/core/value-objects/phone.vo'
import { UserRepository } from '@/domain/user/application/repositories/user-repository'
import { User } from '@/domain/user/enterprise/entities/user.entity'

export class InMemoryUserRepository implements UserRepository {
  public items: User[] = []

  async create(user: User) {
    this.items.push(user)
    return user
  }

  async findByEmail(email: string) {
    const emailVO = new Email(email)
    const user = this.items.find(
      (item) => item.email.toValue() === emailVO.toValue(),
    )
    return user || null
  }

  async findById(id: string) {
    const user = this.items.find((item) => item.id.toValue() === id)
    return user || null
  }

  async findByPhone(phone: string) {
    const phoneVO = new Phone(phone)
    const user = this.items.find(
      (item) => item.phone?.toValue() === phoneVO.toValue(),
    )
    return user || null
  }

  async delete(user: User): Promise<void> {
    const index = this.items.findIndex((item) => item.id.equals(user.id))
    if (index >= 0) {
      this.items.splice(index, 1)
    }
  }

  async save(user: User): Promise<void> {
    const index = this.items.findIndex((item) => item.id.equals(user.id))
    if (index >= 0) {
      this.items[index] = user
    }
  }

  async findAll(): Promise<User[]> {
    return this.items
  }

  async findAllActive(): Promise<User[]> {
    return this.items.filter((item) => item.isActive)
  }

  async countActiveUsers(): Promise<number> {
    return this.items.filter((item) => item.isActive).length
  }
}
