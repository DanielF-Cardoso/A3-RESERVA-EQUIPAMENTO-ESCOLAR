import { faker } from '@faker-js/faker'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Email } from '@/core/value-objects/email.vo'
import { FullName } from '@/core/value-objects/full-name.vo'
import { User } from '@/domain/user/enterprise/entities/user.entity'
import { Phone } from '@/core/value-objects/phone.vo'
import { UserRole } from '@/core/value-objects/user-role.vo'

interface Override {
  fullName?: FullName
  email?: Email
  password?: string
  phone?: Phone
  role?: UserRole
  isActive?: boolean
}

export function makeUser(override: Override = {}, id?: UniqueEntityID): User {
  const fullName =
    override.fullName ??
    new FullName(`${faker.person.firstName()} ${faker.person.lastName()}`)

  const email = override.email ?? new Email(faker.internet.email())

  const password = override.password ?? 'hashed-password'

  const phone =
    override.phone ??
    new Phone(`11${faker.number.int({ min: 900000000, max: 999999999 })}`)

  const role = override.role ?? new UserRole('TEACHER')

  return User.create(
    {
      fullName,
      email,
      password,
      phone,
      role,
      isActive: override.isActive ?? true,
    },
    id,
  )
}
