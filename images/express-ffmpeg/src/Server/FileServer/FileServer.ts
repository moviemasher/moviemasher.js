
import type { LoadType, NumberRecord, StringsRecord } from '@moviemasher/runtime-shared'
import type { Server, ServerArgs, ExpressHandler } from '../Server.js'
import type { FileStoreRequest, FileStoreResponse } from '../../Api/File.js'
import type { ApiCallback } from '../../Api/Api.js'


export const FileServerFilename = 'original'

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

export interface FileServer extends Server {
  args: FileServerArgs
  constructCallback(uploadDescription: UploadDescription, userId: string, id: string): ApiCallback
  property: string
  extensionLoadType(extension: string): LoadType | undefined
  store: ExpressHandler<FileStoreResponse, FileStoreRequest>
  userUploadPrefix(id: string, user?: string): string
  withinLimits(size: number, type: string): boolean
}
