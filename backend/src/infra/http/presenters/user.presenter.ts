import { User } from '@/domain/user/enterprise/entities/user.entity'

export class UserPresenter {
  static toHTTP(user: User) {
    return {
      id: user.id.toString(),
      fullName: user.fullName.toValue(),
      email: user.email.toValue(),
      phone: user.phone?.toValue() ?? null,
      role: user.role.toValue(),
      isActive: user.isActive,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  }
}
