import type { Endpoint, Identified, JsonRecord, StringRecord, UnknownRecord } from '@moviemasher/runtime-shared'
import type { HostServers } from '../Host/Host.js'

import Express from 'express'

export interface ServerAuthentication extends UnknownRecord {
  password?: string
  type?: string
  users?: StringRecord
}

export interface ServerArgs {//extends Endpoint 
  authentication?: ServerAuthentication
}

export interface Server extends Identified {
  stopServer(): void
  startServer(app: Express.Application, activeServers: HostServers): Promise<void>
}

export type ExpressHandler<T1, T2 = UnknownRecord> = Express.RequestHandler<UnknownRecord, T1, T2, UnknownRecord, UnknownRecord>
