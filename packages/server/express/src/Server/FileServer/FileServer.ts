import { ApiCallback, FileStoreRequest, FileStoreResponse, LoadType, NumberRecord, StringsRecord, UploadDescription } from "@moviemasher/lib-core"
import { Server, ServerArgs, ExpressHandler } from "../Server"


export const FileServerFilename = 'original'

export interface FileServerArgs extends ServerArgs {
  uploadsPrefix: string
  uploadsRelative: string
  uploadLimits: NumberRecord
  extensions: StringsRecord
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
