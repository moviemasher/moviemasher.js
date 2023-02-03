import { RequestObject, RequestRecord } from "../Api/Api"
import { LoadedAudio, LoadedFont, LoadedImage, LoadedVideo } from "../declarations"
import { PathOrError, PotentialError } from "../MoveMe"
import { DefinitionType } from "../Setup/Enums"
import { assertDefined } from "../Utility/Is"

export type ProtocolPromise = {
  (request: RequestObject, type: DefinitionType.Image): Promise<LoadedImage>
  (request: RequestObject, type: DefinitionType.Audio): Promise<LoadedAudio>
  (request: RequestObject, type: DefinitionType.Font): Promise<LoadedFont>
  (request: RequestObject, type: DefinitionType.Video): Promise<LoadedVideo>
  (request: RequestObject, type?: string): Promise<PathOrError>
}

export interface Protocol {
  promise: ProtocolPromise
}


export interface ProtocolResponse extends PotentialError {
  requests: RequestRecord
}

export type ProtocolObject = Record<string, Protocol>

export const protocolName = (protocol: string) => (
  protocol.endsWith(':') ? protocol.slice(0, -1) : protocol
)

export const Protocols: ProtocolObject = {}

export const protocolImportPrefix = (id: string) => {
  const components = []

  const { window } = globalThis
  if (window) components.push()
  else components.push('@moviemasher/')
  components.push(id) 
  return components.join('/')
}

export const protocolLoadPromise = (protocol: string): Promise<Protocol> => {
  const id = protocolName(protocol)
  
  if (Protocols[id]) return Promise.resolve(Protocols[id])
  
  const prefix = protocolImportPrefix(id)
  return import(prefix).then(() => {
    const adaptor = Protocols[id]
    assertDefined(adaptor, prefix)
    
    return adaptor
  })
}

