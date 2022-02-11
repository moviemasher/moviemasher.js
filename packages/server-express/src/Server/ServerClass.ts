import Express from "express"
import basicAuth from 'express-basic-auth'
import { JsonObject } from "@moviemasher/moviemasher.js"

import { Server, ServerArgs } from "./Server"
import { HostServers } from "../Host/Host"


class ServerClass implements Server {
  constructor(args: ServerArgs) { this.args = args }

  args: ServerArgs

  id = ''

  init(): JsonObject { return {} }

  startServer(app: Express.Application, _activeServers: HostServers): void {
    console.log(this.constructor.name, "startServer")

    const { authentication } = this.args
    if (authentication?.type === 'http') {
      const authorizer = (username: string, password: string): boolean => {
        if (!(username && password)) return false

        if (!authentication.password) return true

        return basicAuth.safeCompare(password, authentication.password)
      }
      const options: basicAuth.BasicAuthMiddlewareOptions = {
        users: authentication.users, authorizer,
        challenge: true, realm: 'moviemashers',
      }
      app.use(`/${this.id}/*`, basicAuth(options), (_req, _res, next) => { next() })
    }
   }

  stopServer(): void { }

  userFromRequest(req: unknown): string {
    const request = <basicAuth.IBasicAuthedRequest> req
    const { user } = request.auth
    return user
  }
}

export { ServerClass }
