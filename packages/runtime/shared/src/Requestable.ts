import type { Identified } from './Identified.js'
import type { EndpointRequest } from './Request.js'
import type { Typed } from './Typed.js'

export interface RequestObject {
  request: EndpointRequest
}

export interface Requestable extends RequestObject, Typed, Identified {
  createdAt?: string
}
