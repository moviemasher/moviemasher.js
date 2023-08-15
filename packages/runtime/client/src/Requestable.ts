import type { UnknownRecord, Identified, LoadType, Propertied, EndpointRequest, Typed, AssetType } from '@moviemasher/runtime-shared'
import type { MediaRequest } from './ClientMedia.js'

export interface RequestObject {
  request: EndpointRequest
}

export interface RequestableObject extends UnknownRecord, Identified, Partial<Typed> {
  createdAt?: string
  kind?: string
  request?: MediaRequest
}

export interface Requestable extends Propertied, Typed, Identified {
  createdAt?: string
  kind: string
  request: MediaRequest
  loadType: LoadType
}
