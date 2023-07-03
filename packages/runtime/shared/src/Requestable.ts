import { UnknownRecord } from './Core.js'
import { Identified } from './Identified.js'
import { LoadType } from './LoadType.js'
import { Propertied } from './Propertied.js'
import { EndpointRequest } from './Request.js'
import { Typed } from './Typed.js'

export interface RequestObject {
  request: EndpointRequest
}

export interface RequestableObject extends Partial<RequestObject>, UnknownRecord, Identified, Partial<Typed> {
  createdAt?: string
  kind?: string
}

export interface Requestable extends RequestObject, Propertied, Identified, Typed {
  createdAt: string
  kind: string
  loadType: LoadType
}
