import { UserRole } from './user-role.vo'

describe('UserRole Value Object', () => {
  it('should create a valid user role', () => {
    const role = new UserRole('TEACHER')

    expect(role).toBeInstanceOf(UserRole)
    expect(role.toValue()).toBe('TEACHER')
  })

  it('should accept lowercase role and convert to uppercase', () => {
    const role = new UserRole('admin')

    expect(role.toValue()).toBe('ADMIN')
  })

  it('should throw an error for an invalid role', () => {
    expect(() => new UserRole('INVALID')).toThrowError(
      'Invalid user role. Must be one of: TEACHER, STAFF, ADMIN',
    )
  })

  it('should consider two roles with the same value as equal', () => {
    const role1 = new UserRole('TEACHER')
    const role2 = new UserRole('TEACHER')

    expect(role1.equals(role2)).toBe(true)
  })

  it('should consider two roles with different values as not equal', () => {
    const role1 = new UserRole('TEACHER')
    const role2 = new UserRole('ADMIN')

    expect(role1.equals(role2)).toBe(false)
  })

  describe('Permission checks', () => {
    it('should identify admin role correctly', () => {
      const role = new UserRole('ADMIN')

      expect(role.isAdmin()).toBe(true)
      expect(role.isStaff()).toBe(false)
      expect(role.isTeacher()).toBe(false)
    })

    it('should identify staff role correctly', () => {
      const role = new UserRole('STAFF')

      expect(role.isStaff()).toBe(true)
      expect(role.isAdmin()).toBe(false)
      expect(role.isTeacher()).toBe(false)
    })

    it('should identify teacher role correctly', () => {
      const role = new UserRole('TEACHER')

      expect(role.isTeacher()).toBe(true)
      expect(role.isAdmin()).toBe(false)
      expect(role.isStaff()).toBe(false)
    })

    it('should allow admin to manage equipment', () => {
      const role = new UserRole('ADMIN')
      expect(role.canManageEquipment()).toBe(true)
    })

    it('should allow staff to manage equipment', () => {
      const role = new UserRole('STAFF')
      expect(role.canManageEquipment()).toBe(true)
    })

    it('should not allow teacher to manage equipment', () => {
      const role = new UserRole('TEACHER')
      expect(role.canManageEquipment()).toBe(false)
    })

    it('should only allow admin to manage users', () => {
      const admin = new UserRole('ADMIN')
      const staff = new UserRole('STAFF')
      const teacher = new UserRole('TEACHER')

      expect(admin.canManageUsers()).toBe(true)
      expect(staff.canManageUsers()).toBe(false)
      expect(teacher.canManageUsers()).toBe(false)
    })

    it('should allow admin, staff and teacher to confirm scheduling', () => {
      const admin = new UserRole('ADMIN')
      const staff = new UserRole('STAFF')
      const teacher = new UserRole('TEACHER')

      expect(admin.canConfirmScheduling()).toBe(true)
      expect(staff.canConfirmScheduling()).toBe(true)
      expect(teacher.canConfirmScheduling()).toBe(true)
    })
  })
})
