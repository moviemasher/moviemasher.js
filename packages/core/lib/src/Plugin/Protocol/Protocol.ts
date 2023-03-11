import { 
  
  DataOrError, ClientImage, ClientAudio, ClientFont, ClientVideo, Data 
} from "../../Helpers/ClientMedia/ClientMedia"
import { AudioType, FontType, ImageType, RecordsType, RecordType, VideoType } from "../../Setup/Enums"
import { LoadType } from "../../Setup/LoadType"
import { Request } from "../../Helpers/Request/Request"
import { Plugin, ProtocolType } from "../Plugin"
import { JsonRecord, JsonRecords } from "../../Types/Core"
import { DefiniteError } from "../../Helpers/Error/Error"
import { StringType } from "../../Utility/Scalar"

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

export type ProtocolData = Data<ClientImage> | Data<ClientAudio> | Data<ClientFont> | Data<ClientVideo> | Data<JsonRecord> | Data<JsonRecords> | Data<string> 
export type ProtocolDataOrError = DefiniteError | ProtocolData

export type ProtocolPromise = {
  (request: Request, type: ImageType): Promise<DataOrError<ClientImage>>
  (request: Request, type: AudioType): Promise<DataOrError<ClientAudio>>
  (request: Request, type: FontType): Promise<DataOrError<ClientFont>>
  (request: Request, type: VideoType): Promise<DataOrError<ClientVideo>>
  (request: Request, type: RecordType): Promise<DataOrError<JsonRecord>>
  (request: Request, type: RecordsType): Promise<DataOrError<JsonRecords>>
  (request: Request, type: StringType): Promise<DataOrError<string>>
  (request: Request, type: LoadType): Promise<ProtocolDataOrError>
}

