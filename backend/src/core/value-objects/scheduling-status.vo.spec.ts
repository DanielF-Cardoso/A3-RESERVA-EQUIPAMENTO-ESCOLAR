import { SchedulingStatus } from './scheduling-status.vo'

describe('SchedulingStatus Value Object', () => {
  it('should create a valid scheduling status', () => {
    const status = new SchedulingStatus('SCHEDULED')

    expect(status).toBeInstanceOf(SchedulingStatus)
    expect(status.toValue()).toBe('SCHEDULED')
  })

  it('should accept lowercase status and convert to uppercase', () => {
    const status = new SchedulingStatus('scheduled')

    expect(status.toValue()).toBe('SCHEDULED')
  })

  it('should throw an error for an invalid status', () => {
    expect(() => new SchedulingStatus('INVALID')).toThrowError(
      'Invalid scheduling status. Must be one of: SCHEDULED, CONFIRMED, COMPLETED, CANCELLED',
    )
  })

  it('should consider two statuses with the same value as equal', () => {
    const status1 = new SchedulingStatus('SCHEDULED')
    const status2 = new SchedulingStatus('SCHEDULED')

    expect(status1.equals(status2)).toBe(true)
  })

  it('should consider two statuses with different values as not equal', () => {
    const status1 = new SchedulingStatus('SCHEDULED')
    const status2 = new SchedulingStatus('CONFIRMED')

    expect(status1.equals(status2)).toBe(false)
  })

  describe('Status checks', () => {
    it('should identify scheduled status correctly', () => {
      const status = new SchedulingStatus('SCHEDULED')

      expect(status.isScheduled()).toBe(true)
      expect(status.isConfirmed()).toBe(false)
      expect(status.isCompleted()).toBe(false)
      expect(status.isCancelled()).toBe(false)
    })

    it('should identify confirmed status correctly', () => {
      const status = new SchedulingStatus('CONFIRMED')

      expect(status.isConfirmed()).toBe(true)
      expect(status.isScheduled()).toBe(false)
      expect(status.isCompleted()).toBe(false)
      expect(status.isCancelled()).toBe(false)
    })

    it('should identify completed status correctly', () => {
      const status = new SchedulingStatus('COMPLETED')

      expect(status.isCompleted()).toBe(true)
      expect(status.isScheduled()).toBe(false)
      expect(status.isConfirmed()).toBe(false)
      expect(status.isCancelled()).toBe(false)
    })

    it('should identify cancelled status correctly', () => {
      const status = new SchedulingStatus('CANCELLED')

      expect(status.isCancelled()).toBe(true)
      expect(status.isScheduled()).toBe(false)
      expect(status.isConfirmed()).toBe(false)
      expect(status.isCompleted()).toBe(false)
    })
  })

  describe('Permission checks', () => {
    it('should allow editing when scheduled or confirmed', () => {
      const scheduled = new SchedulingStatus('SCHEDULED')
      const confirmed = new SchedulingStatus('CONFIRMED')
      const completed = new SchedulingStatus('COMPLETED')
      const cancelled = new SchedulingStatus('CANCELLED')

      expect(scheduled.canBeEdited()).toBe(true)
      expect(confirmed.canBeEdited()).toBe(true)
      expect(completed.canBeEdited()).toBe(false)
      expect(cancelled.canBeEdited()).toBe(false)
    })

    it('should allow cancelling when scheduled or confirmed', () => {
      const scheduled = new SchedulingStatus('SCHEDULED')
      const confirmed = new SchedulingStatus('CONFIRMED')
      const completed = new SchedulingStatus('COMPLETED')
      const cancelled = new SchedulingStatus('CANCELLED')

      expect(scheduled.canBeCancelled()).toBe(true)
      expect(confirmed.canBeCancelled()).toBe(true)
      expect(completed.canBeCancelled()).toBe(false)
      expect(cancelled.canBeCancelled()).toBe(false)
    })

    it('should only allow confirming when scheduled', () => {
      const scheduled = new SchedulingStatus('SCHEDULED')
      const confirmed = new SchedulingStatus('CONFIRMED')
      const completed = new SchedulingStatus('COMPLETED')
      const cancelled = new SchedulingStatus('CANCELLED')

      expect(scheduled.canBeConfirmed()).toBe(true)
      expect(confirmed.canBeConfirmed()).toBe(false)
      expect(completed.canBeConfirmed()).toBe(false)
      expect(cancelled.canBeConfirmed()).toBe(false)
    })

    it('should only allow completing when confirmed', () => {
      const scheduled = new SchedulingStatus('SCHEDULED')
      const confirmed = new SchedulingStatus('CONFIRMED')
      const completed = new SchedulingStatus('COMPLETED')
      const cancelled = new SchedulingStatus('CANCELLED')

      expect(scheduled.canBeCompleted()).toBe(false)
      expect(confirmed.canBeCompleted()).toBe(true)
      expect(completed.canBeCompleted()).toBe(false)
      expect(cancelled.canBeCompleted()).toBe(false)
    })
  })
})
