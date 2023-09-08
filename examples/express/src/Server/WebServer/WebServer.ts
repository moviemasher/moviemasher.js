import type { StringRecord } from '@moviemasher/runtime-shared'
import type { Server, ServerArgs } from '../Server.js'

export interface WebServerArgs extends ServerArgs {
  sources: StringRecord
}

export interface WebServer extends Server {}
