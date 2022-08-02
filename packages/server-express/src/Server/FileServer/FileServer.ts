import { ApiCallback, FileStoreRequest, FileStoreResponse, LoadType, NumberObject, UploadDescription } from "@moviemasher/moviemasher.js"
import { Server, ServerArgs, ServerHandler } from "../Server"


export const FileServerFilename = 'original'

export type LoadTypeExtensions = {
  [index in LoadType]: string[]
}

export interface FileServerArgs extends ServerArgs {
  uploadsPrefix: string
  uploadsRelative: string
  uploadLimits: NumberObject
  extensions: LoadTypeExtensions
}

export interface FileServer extends Server {
  args: FileServerArgs
  constructCallback(uploadDescription: UploadDescription, userId: string, id: string): ApiCallback
  property: string
  extensionLoadType(extension: string): LoadType | undefined
  store: ServerHandler<FileStoreResponse, FileStoreRequest>
  userUploadPrefix(id: string, user?: string): string
  withinLimits(size: number, type: string): boolean
}
