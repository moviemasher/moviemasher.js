import type { NumberRecord, StringsRecord } from '@moviemasher/runtime-shared'
import type { Server, ServerArgs } from '../Server.js'

export interface FileServerArgs extends ServerArgs {
  uploadsPrefix: string
  uploadsRelative: string
  uploadLimits: NumberRecord
  extensions: StringsRecord
}

export interface UploadDescription {
  name: string
  type: string
  size: number
}

export interface FileServer extends Server {}
