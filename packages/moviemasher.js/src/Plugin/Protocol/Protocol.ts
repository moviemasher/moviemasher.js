import { 
  ClientAudioDataOrError, ClientFontDataOrError, ClientImageDataOrError, 
  JsonRecordDataOrError, JsonRecordsDataOrError, ClientVideoDataOrError, PathDataOrError 
} from "../../Helpers/ClientMedia/ClientMedia"
import { PotentialError } from "../../Helpers/Error/Error"
import { AudioType, FontType, ImageType, RecordsType, RecordType, VideoType } from "../../Setup/Enums"
import { LoadType } from "../../Setup/LoadType"
import { Request, RequestRecord } from "../../Helpers/Request/Request"
import { Plugin, ProtocolType } from "../Plugin"

export type Protocol = string | HttpProtocol | HttpsProtocol | BlobProtocol | FileProtocol

export type HttpProtocol = 'http'
export const HttpProtocol: HttpProtocol = 'http'
export type HttpsProtocol = 'https'
export const HttpsProtocol: HttpsProtocol = 'https'
export type BlobProtocol = 'blob'
export const BlobProtocol: BlobProtocol = 'blob'
export type FileProtocol = 'file'
export const FileProtocol: FileProtocol = 'file'

/**
 * @category Plugin
 */
export interface ProtocolPlugin extends Plugin {
  type: ProtocolType
  protocol: Protocol
  promise: ProtocolPromise
}


/**
 * @category Plugin
 */
export interface PluginsByProtocol extends Record<Protocol, ProtocolPlugin> {}

export type ProtocolPromise = {
  (request: Request, type: ImageType): Promise<ClientImageDataOrError>
  (request: Request, type: AudioType): Promise<ClientAudioDataOrError>
  (request: Request, type: FontType): Promise<ClientFontDataOrError>
  (request: Request, type: VideoType): Promise<ClientVideoDataOrError>
  (request: Request, type: RecordType): Promise<JsonRecordDataOrError>
  (request: Request, type: RecordsType): Promise<JsonRecordsDataOrError>
  (request: Request, type?: LoadType): Promise<PathDataOrError>
}

export interface ProtocolResponse extends PotentialError {
  requests: RequestRecord
}


