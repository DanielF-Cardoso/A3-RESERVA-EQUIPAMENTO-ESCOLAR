import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Email } from '@/core/value-objects/email.vo'
import { FullName } from '@/core/value-objects/full-name.vo'
import { Phone } from '@/core/value-objects/phone.vo'
import { UserRole } from '@/core/value-objects/user-role.vo'
import { User } from '@/domain/user/enterprise/entities/user.entity'
import { User as PrismaUser, Prisma } from '@prisma/client'

export class PrismaUserMapper {
  static toDomain(raw: PrismaUser): User {
    const user = User.create(
      {
        fullName: new FullName(raw.fullName),
        email: new Email(raw.email),
        phone: raw.phone ? new Phone(raw.phone) : undefined,
        role: new UserRole(raw.role),
        password: raw.password,
        isActive: raw.isActive,
        updatedAt: raw.updatedAt ?? undefined,
        lastLogin: raw.lastLogin ?? undefined,
      },
      new UniqueEntityID(raw.id),
    )

    return user
  }

  static toPrisma(user: User): Prisma.UserUncheckedCreateInput {
    return {
      id: user.id.toValue(),
      fullName: user.fullName.toValue(),
      email: user.email.toValue(),
      password: user.password,
      phone: user.phone?.toValue() ?? null,
      role: user.role.toValue(),
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt ?? undefined,
      lastLogin: user.lastLogin ?? undefined,
    }
  }
}
