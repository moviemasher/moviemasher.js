import type { UnknownRecord } from '../../Types/Core.js'
import type { LoadType } from '../../Setup/LoadType.js'
import type { Identified } from '../Identified.js'
import type { Propertied } from '../Propertied.js'
import type { Typed } from '../Typed.js'
import type { EndpointRequest } from '../../Helpers/Request/Request.js'

export interface RequestableObject extends UnknownRecord, Identified, Partial<Typed> {
  createdAt?: string
  request?: EndpointRequest
  kind?: string
}

export interface Requestable extends Propertied, Identified, Typed {
  request: EndpointRequest
  createdAt: string
  loadType: LoadType
  kind: string
}

