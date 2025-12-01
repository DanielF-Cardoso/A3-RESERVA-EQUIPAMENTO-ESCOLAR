import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Email } from '@/core/value-objects/email.vo'
import { FullName } from '@/core/value-objects/full-name.vo'
import { Phone } from '@/core/value-objects/phone.vo'
import { UserRole } from '@/core/value-objects/user-role.vo'

export interface UserProps {
  fullName: FullName
  email: Email
  password: string
  phone?: Phone
  role: UserRole
  isActive: boolean
  createdAt: Date
  updatedAt?: Date
  lastLogin?: Date
}

export class User extends Entity<UserProps> {
  static create(props: Omit<UserProps, 'createdAt'>, id?: UniqueEntityID) {
    const now = new Date()
    const user = new User(
      {
        ...props,
        isActive: props.isActive ?? true,
        role: props.role ?? new UserRole('TEACHER'),
        createdAt: now,
        updatedAt: now,
      },
      id,
    )
    return user
  }

  get fullName() {
    return this.props.fullName
  }

  get email() {
    return this.props.email
  }

  get password() {
    return this.props.password
  }

  get phone() {
    return this.props.phone
  }

  get role() {
    return this.props.role
  }

  get isActive() {
    return this.props.isActive
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get lastLogin() {
    return this.props.lastLogin
  }

  updatePassword(newPassword: string) {
    this.props.password = newPassword
    this.touch()
  }

  updateLastLogin() {
    this.props.lastLogin = new Date()
  }

  updateProfile({
    fullName,
    email,
    phone,
  }: {
    fullName?: FullName
    email?: Email
    phone?: Phone | null
  }) {
    if (fullName) {
      this.props.fullName = fullName
    }

    if (email) {
      this.props.email = email
    }

    // Se phone for null, remove o telefone
    // Se phone for undefined, não faz nada (mantém o atual)
    // Se phone for Phone, atualiza
    if (phone !== undefined) {
      this.props.phone = phone === null ? undefined : phone
    }

    this.touch()
  }

  updateRole(role: UserRole) {
    this.props.role = role
    this.touch()
  }

  activate() {
    this.props.isActive = true
    this.touch()
  }

  inactivate() {
    this.props.isActive = false
    this.touch()
  }

  private touch() {
    this.props.updatedAt = new Date()
  }
}
