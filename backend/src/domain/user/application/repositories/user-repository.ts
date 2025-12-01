import { User } from '../../enterprise/entities/user.entity'

export abstract class UserRepository {
  abstract findById(id: string): Promise<User | null>
  abstract findByEmail(email: string): Promise<User | null>
  abstract findByPhone(phone: string): Promise<User | null>
  abstract create(user: User): Promise<User>
  abstract save(user: User): Promise<void>
  abstract findAll(): Promise<User[]>
  abstract findAllActive(): Promise<User[]>
  abstract countActiveUsers(): Promise<number>
  abstract delete(user: User): Promise<void>
}
