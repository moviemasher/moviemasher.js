import type { 
  DataOrError, ClientImage, ClientAudio, ClientFont, ClientVideo, Data 
} from '../../Helpers/ClientMedia/ClientMedia.js'
import type {AudioType, FontType, ImageType, RecordsType, RecordType, VideoType } from '../../Setup/Enums.js'
import type {LoadType} from '../../Setup/LoadType.js'
import type {EndpointRequest} from '../../Helpers/Request/Request.js'
import type {Plugin, ProtocolType} from '../Plugin.js'
import type {JsonRecord, JsonRecords} from '../../Types/Core.js'
import type {DefiniteError} from '../../Helpers/Error/Error.js'
import type {StringType} from '../../Utility/Scalar.js'

export type Protocol = string | HttpProtocol | HttpsProtocol | BlobProtocol | FileProtocol

export const ProtocolBlob: BlobProtocol = 'blob'
export const ProtocolFile: FileProtocol = 'file'
export const ProtocolHttp: HttpProtocol = 'http'
export const ProtocolHttps: HttpsProtocol = 'https'
export type BlobProtocol = 'blob'
export type FileProtocol = 'file'
export type HttpProtocol = 'http'
export type HttpsProtocol = 'https'

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
  (request: EndpointRequest, type: ImageType): Promise<DataOrError<ClientImage>>
  (request: EndpointRequest, type: AudioType): Promise<DataOrError<ClientAudio>>
  (request: EndpointRequest, type: FontType): Promise<DataOrError<ClientFont>>
  (request: EndpointRequest, type: VideoType): Promise<DataOrError<ClientVideo>>
  (request: EndpointRequest, type: RecordType): Promise<DataOrError<JsonRecord>>
  (request: EndpointRequest, type: RecordsType): Promise<DataOrError<JsonRecords>>
  (request: EndpointRequest, type: StringType): Promise<DataOrError<string>>
  (request: EndpointRequest, type: LoadType): Promise<ProtocolDataOrError>
}

