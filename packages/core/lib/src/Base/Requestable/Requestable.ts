import type { UnknownRecord } from '@moviemasher/runtime-shared'
import type { LoadType } from '../../Setup/LoadType.js'
import type { Identified } from '@moviemasher/runtime-shared'
import type { Propertied } from '@moviemasher/runtime-shared'
import type { Typed } from '@moviemasher/runtime-shared'
import type { EndpointRequest } from '../../Helpers/Request/Request.js'

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

