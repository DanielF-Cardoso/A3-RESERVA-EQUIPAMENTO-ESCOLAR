export class LastUserCannotBeInactivatedError extends Error {
  constructor(message: string = 'Cannot inactivate the last user') {
    super(message)
    this.name = 'LastUserCannotBeInactivatedError'
  }
}
