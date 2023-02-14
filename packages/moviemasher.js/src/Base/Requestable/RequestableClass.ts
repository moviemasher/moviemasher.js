import { UnknownRecord } from '../../declarations'
import { ClientMediaOrError, ClientMedia } from "../../ClientMedia/ClientMedia"
import { isObject, isPopulatedString } from '../../Utility/Is'
import { Requestable, RequestableObject } from './Requestable'
import { isRequest, Request } from "../../Helpers/Request/Request"
import { assertLoadType, ImageType, LoadType, SequenceType } from '../../Setup/Enums'
import { PropertiedClass } from '../Propertied'
import { requestMediaPromise } from '../../Utility/Request'
import { assertClientMedia } from '../../ClientMedia/ClientMediaFunctions'

export class RequestableClass extends PropertiedClass implements Requestable {
  constructor(object: RequestableObject) {
    super()
    const { id, type, kind, createdAt, request, clientMedia } = object 
    this.id = id
    if (isPopulatedString(type)) this.type = type
    if (isPopulatedString(createdAt)) this.createdAt = createdAt
    if (isPopulatedString(kind)) this.kind = kind
    if (isRequest(request)) this.request = request
    if (isObject(clientMedia)) this.clientMedia
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

  clientMedia?: ClientMedia

  get clientMediaPromise(): Promise<ClientMediaOrError> {
    const { clientMedia } = this
    if (clientMedia) return Promise.resolve({ clientMedia: clientMedia })

    const { request, loadType } = this
    
    console.log(this.constructor.name, 'clientMediaPromise...', loadType, request)
    return requestMediaPromise(request, loadType).then(orError => {
      if (orError.error) return orError
      const { clientMedia } = orError
      assertClientMedia(clientMedia)
      console.log(this.constructor.name, 'clientMediaPromise!', loadType, request, clientMedia?.constructor.name)

      this.clientMedia = clientMedia
      return { clientMedia }
    })
  }

  request: Request = { endpoint: {} }

  type: string = ''

  toJSON(): UnknownRecord {
    const { id, type, kind, createdAt, request } = this
    return { id, request, type, kind, createdAt }
  }
}