import { AudioDataOrError, FontDataOrError, ImageDataOrError, RecordDataOrError, RecordsDataOrError, VideoDataOrError } from "../../ClientMedia/ClientMedia"
import { PathDataOrError, PotentialError } from "../../Helpers/Error/Error"
import { AudioType, FontType, ImageType, LoadType, RecordsType, RecordType, VideoType } from "../../Setup/Enums"
import { Request, RequestRecord } from "../../Helpers/Request/Request"
import { Plugin, ProtocolType } from "../Plugin"
import { pluginPromise } from "../PluginFunctions"

export type HttpProtocol = 'http'
export const HttpProtocol: HttpProtocol = 'http'
export type HttpsProtocol = 'https'
export const HttpsProtocol: HttpsProtocol = 'https'
export type BlobProtocol = 'blob'
export const BlobProtocol: BlobProtocol = 'blob'
export type FileProtocol = 'file'
export const FileProtocol: FileProtocol = 'file'

export type Protocol = string | HttpProtocol | HttpsProtocol | BlobProtocol | FileProtocol


/**
 * @category Plugin
 */
export interface ProtocolPlugin extends Plugin {
  type: Protocol
  promise: ProtocolPromise
}


/**
 * @category Plugin
 */
export interface PluginsByProtocol extends Record<Protocol, ProtocolPlugin> {}

export type ProtocolPromise = {
  (request: Request, type: ImageType): Promise<ImageDataOrError>
  (request: Request, type: AudioType): Promise<AudioDataOrError>
  (request: Request, type: FontType): Promise<FontDataOrError>
  (request: Request, type: VideoType): Promise<VideoDataOrError>
  (request: Request, type: RecordType): Promise<RecordDataOrError>
  (request: Request, type: RecordsType): Promise<RecordsDataOrError>
  (request: Request, type?: LoadType): Promise<PathDataOrError>
}

export interface ProtocolResponse extends PotentialError {
  requests: RequestRecord
}

export const protocolLoadPromise = (protocol: string): Promise<ProtocolPlugin> => {
  return pluginPromise(ProtocolType, protocol).then(plugin => plugin as ProtocolPlugin)
}

