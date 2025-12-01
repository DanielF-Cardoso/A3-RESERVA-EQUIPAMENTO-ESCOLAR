export class FullName {
  private value: string

  constructor(fullName: string) {
    const trimmed = fullName.trim()
    
    if (!trimmed || trimmed.length < 3) {
      throw new Error('Full name must be at least 3 characters long.')
    }

    const parts = trimmed.split(' ').filter(part => part.length > 0)
    
    if (parts.length < 2) {
      throw new Error('Full name must include at least first and last name.')
    }

    this.value = trimmed
  }

  public getValue(): string {
    return this.value
  }

  public getFirstName(): string {
    return this.value.split(' ')[0]
  }

  public getLastName(): string {
    const parts = this.value.split(' ')
    return parts[parts.length - 1]
  }

  public equals(fullName: FullName): boolean {
    return this.value.toLowerCase() === fullName.getValue().toLowerCase()
  }

  public toValue(): string {
    return this.value
  }
}
