import type { 
  ClientImage, ClientAudio, ClientFont, ClientVideo} from '../../Helpers/ClientMedia/ClientMedia.js'
import type { DataOrError, Data } from "@moviemasher/runtime-shared"
import type { FontType, RecordsType, RecordType } from "@moviemasher/runtime-shared"
import type { AudioType, ImageType, VideoType } from '@moviemasher/runtime-shared'
import type { LoadType } from "@moviemasher/runtime-shared"
import type {EndpointRequest} from '@moviemasher/runtime-shared'
import type {Plugin, ProtocolType} from '@moviemasher/runtime-shared'
import type {JsonRecord, JsonRecords} from '@moviemasher/runtime-shared'
import type {DefiniteError} from '@moviemasher/runtime-shared'
import type { StringType } from "@moviemasher/runtime-shared"

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

