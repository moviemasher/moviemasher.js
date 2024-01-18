import type { DropType, Identified, NumberRecord, StringRecord, Strings, StringsRecord, UnknownRecord } from '@moviemasher/shared-lib/types.js'
import type { Application, RequestHandler } from 'express'

export interface ServerAuthentication extends UnknownRecord {
  password?: string
  type?: string
  users?: StringRecord
}

export interface ServerArgs {
  authentication?: ServerAuthentication
}

export interface Server extends Identified {
  stopServer(): void
  startServer(app: Application): Promise<void>
}

export interface EncodeServerArgs extends ServerArgs {}

export interface DecodeServerArgs extends ServerArgs {}

export interface TranscodeServerArgs extends ServerArgs {}

export interface UploadServerArgs extends ServerArgs {
  uploadLimits: Record<DropType, number>
  extensions: Record<DropType, Strings>
}

export interface WebServerArgs extends ServerArgs {
  sources: StringRecord
}

export interface DataServerArgs extends ServerArgs {}

export type ExpressHandler<T1, T2 = UnknownRecord> = RequestHandler<UnknownRecord, T1, T2, UnknownRecord, UnknownRecord>
