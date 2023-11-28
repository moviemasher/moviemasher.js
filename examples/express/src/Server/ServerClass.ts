import type { Server, ServerArgs } from './Server.js'

import Express from 'express'
import basicAuth from 'express-basic-auth'

export class ServerClass implements Server {
  constructor(public args: ServerArgs) {}

  id = ''

  startServer(app: Express.Application): Promise<void> {
    const { authentication } = this.args
    if (authentication?.type === 'basic') {
      const { password, users } = authentication

      const authorizer = (username: string, suppliedPassword: string): boolean => {
        if (!(username && suppliedPassword)) return false

        if (!password) return true

        return basicAuth.safeCompare(suppliedPassword, password)
      }
      const options: basicAuth.BasicAuthMiddlewareOptions = {
        users, authorizer, challenge: true, realm: 'MOVIEMASHER',
      }
      app.use(`/${this.id}/*`, basicAuth(options), (_req, _res, next) => { next() })
    }
    return Promise.resolve()
   }

  stopServer(): void {}

  userFromRequest(req: unknown): string {
    const request = <basicAuth.IBasicAuthedRequest> req
    return request.auth?.user || ''
  }
}
