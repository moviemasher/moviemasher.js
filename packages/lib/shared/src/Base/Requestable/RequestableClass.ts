import type { ClientMediaRequest, } from '@moviemasher/runtime-client'
import type { LoadType, Requestable, RequestableObject, UnknownRecord } from '@moviemasher/runtime-shared'

import { IMAGE, SEQUENCE, isPopulatedString } from '@moviemasher/runtime-shared'
import { assertLoadType } from '../../Setup/LoadType.js'
import { PropertiedClass } from '../PropertiedClass.js'

export class RequestableClass extends PropertiedClass implements Requestable {
  constructor(object: RequestableObject) {
    super()
    const { id, type, kind, createdAt, request } = object 
    this.id = id
    if (isPopulatedString(type)) this.type = type
    if (isPopulatedString(createdAt)) this.createdAt = createdAt
    if (isPopulatedString(kind)) this.kind = kind
    
    this.request = request || {}
    this.relativeRequest = this.request
  }

  createdAt = ''

  id: string

  kind = ''

  get loadType(): LoadType { 
    const { type } = this
    // console.log(this.constructor.name, 'loadType', type)
    if (type === SEQUENCE) return IMAGE

    assertLoadType(type)

    return type
  }

  private relativeRequest: ClientMediaRequest 

  request: ClientMediaRequest

  type = ''

  toJSON(): UnknownRecord {
    const { id, type, kind, createdAt, relativeRequest } = this
    const { response: _, ...request } = relativeRequest
    return { id, request, type, kind, createdAt }
  }
}