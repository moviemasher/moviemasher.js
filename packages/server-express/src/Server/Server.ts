import Express from "express"
import {
  Endpoint, JsonObject, StringObject, UnknownObject
} from "@moviemasher/moviemasher.js"

import { HostServers } from "../Host/Host"

export interface ServerAuthentication extends UnknownObject {
  password?: string
  type?: string
  users?: StringObject
}

export interface ServerArgs extends Endpoint {
  authentication?: ServerAuthentication
}

export interface Server {
  stopServer(): void
  startServer(app: Express.Application, activeServers: HostServers): void
  init(userId: string): JsonObject
  id: string
}

export type ServerHandler<T1, T2 = UnknownObject> = Express.RequestHandler<UnknownObject, T1, T2, UnknownObject, UnknownObject>
