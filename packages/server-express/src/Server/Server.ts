import Express from "express"
import {
  Endpoint, Identified, JsonRecord, StringRecord, UnknownRecord
} from "@moviemasher/moviemasher.js"

import { HostServers } from "../Host/Host"

export interface ServerAuthentication extends UnknownRecord {
  password?: string
  type?: string
  users?: StringRecord
}

export interface ServerArgs extends Endpoint {
  authentication?: ServerAuthentication
}

export interface Server extends Identified {
  stopServer(): void
  startServer(app: Express.Application, activeServers: HostServers): Promise<void>
  init(userId: string): JsonRecord
}

export type ExpressHandler<T1, T2 = UnknownRecord> = Express.RequestHandler<UnknownRecord, T1, T2, UnknownRecord, UnknownRecord>
