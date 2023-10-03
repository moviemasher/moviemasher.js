import type { UnknownRecord } from './Core.js'
import type { Identified } from './Identified.js'
import type { EndpointRequest } from './Request.js'
import type { Typed } from './Typed.js'

export interface RequestObject {
  request: EndpointRequest
}

export interface RequestableObject extends UnknownRecord, Partial<Identified>, Typed {
  createdAt?: string
  request: EndpointRequest
}

export interface Requestable extends RequestObject, Typed, Identified {
  createdAt?: string
  request: EndpointRequest
}
