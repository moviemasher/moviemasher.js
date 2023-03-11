import Express from "express"
import basicAuth from 'express-basic-auth'
import { JsonRecord } from "@moviemasher/moviemasher.js"

import { Server, ServerArgs } from "./Server"
import { HostServers } from "../Host/Host"


export class ServerClass implements Server {
  constructor(public args: ServerArgs) {  }

  id = ''

  init(userId: string): JsonRecord { return {} }

  startServer(app: Express.Application, _activeServers: HostServers): Promise<void> {
    // console.log(this.constructor.name, "startServer")

    const { authentication } = this.args
    if (authentication?.type === 'basic') {
      const { password, users } = authentication

      const authorizer = (username: string, suppliedPassword: string): boolean => {
        if (!(username && suppliedPassword)) return false

        if (!password) return true

        return basicAuth.safeCompare(suppliedPassword, password)
      }
      const options: basicAuth.BasicAuthMiddlewareOptions = {
        users, authorizer, challenge: true, realm: 'moviemasher',
      }
      app.use(`/${this.id}/*`, basicAuth(options), (_req, _res, next) => { next() })
    }
    return Promise.resolve()
   }

  stopServer(): void { }

  userFromRequest(req: unknown): string {
    const request = <basicAuth.IBasicAuthedRequest> req
    const { user } = request.auth
    return user
  }
}
