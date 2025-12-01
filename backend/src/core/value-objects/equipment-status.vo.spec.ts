import { EquipmentStatus } from './equipment-status.vo'

describe('EquipmentStatus Value Object', () => {
  it('should create a valid equipment status', () => {
    const status = new EquipmentStatus('AVAILABLE')

    expect(status).toBeInstanceOf(EquipmentStatus)
    expect(status.toValue()).toBe('AVAILABLE')
  })

  it('should accept lowercase status and convert to uppercase', () => {
    const status = new EquipmentStatus('available')

    expect(status.toValue()).toBe('AVAILABLE')
  })

  it('should throw an error for an invalid status', () => {
    expect(() => new EquipmentStatus('INVALID')).toThrowError(
      'Invalid equipment status. Must be one of: AVAILABLE, IN_USE, MAINTENANCE',
    )
  })

  it('should consider two statuses with the same value as equal', () => {
    const status1 = new EquipmentStatus('AVAILABLE')
    const status2 = new EquipmentStatus('AVAILABLE')

    expect(status1.equals(status2)).toBe(true)
  })

  it('should consider two statuses with different values as not equal', () => {
    const status1 = new EquipmentStatus('AVAILABLE')
    const status2 = new EquipmentStatus('IN_USE')

    expect(status1.equals(status2)).toBe(false)
  })

  describe('Status checks', () => {
    it('should identify available status correctly', () => {
      const status = new EquipmentStatus('AVAILABLE')

      expect(status.isAvailable()).toBe(true)
      expect(status.isInUse()).toBe(false)
      expect(status.isInMaintenance()).toBe(false)
    })

    it('should identify in use status correctly', () => {
      const status = new EquipmentStatus('IN_USE')

      expect(status.isInUse()).toBe(true)
      expect(status.isAvailable()).toBe(false)
      expect(status.isInMaintenance()).toBe(false)
    })

    it('should identify maintenance status correctly', () => {
      const status = new EquipmentStatus('MAINTENANCE')

      expect(status.isInMaintenance()).toBe(true)
      expect(status.isAvailable()).toBe(false)
      expect(status.isInUse()).toBe(false)
    })

    it('should only allow scheduling when available', () => {
      const available = new EquipmentStatus('AVAILABLE')
      const inUse = new EquipmentStatus('IN_USE')
      const maintenance = new EquipmentStatus('MAINTENANCE')

      expect(available.canBeScheduled()).toBe(true)
      expect(inUse.canBeScheduled()).toBe(false)
      expect(maintenance.canBeScheduled()).toBe(false)
    })
  })
})
