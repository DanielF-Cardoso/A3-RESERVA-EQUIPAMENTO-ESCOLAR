import { Injectable } from '@nestjs/common'
import { UserRepository } from '@/domain/user/application/repositories/user-repository'
import { User } from '@/domain/user/enterprise/entities/user.entity'
import { PrismaUserMapper } from '../mappers/prisma-user-mapper'
import { Email } from '@/core/value-objects/email.vo'
import { PrismaService } from '../prisma.service'
import { Phone } from '@/core/value-objects/phone.vo'

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private prisma: PrismaService) {}

  async create(user: User): Promise<User> {
    const data = PrismaUserMapper.toPrisma(user)

    const createdUser = await this.prisma.user.create({ data })

    return PrismaUserMapper.toDomain(createdUser)
  }

  async findByEmail(email: string | Email): Promise<User | null> {
    const value =
      typeof email === 'string' ? email.toLowerCase() : email.toValue()

    const user = await this.prisma.user.findUnique({
      where: { email: value },
    })

    if (!user) return null

    return PrismaUserMapper.toDomain(user)
  }

  async findByPhone(phone: string | Phone): Promise<User | null> {
    const value =
      typeof phone === 'string' ? phone.toLowerCase() : phone.toValue()

    const user = await this.prisma.user.findFirst({
      where: { phone: value },
    })

    if (!user) return null

    return PrismaUserMapper.toDomain(user)
  }

  async delete(user: User): Promise<void> {
    await this.prisma.user.delete({
      where: { id: user.id.toString() },
    })
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    })

    if (!user) return null

    return PrismaUserMapper.toDomain(user)
  }

  async save(user: User): Promise<void> {
    const data = PrismaUserMapper.toPrisma(user)

    await this.prisma.user.update({
      where: { id: data.id },
      data,
    })
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany()
    return users.map(PrismaUserMapper.toDomain)
  }

  async findAllActive(): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: { isActive: true },
    })
    return users.map(PrismaUserMapper.toDomain)
  }

  async countActiveUsers(): Promise<number> {
    return await this.prisma.user.count({
      where: { isActive: true },
    })
  }
}
