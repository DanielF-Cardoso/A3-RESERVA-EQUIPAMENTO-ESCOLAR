import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export type SchedulingStatus = 'SCHEDULED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'

export interface SchedulingProps {
  equipmentId: UniqueEntityID
  userId: UniqueEntityID
  startDate: Date
  endDate: Date
  quantity: number
  notes?: string
  status: SchedulingStatus
  createdAt: Date
  updatedAt?: Date
}

export class Scheduling extends Entity<SchedulingProps> {
  get equipmentId(): UniqueEntityID {
    return this.props.equipmentId
  }

  get userId(): UniqueEntityID {
    return this.props.userId
  }

  get startDate(): Date {
    return this.props.startDate
  }

  get endDate(): Date {
    return this.props.endDate
  }

  get quantity(): number {
    return this.props.quantity
  }

  get notes(): string | undefined {
    return this.props.notes
  }

  get status(): SchedulingStatus {
    return this.props.status
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt
  }

  get isActive(): boolean {
    return this.status === 'SCHEDULED' || this.status === 'CONFIRMED'
  }

  get isCompleted(): boolean {
    return this.status === 'COMPLETED'
  }

  get isCancelled(): boolean {
    return this.status === 'CANCELLED'
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  confirm(): void {
    if (this.status !== 'SCHEDULED') {
      throw new Error('Only scheduled schedulings can be confirmed')
    }

    this.props.status = 'CONFIRMED'
    this.touch()
  }

  cancel(): void {
    if (this.status === 'COMPLETED' || this.status === 'CANCELLED') {
      throw new Error('Cannot cancel completed or already cancelled scheduling')
    }

    this.props.status = 'CANCELLED'
    this.touch()
  }

  complete(): void {
    if (this.status !== 'CONFIRMED') {
      throw new Error('Only confirmed schedulings can be completed')
    }

    this.props.status = 'COMPLETED'
    this.touch()
  }

  update(data: {
    equipmentId?: UniqueEntityID
    startDate?: Date
    endDate?: Date
    quantity?: number
    notes?: string
  }): void {
    if (this.status === 'COMPLETED' || this.status === 'CANCELLED') {
      throw new Error('Cannot update completed or cancelled scheduling')
    }

    if (data.equipmentId) {
      this.props.equipmentId = data.equipmentId
    }

    if (data.startDate) {
      this.props.startDate = data.startDate
    }

    if (data.endDate) {
      this.props.endDate = data.endDate
    }

    if (data.quantity) {
      this.props.quantity = data.quantity
    }

    if (data.notes !== undefined) {
      this.props.notes = data.notes
    }

    // Validate dates after update
    if (this.props.startDate >= this.props.endDate) {
      throw new Error('Start date must be before end date')
    }

    this.touch()
  }

  static create(
    props: Optional<SchedulingProps, 'createdAt' | 'status' | 'updatedAt'>,
    id?: UniqueEntityID,
    skipPastDateValidation = false, // Permite carregar agendamentos passados do banco
  ): Scheduling {
    // Validate dates
    if (props.startDate >= props.endDate) {
      throw new Error('Start date must be before end date')
    }

    // Só valida data passada se NÃO estiver carregando do banco (ou seja, ao criar novo)
    if (!skipPastDateValidation && props.startDate < new Date()) {
      throw new Error('Start date cannot be in the past')
    }

    // Validate quantity
    if (props.quantity <= 0) {
      throw new Error('Quantity must be greater than 0')
    }

    const scheduling = new Scheduling(
      {
        ...props,
        status: props.status ?? 'SCHEDULED',
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt,
      },
      id,
    )

    return scheduling
  }
}
