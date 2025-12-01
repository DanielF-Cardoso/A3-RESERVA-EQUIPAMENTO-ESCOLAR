import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { User } from '@/domain/user/enterprise/entities/user.entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { FullName } from '@/core/value-objects/full-name.vo'
import { Email } from '@/core/value-objects/email.vo'
import { Phone } from '@/core/value-objects/phone.vo'
import { UserRole } from '@/core/value-objects/user-role.vo'
import { PrismaUserMapper } from '@/infra/database/prisma/mappers/prisma-user-mapper'

export interface MakePrismaUserParams {
  fullName?: string
  email?: string
  password?: string
  phone?: string
  role?: string
  isActive?: boolean
}

@Injectable()
export class UserFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaUser(
    data: MakePrismaUserParams = {},
  ): Promise<User> {
    const user = User.create(
      {
        fullName: new FullName(data.fullName || 'John Doe Silva'),
        email: new Email(data.email || 'john.doe@escola.com'),
        password: data.password || 'password123',
        phone: data.phone ? new Phone(data.phone) : undefined,
        role: new UserRole(data.role || 'TEACHER'),
        isActive: data.isActive !== undefined ? data.isActive : true,
      },
      new UniqueEntityID(),
    )

    const prismaUser = PrismaUserMapper.toPrisma(user)

    await this.prisma.user.create({
      data: prismaUser,
    })

    return user
  }
}
