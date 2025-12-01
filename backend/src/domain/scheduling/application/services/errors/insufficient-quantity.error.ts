export class InsufficientQuantityError extends Error {
  constructor(message: string = 'Insufficient equipment quantity available') {
    super(message)
    this.name = 'InsufficientQuantityError'
  }
}
