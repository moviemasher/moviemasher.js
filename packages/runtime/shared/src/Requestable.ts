import { UnknownRecord } from './Core.js'
import { Identified } from './Identified.js'
import { LoadType } from './LoadType.js'
import { Propertied } from './Propertied.js'
import { EndpointRequest } from './Request.js'
import { Typed } from './Typed.js'

export interface RequestableObject extends UnknownRecord, Identified, Partial<Typed> {
  createdAt?: string
  kind?: string
  request?: EndpointRequest
}

export interface Requestable extends Propertied, Identified, Typed {
  createdAt: string
  kind: string
  loadType: LoadType
  request: EndpointRequest
}
