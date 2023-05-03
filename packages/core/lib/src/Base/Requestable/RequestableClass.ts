import type { UnknownRecord } from '../../Types/Core.js'
import type { Requestable, RequestableObject } from './Requestable.js'
import type { EndpointRequest } from '../../Helpers/Request/Request.js'
import type { LoadType } from '../../Setup/LoadType.js'
import { assertLoadType } from '../../Setup/LoadType.js'
import { assertRequest } from '../../Helpers/Request/RequestFunctions.js'
import { isPopulatedString } from '../../Utility/Is.js'
import { PropertiedClass } from '../Propertied.js'
import { TypeImage, TypeSequence } from '../../Setup/Enums.js'

export class RequestableClass extends PropertiedClass implements Requestable {
  constructor(object: RequestableObject) {
    super()
    const { id, type, kind, createdAt, request } = object 
    this.id = id
    if (isPopulatedString(type)) this.type = type
    if (isPopulatedString(createdAt)) this.createdAt = createdAt
    if (isPopulatedString(kind)) this.kind = kind
    
    // assertRequest(request) 
    this.request = request || {}
    this.relativeRequest = this.request
  }

  createdAt = ''

  id: string

  kind = ''

  get loadType(): LoadType { 
    const { type } = this
    console.log(this.constructor.name, 'loadType', type)
    if (type === TypeSequence) return TypeImage

    assertLoadType(type)

    return type
  }

  private relativeRequest: EndpointRequest 

  request: EndpointRequest

  type = ''

  toJSON(): UnknownRecord {
    const { id, type, kind, createdAt, relativeRequest } = this
    const { response: _, ...request } = relativeRequest
    return { id, request, type, kind, createdAt }
  }
}