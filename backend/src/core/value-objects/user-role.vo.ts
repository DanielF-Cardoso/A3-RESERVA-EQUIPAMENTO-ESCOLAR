import { UserRole as PrismaUserRole } from '@prisma/client'

export class UserRole {
  private readonly value: PrismaUserRole

  constructor(role: PrismaUserRole | string) {
    const validRoles: PrismaUserRole[] = ['TEACHER', 'STAFF', 'ADMIN']

    const roleValue =
      typeof role === 'string' ? (role.toUpperCase() as PrismaUserRole) : role

    if (!validRoles.includes(roleValue)) {
      throw new Error(
        `Invalid user role. Must be one of: ${validRoles.join(', ')}`,
      )
    }

    this.value = roleValue
  }

  toValue(): PrismaUserRole {
    return this.value
  }

  equals(other: UserRole): boolean {
    return this.value === other.toValue()
  }

  toString(): string {
    return this.value
  }

  // Métodos auxiliares para verificação de permissões
  isAdmin(): boolean {
    return this.value === 'ADMIN'
  }

  isStaff(): boolean {
    return this.value === 'STAFF'
  }

  isTeacher(): boolean {
    return this.value === 'TEACHER'
  }

  canManageEquipment(): boolean {
    return this.value === 'ADMIN' || this.value === 'STAFF'
  }

  canManageUsers(): boolean {
    return this.value === 'ADMIN'
  }

  canConfirmScheduling(): boolean {
    return (
      this.value === 'ADMIN' ||
      this.value === 'STAFF' ||
      this.value === 'TEACHER'
    )
  }
}
