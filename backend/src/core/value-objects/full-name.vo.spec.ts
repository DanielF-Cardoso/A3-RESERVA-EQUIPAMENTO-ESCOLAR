import { FullName } from './full-name.vo'

describe('FullName Value Object', () => {
  it('should create a valid full name', () => {
    const fullName = new FullName('João Silva Santos')

    expect(fullName).toBeInstanceOf(FullName)
    expect(fullName.toValue()).toBe('João Silva Santos')
  })

  it('should extract first name correctly', () => {
    const fullName = new FullName('Maria da Silva')

    expect(fullName.getFirstName()).toBe('Maria')
  })

  it('should extract last name correctly', () => {
    const fullName = new FullName('João Pedro Silva')

    expect(fullName.getLastName()).toBe('Silva')
  })

  it('should trim extra spaces', () => {
    const fullName = new FullName('  João   Silva  ')

    expect(fullName.toValue()).toBe('João   Silva')
  })

  it('should throw an error for a full name shorter than 3 characters', () => {
    expect(() => new FullName('Jo')).toThrowError(
      'Full name must be at least 3 characters long.',
    )
  })

  it('should throw an error for a full name with only one word', () => {
    expect(() => new FullName('João')).toThrowError(
      'Full name must include at least first and last name.',
    )
  })

  it('should throw an error for an empty full name', () => {
    expect(() => new FullName('')).toThrowError(
      'Full name must be at least 3 characters long.',
    )
  })

  it('should throw an error for a full name with only spaces', () => {
    expect(() => new FullName('   ')).toThrowError(
      'Full name must be at least 3 characters long.',
    )
  })

  it('should consider two full names with the same value as equal', () => {
    const fullName1 = new FullName('João Silva')
    const fullName2 = new FullName('joão silva')

    expect(fullName1.equals(fullName2)).toBe(true)
  })

  it('should consider two full names with different values as not equal', () => {
    const fullName1 = new FullName('João Silva')
    const fullName2 = new FullName('Maria Santos')

    expect(fullName1.equals(fullName2)).toBe(false)
  })

  it('should handle composite names correctly', () => {
    const fullName = new FullName('Ana Maria da Silva Santos')

    expect(fullName.getFirstName()).toBe('Ana')
    expect(fullName.getLastName()).toBe('Santos')
    expect(fullName.toValue()).toBe('Ana Maria da Silva Santos')
  })
})
