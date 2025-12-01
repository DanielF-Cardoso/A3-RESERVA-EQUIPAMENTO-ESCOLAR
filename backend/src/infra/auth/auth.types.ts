import { Request } from 'express'

export interface UserFromJwt {
  sub: string
  role: string
}

export type AuthenticatedRequest = Request & {
  user: UserFromJwt
}
