export class EquipmentType {
  private readonly value: string

  constructor(type: string) {
    const trimmed = type.trim()

    if (!trimmed || trimmed.length < 2) {
      throw new Error('Equipment type must have at least 2 characters')
    }

    if (trimmed.length > 50) {
      throw new Error('Equipment type cannot exceed 50 characters')
    }

    this.value = trimmed
  }

  toValue(): string {
    return this.value
  }

  equals(other: EquipmentType): boolean {
    return this.value === other.toValue()
  }

  toString(): string {
    return this.value
  }
}
