import { UnknownRecord } from '../../Types/Core'
import { isPopulatedString } from '../../Utility/Is'
import { Requestable, RequestableObject } from './Requestable'
import { assertRequest, Request } from "../../Helpers/Request/Request"
import { ImageType, SequenceType } from '../../Setup/Enums'
import { assertLoadType, LoadType } from "../../Setup/LoadType"
import { PropertiedClass } from '../Propertied'

export class RequestableClass extends PropertiedClass implements Requestable {
  constructor(object: RequestableObject) {
    super()
    const { id, type, kind, createdAt, request } = object 
    this.id = id
    if (isPopulatedString(type)) this.type = type
    if (isPopulatedString(createdAt)) this.createdAt = createdAt
    if (isPopulatedString(kind)) this.kind = kind
    assertRequest(request) 
    this.request = request
    this.relativeRequest = request
  }

  createdAt = ''

  id: string

  kind = ''

  get loadType(): LoadType { 
    const { type } = this
    console.log(this.constructor.name, "loadType", type)
    if (type === SequenceType) return ImageType

    assertLoadType(type)

    return type
  }

  private relativeRequest: Request 

  request: Request

  type = ''

  toJSON(): UnknownRecord {
    const { id, type, kind, createdAt, relativeRequest } = this
    const { response, ...request } = relativeRequest
    return { id, request, type, kind, createdAt }
  }
}