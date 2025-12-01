import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { EquipmentType } from '@/core/value-objects/equipment-type.vo'
import { EquipmentStatus } from '@/core/value-objects/equipment-status.vo'

export interface EquipmentProps {
  name: string
  type: EquipmentType
  quantity: number
  status: EquipmentStatus
  location?: string
  description?: string
  isActive: boolean
  createdAt: Date
  updatedAt?: Date
}

export class Equipment extends Entity<EquipmentProps> {
  get name(): string {
    return this.props.name
  }

  get type(): EquipmentType {
    return this.props.type
  }

  get quantity(): number {
    return this.props.quantity
  }

  get status(): EquipmentStatus {
    return this.props.status
  }

  get location(): string | undefined {
    return this.props.location
  }

  get description(): string | undefined {
    return this.props.description
  }

  get isActive(): boolean {
    return this.props.isActive
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  edit(data: {
    name?: string
    type?: EquipmentType
    quantity?: number
    status?: EquipmentStatus
    location?: string | null
    description?: string | null
  }): void {
    if (data.name !== undefined) {
      const trimmed = data.name.trim()
      if (!trimmed || trimmed.length < 2) {
        throw new Error('Equipment name must have at least 2 characters')
      }
      if (trimmed.length > 100) {
        throw new Error('Equipment name cannot exceed 100 characters')
      }
      this.props.name = trimmed
    }

    if (data.type !== undefined) {
      this.props.type = data.type
    }

    if (data.quantity !== undefined) {
      if (data.quantity < 0) {
        throw new Error('Equipment quantity cannot be negative')
      }
      this.props.quantity = data.quantity
    }

    if (data.status !== undefined) {
      this.props.status = data.status
    }

    if (data.location !== undefined) {
      this.props.location = data.location === null ? undefined : data.location
    }

    if (data.description !== undefined) {
      this.props.description =
        data.description === null ? undefined : data.description
    }

    this.touch()
  }

  markAsMaintenance(): void {
    this.props.status = new EquipmentStatus('MAINTENANCE')
    this.touch()
  }

  markAsAvailable(): void {
    this.props.status = new EquipmentStatus('AVAILABLE')
    this.touch()
  }

  markAsInUse(): void {
    this.props.status = new EquipmentStatus('IN_USE')
    this.touch()
  }

  inactivate(): void {
    this.props.isActive = false
    this.touch()
  }

  activate(): void {
    this.props.isActive = true
    this.touch()
  }

  static create(
    props: Optional<EquipmentProps, 'createdAt' | 'isActive' | 'updatedAt'>,
    id?: UniqueEntityID,
  ): Equipment {
    const trimmedName = props.name.trim()
    if (!trimmedName || trimmedName.length < 2) {
      throw new Error('Equipment name must have at least 2 characters')
    }
    if (trimmedName.length > 100) {
      throw new Error('Equipment name cannot exceed 100 characters')
    }

    if (props.quantity < 0) {
      throw new Error('Equipment quantity cannot be negative')
    }

    const equipment = new Equipment(
      {
        ...props,
        name: trimmedName,
        isActive: props.isActive ?? true,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt,
      },
      id,
    )

    return equipment
  }
}
