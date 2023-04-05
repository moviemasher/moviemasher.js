import type { UnknownRecord } from '../../Types/Core.js'
import type { LoadType } from '../../Setup/LoadType.js'
import type { Identified } from '../Identified.js'
import type { Propertied } from '../Propertied.js'
import type { Typed } from '../Typed.js'
import type { Request } from '../../Helpers/Request/Request.js'

export interface RequestableObject extends UnknownRecord, Identified, Partial<Typed> {
  createdAt?: string
  request?: Request
  kind?: string
}

export interface Requestable extends Propertied, Identified, Typed {
  request: Request
  createdAt: string
  loadType: LoadType
  kind: string
}

