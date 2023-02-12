import { JsonRecord, UnknownRecord } from "../../declarations"
import { ClientAudioOrError, ClientFontOrError, ClientImageOrError, ClientVideoOrError, JsonRecordOrError, LoadedAudio, LoadedFont, LoadedImage, LoadedVideo } from "../../Load/Loaded"
import { PathOrError, PotentialError } from "../../Helpers/Error/Error"
import { AudioType, FontType, ImageType, JsonType, VideoType } from "../../Setup/Enums"
import { assertDefined } from "../../Utility/Is"
import { RequestObject, RequestRecord } from "../../Api/Api"
import { Plugin } from "../Plugin"
import { Plugins } from "../Plugins"

export type ProtocolHttp = 'http'
export const ProtocolHttp: ProtocolHttp = 'http'
export type ProtocolHttps = 'https'
export const ProtocolHttps: ProtocolHttps = 'https'
export type ProtocolBlob = 'blob'
export const ProtocolBlob: ProtocolBlob = 'blob'
export type ProtocolFile = 'file'
export const ProtocolFile: ProtocolFile = 'file'

export type Protocol = string | ProtocolHttp | ProtocolHttps | ProtocolBlob | ProtocolFile

export interface ProtocolPlugin extends Plugin {
  type: Protocol
  promise: ProtocolPromise
}
export type PluginsByProtocol = Record<Protocol, ProtocolPlugin>




// export type ProtocolPromise = {
//   (request: RequestObject, type: ImageType): Promise<ClientImageOrError>
//   (request: RequestObject, type: VideoType): Promise<ClientVideoOrError>

//   // (request: RequestObject, type: AudioType): Promise<LoadedAudio>
//   // (request: RequestObject, type: FontType): Promise<LoadedFont>
//   // (request: RequestObject, type: JsonType): Promise<UnknownRecord>
//   (request: RequestObject, type?: string): Promise<PathOrError>
// }


export type ProtocolPromise = {
  (request: RequestObject, type: ImageType): Promise<ClientImageOrError>
  (request: RequestObject, type: AudioType): Promise<ClientAudioOrError>
  (request: RequestObject, type: FontType): Promise<ClientFontOrError>
  (request: RequestObject, type: VideoType): Promise<ClientVideoOrError>
  (request: RequestObject, type: JsonType): Promise<JsonRecordOrError>
  (request: RequestObject, type?: string): Promise<PathOrError>
}

export const ProtocolOptions: UnknownRecord = {}

export interface ProtocolResponse extends PotentialError {
  requests: RequestRecord
}

export const protocolName = (protocol: string) => (
  protocol.endsWith(':') ? protocol.slice(0, -1) : protocol
)

export const protocolImportPrefix = (id: string) => {
  const components = []
  const { window } = globalThis
  if (window) components.push()
  else components.push('@moviemasher/')
  components.push(id) 
  return components.join('/')
}

export const protocolLoadPromise = (protocol: string): Promise<ProtocolPlugin> => {
  const id = protocolName(protocol)
  const { protocols } = Plugins
  if (protocols[id]) return Promise.resolve(protocols[id])
  
  const prefix = protocolImportPrefix(id)
  return import(prefix).then(() => {
    const adaptor = protocols[id]
    assertDefined(adaptor, prefix)
    
    return adaptor
  })
}

