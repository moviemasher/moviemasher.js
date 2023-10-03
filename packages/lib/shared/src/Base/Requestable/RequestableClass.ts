import type { ClientMediaRequest, } from '@moviemasher/runtime-client'
import type { Requestable, RequestableObject, UnknownRecord } from '@moviemasher/runtime-shared'

import { isPopulatedString } from '@moviemasher/runtime-shared'
import { PropertiedClass } from '../PropertiedClass.js'


// TODO: REMOVE ME!

export class RequestableClass extends PropertiedClass implements Requestable {
  constructor(object: RequestableObject) {
    super()
    const { id, type, createdAt, request = { endpoint: {} } } = object 
    if (id) this.id = id
    if (isPopulatedString(type)) this.type = type
    if (isPopulatedString(createdAt)) this.createdAt = createdAt
    
    this.request = request 
  }

  createdAt = ''

  id = ''

  request: ClientMediaRequest

  type = ''

  toJSON(): UnknownRecord {
    const { id, type, createdAt, request } = this
    return { id, request, type, createdAt }
  }
}