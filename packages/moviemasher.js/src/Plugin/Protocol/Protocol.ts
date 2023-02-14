import { Strings, UnknownRecord } from "../../declarations"
import { ClientAudioOrError, ClientFontOrError, ClientImageOrError, ClientVideoOrError, JsonRecordOrError } from "../../ClientMedia/ClientMedia"
import { PathOrError, PotentialError } from "../../Helpers/Error/Error"
import { AudioType, FontType, ImageType, JsonType, VideoType } from "../../Setup/Enums"
import { assertDefined } from "../../Utility/Is"
import { Request, RequestRecord } from "../../Helpers/Request/Request"
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
//   (request: Request, type: ImageType): Promise<ClientImageOrError>
//   (request: Request, type: VideoType): Promise<ClientVideoOrError>

//   // (request: Request, type: AudioType): Promise<ClientAudio>
//   // (request: Request, type: FontType): Promise<ClientFont>
//   // (request: Request, type: JsonType): Promise<UnknownRecord>
//   (request: Request, type?: string): Promise<PathOrError>
// }


export type ProtocolPromise = {
  (request: Request, type: ImageType): Promise<ClientImageOrError>
  (request: Request, type: AudioType): Promise<ClientAudioOrError>
  (request: Request, type: FontType): Promise<ClientFontOrError>
  (request: Request, type: VideoType): Promise<ClientVideoOrError>
  (request: Request, type: JsonType): Promise<JsonRecordOrError>
  (request: Request, type?: string): Promise<PathOrError>
}

export const ProtocolOptions: UnknownRecord = {}

export interface ProtocolResponse extends PotentialError {
  requests: RequestRecord
}

export const protocolName = (protocol: string) => (
  protocol.endsWith(':') ? protocol.slice(0, -1) : protocol
)

export const protocolImportPrefix = (id: string) => {
  const components: Strings = []
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

