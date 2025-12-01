export class InactiveUserError extends Error {
  constructor(message: string = 'Inactive user') {
    super(message)
    this.name = 'InactiveUserError'
  }
}
