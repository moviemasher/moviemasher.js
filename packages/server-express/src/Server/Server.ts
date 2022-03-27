import Express from "express"
import {
  Endpoint, JsonObject, StringObject, UnknownObject
} from "@moviemasher/moviemasher.js"

import { HostServers } from "../Host/Host"

interface ServerAuthentication extends UnknownObject {
  password?: string
  type?: string
  users?: StringObject
}

interface ServerArgs extends Endpoint {
  authentication?: ServerAuthentication
}

interface Server {
  stopServer(): void
  startServer(app: Express.Application, activeServers: HostServers): void
  init(userId: string): JsonObject
  id: string
}

export { Server, ServerArgs, ServerAuthentication }
