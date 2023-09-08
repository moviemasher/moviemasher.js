import { UnknownRecord } from './Core.js'
import { Identified } from './Identified.js'
import { LoadType } from './LoadType.js'
import { Propertied } from './Propertied.js'
import { EndpointRequest } from './Request.js'
import { Typed } from './Typed.js'

export interface RequestObject {
  request: EndpointRequest
}

export interface RequestableObject extends UnknownRecord, Identified, Partial<Typed> {
  createdAt?: string
  kind?: string
  request?: EndpointRequest
}

export interface Requestable extends Propertied, Typed, Identified {
  createdAt?: string
  kind: string
  request: EndpointRequest
  loadType: LoadType
}
