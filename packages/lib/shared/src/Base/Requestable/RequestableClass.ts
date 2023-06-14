import type { UnknownRecord } from '@moviemasher/runtime-shared'
import type { Requestable, RequestableObject } from '@moviemasher/runtime-shared'
import type { EndpointRequest } from '@moviemasher/runtime-shared'
import type { LoadType } from "@moviemasher/runtime-shared"
import { assertLoadType } from '../../Setup/LoadType.js'
import { isPopulatedString } from "@moviemasher/runtime-shared"
import { PropertiedClass } from "../PropertiedClass.js"
import { TypeSequence } from "../../Setup/EnumConstantsAndFunctions.js"
import { TypeImage } from "@moviemasher/runtime-shared"

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